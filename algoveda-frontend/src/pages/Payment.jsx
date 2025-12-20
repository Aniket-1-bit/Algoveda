import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export const Payment = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [method, setMethod] = useState('card');

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setProcessing(false);
            alert("Payment Successful! Welcome to the course.");
            navigate(`/courses/${courseId}`);
        }, 2000);
    };

    return (
        <div className="dashboard page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="dashboard-card" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Secure Checkout</h2>

                <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--light-bg)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Total Amount:</span>
                        <span style={{ fontWeight: 'bold' }}>$49.99</span>
                    </div>
                </div>

                <form onSubmit={handlePayment}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Payment Method</label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                        >
                            <option value="card">Credit/Debit Card</option>
                            <option value="upi">UPI / GPay</option>
                            <option value="paypal">PayPal</option>
                        </select>
                    </div>

                    {method === 'card' && (
                        <>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Card Number</label>
                                <input type="text" placeholder="0000 0000 0000 0000" style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Expiry</label>
                                    <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>CVC</label>
                                    <input type="text" placeholder="123" style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
                                </div>
                            </div>
                        </>
                    )}

                    {method === 'upi' && (
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>UPI ID</label>
                            <input type="text" placeholder="user@upi" style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
                        disabled={processing}
                    >
                        {processing ? 'Processing...' : `Pay $49.99`}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn-secondary"
                        style={{ width: '100%', marginTop: '1rem', textAlign: 'center' }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};
