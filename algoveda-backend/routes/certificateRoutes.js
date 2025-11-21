const express = require('express');
const {
  issueCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  downloadCertificate,
} = require('../controllers/certificateController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public route - verify certificate by ID
router.get('/verify/:certificate_id', verifyCertificate);

// Protected routes
router.use(authenticateToken);
router.post('/', issueCertificate);
router.get('/', getUserCertificates);
router.get('/:id', getCertificateById);
router.get('/:id/download', downloadCertificate);

module.exports = router;
