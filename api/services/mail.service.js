const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send a grievance email to authorities
 * @param {Object} options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.html - Email HTML content
 * @param {String} [options.image] - Optional base64 image
 */
exports.sendGrievanceEmail = async ({ to, subject, html, image }) => {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      html,
    };

    if (image && image.startsWith('data:image')) {
      // Extract base64 content
      const base64Data = image.split(',')[1];
      const format = image.split(';')[0].split('/')[1];
      
      msg.attachments = [
        {
          content: base64Data,
          filename: `grievance-photo.${format}`,
          type: `image/${format}`,
          disposition: 'attachment',
        },
      ];
    }

    await sgMail.send(msg);
    console.log(`[Mail] Grievance email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('[Mail] SendGrid error:', error.response ? error.response.body : error);
    throw error;
  }
};
