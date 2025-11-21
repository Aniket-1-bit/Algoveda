const pool = require('../config/database');

const createCertificatesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        course_id INTEGER NOT NULL REFERENCES courses(id),
        certificate_id VARCHAR(255) UNIQUE NOT NULL,
        issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completion_percentage INTEGER,
        final_score INTEGER,
        pdf_url VARCHAR(255),
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error('Error creating certificates table:', error);
  }
};

const generateCertificateId = () => {
  return `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

const issueCertificate = async (req, res, next) => {
  try {
    const { course_id } = req.body;
    const user_id = req.user.id;

    if (!course_id) {
      return res.status(400).json({ message: 'course_id is required' });
    }

    // Check if course is completed
    const enrollmentCheck = await pool.query(
      'SELECT * FROM course_enrollments WHERE user_id = $1 AND course_id = $2 AND completed = TRUE',
      [user_id, course_id]
    );

    if (enrollmentCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Course must be completed before issuing certificate' });
    }

    // Check if certificate already exists
    const existingCert = await pool.query(
      'SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2',
      [user_id, course_id]
    );

    if (existingCert.rows.length > 0) {
      return res.json(existingCert.rows[0]);
    }

    // Get course and user info
    const courseResult = await pool.query('SELECT title FROM courses WHERE id = $1', [course_id]);
    const userResult = await pool.query('SELECT full_name FROM users WHERE id = $1', [user_id]);

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Calculate completion percentage
    const progressResult = await pool.query(
      `SELECT AVG(completion_percentage) as avg_progress 
       FROM user_progress 
       WHERE user_id = $1 AND lesson_id IN (SELECT id FROM lessons WHERE course_id = $2)`,
      [user_id, course_id]
    );

    const completionPercentage = Math.round(progressResult.rows[0].avg_progress || 100);

    // Generate certificate
    const certificateId = generateCertificateId();
    const result = await pool.query(
      'INSERT INTO certificates (user_id, course_id, certificate_id, completion_percentage, final_score, verified) VALUES ($1, $2, $3, $4, 100, TRUE) RETURNING *',
      [user_id, course_id, certificateId, completionPercentage]
    );

    res.status(201).json({
      ...result.rows[0],
      course_title: courseResult.rows[0].title,
      user_name: userResult.rows[0].full_name,
    });
  } catch (error) {
    next(error);
  }
};

const getUserCertificates = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT c.*, co.title as course_title
       FROM certificates c
       JOIN courses co ON c.course_id = co.id
       WHERE c.user_id = $1
       ORDER BY c.issue_date DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getCertificateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT c.*, u.full_name, u.username, co.title as course_title, co.description
       FROM certificates c
       JOIN users u ON c.user_id = u.id
       JOIN courses co ON c.course_id = co.id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Allow viewing own certificate or public viewing
    const certificate = result.rows[0];
    if (certificate.user_id !== user_id && !certificate.verified) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(certificate);
  } catch (error) {
    next(error);
  }
};

const verifyCertificate = async (req, res, next) => {
  try {
    const { certificate_id } = req.params;

    const result = await pool.query(
      `SELECT c.*, u.full_name, u.username, co.title as course_title
       FROM certificates c
       JOIN users u ON c.user_id = u.id
       JOIN courses co ON c.course_id = co.id
       WHERE c.certificate_id = $1`,
      [certificate_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    const certificate = result.rows[0];
    if (!certificate.verified) {
      return res.status(400).json({ message: 'Certificate not verified' });
    }

    res.json({
      valid: true,
      certificate,
    });
  } catch (error) {
    next(error);
  }
};

const downloadCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query('SELECT * FROM certificates WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    const certificate = result.rows[0];

    // Verify ownership
    if (certificate.user_id !== user_id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Generate simple HTML certificate (in production, use pdfkit or similar)
    const userResult = await pool.query('SELECT full_name FROM users WHERE id = $1', [user_id]);
    const courseResult = await pool.query('SELECT title FROM courses WHERE id = $1', [
      certificate.course_id,
    ]);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .certificate { 
            width: 8.5in; height: 11in; 
            border: 20px solid #1e40af;
            padding: 40px;
            box-sizing: border-box;
            text-align: center;
          }
          .header { font-size: 48px; font-weight: bold; color: #1e40af; margin-bottom: 20px; }
          .divider { border-top: 3px solid #1e40af; width: 200px; margin: 20px auto; }
          .content { margin: 40px 0; }
          .name { font-size: 32px; font-weight: bold; margin: 20px 0; }
          .achievement { font-size: 18px; color: #666; }
          .footer { margin-top: 40px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">Certificate of Completion</div>
          <div class="divider"></div>
          <div class="content">
            <p>This is to certify that</p>
            <div class="name">${userResult.rows[0].full_name}</div>
            <p>has successfully completed the course</p>
            <div class="achievement">${courseResult.rows[0].title}</div>
            <p style="margin-top: 40px;">with a completion percentage of ${certificate.completion_percentage}%</p>
          </div>
          <div class="divider"></div>
          <div class="footer">
            <p>Certificate ID: ${certificate.certificate_id}</p>
            <p>Date: ${new Date(certificate.issue_date).toLocaleDateString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificate.certificate_id}.html`);
    res.send(html);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCertificatesTable,
  issueCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  downloadCertificate,
};
