const axios = require('axios');

// Handler for Paystack payment verification
module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { reference } = req.body;

        if (!reference) {
            return res.status(400).json({ message: 'Payment reference is required' });
        }

        try {
            // Make a request to Paystack to verify the payment
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            });

            if (response.data.data.status === 'success') {
                return res.status(200).json({
                    message: 'Payment successful',
                    data: response.data.data
                });
            } else {
                return res.status(400).json({
                    message: 'Payment verification failed',
                    data: response.data.data
                });
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
};
