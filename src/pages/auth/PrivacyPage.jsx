import React from 'react';

export default function PrivacyPage() {
    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', color: '#eef5f0', lineHeight: '1.6' }}>
            <h1 style={{ color: '#6ee07f' }}>Privacy Policy for EcoSaathi</h1>
            <p>Last updated: April 29, 2026</p>

            <p>EcoSaathi ("we", "us", or "our") operates the EcoSaathi web application and WhatsApp chatbot. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.</p>

            <h2>1. Information Collection</h2>
            <p>We collect personal information such as your name, phone number, and city to provide personal eco-tracking features and leaderboard rankings. We also collect usage data (water usage, carbon footprints) to provide impact analysis.</p>

            <h2>2. WhatsApp Integration</h2>
            <p>By registering for "EcoSandhya", you agree to receive nightly automated messages on WhatsApp. We use the Meta WhatsApp Cloud API to send these messages. Your phone number is only used for these notifications and reflection tracking.</p>

            <h2>3. Data Storage</h2>
            <p>Your data is stored securely in MongoDB Atlas. We do not sell or share your personal data with third-party advertisers.</p>

            <h2>4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at ecosaathi.grievance@gmail.com</p>

            <div style={{ marginTop: '50px', padding: '20px', borderTop: '1px solid #333', textAlign: 'center' }}>
                <a href="/" style={{ color: '#6ee07f', textDecoration: 'none' }}>← Back to EcoSaathi</a>
            </div>
        </div>
    );
}
