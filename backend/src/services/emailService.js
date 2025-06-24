const nodemailer = require('nodemailer');
const { query } = require('../database/connection');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Configure email transporter based on environment
    if (process.env.NODE_ENV === 'production') {
      // Production: Use SendGrid or similar service
      this.transporter = nodemailer.createTransporter({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME || 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
    } else {
      // Development: Use Ethereal Email for testing
      this.transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: process.env.ETHEREAL_USER || 'ethereal.user@ethereal.email',
          pass: process.env.ETHEREAL_PASS || 'ethereal.pass'
        }
      });
    }
  }

  async sendEmail(to, subject, htmlContent, textContent = null) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@servicerw.rw',
        to,
        subject,
        html: htmlContent,
        text: textContent || this.stripHtml(htmlContent)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      
      // Log email in database
      await this.logEmail(to, subject, 'sent', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      
      // Log failed email
      await this.logEmail(to, subject, 'failed', null, error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  async logEmail(to, subject, status, messageId = null, errorMessage = null) {
    try {
      await query(`
        INSERT INTO email_logs (recipient, subject, status, message_id, error_message, sent_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
      `, [to, subject, status, messageId, errorMessage]);
    } catch (error) {
      console.error('Failed to log email:', error);
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  // Email Templates
  getInquiryNotificationTemplate(inquiry, business, customer) {
    const subject = `New Inquiry for ${business.business_name}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; }
          .inquiry-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Customer Inquiry</h1>
            <p>ServiceRW - Rwanda's Real Estate Marketplace</p>
          </div>
          
          <div class="content">
            <h2>Hello ${business.contact_person || 'Business Owner'},</h2>
            
            <p>You have received a new inquiry for <strong>${business.business_name}</strong>.</p>
            
            <div class="inquiry-details">
              <h3>Inquiry Details:</h3>
              <p><strong>Type:</strong> ${inquiry.inquiry_type}</p>
              <p><strong>Subject:</strong> ${inquiry.subject}</p>
              <p><strong>Priority:</strong> ${inquiry.priority}</p>
              <p><strong>Received:</strong> ${new Date(inquiry.created_at).toLocaleString()}</p>
            </div>
            
            <div class="inquiry-details">
              <h3>Customer Information:</h3>
              <p><strong>Name:</strong> ${inquiry.customer_name}</p>
              <p><strong>Email:</strong> ${inquiry.customer_email}</p>
              ${inquiry.customer_phone ? `<p><strong>Phone:</strong> ${inquiry.customer_phone}</p>` : ''}
            </div>
            
            <div class="inquiry-details">
              <h3>Message:</h3>
              <p>${inquiry.message}</p>
            </div>
            
            <p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/business/dashboard?tab=inquiries" class="button">
                View & Respond to Inquiry
              </a>
            </p>
            
            <p><strong>Quick Response Tips:</strong></p>
            <ul>
              <li>Respond within 24 hours to maintain a good response rate</li>
              <li>Be professional and provide detailed information</li>
              <li>Ask clarifying questions if needed</li>
              <li>Include your contact information for direct communication</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>This email was sent by ServiceRW. You're receiving this because you own a business listing.</p>
            <p>To manage your notification preferences, visit your business dashboard.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return { subject, html };
  }

  getInquiryResponseTemplate(inquiry, business, response) {
    const subject = `Response to your inquiry - ${business.business_name}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; }
          .response-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Response to Your Inquiry</h1>
            <p>ServiceRW - Rwanda's Real Estate Marketplace</p>
          </div>
          
          <div class="content">
            <h2>Hello ${inquiry.customer_name},</h2>
            
            <p><strong>${business.business_name}</strong> has responded to your inquiry.</p>
            
            <div class="response-details">
              <h3>Your Original Inquiry:</h3>
              <p><strong>Subject:</strong> ${inquiry.subject}</p>
              <p><strong>Message:</strong> ${inquiry.message}</p>
              <p><strong>Sent:</strong> ${new Date(inquiry.created_at).toLocaleString()}</p>
            </div>
            
            <div class="response-details">
              <h3>Business Response:</h3>
              <p>${response}</p>
              <p><strong>Responded:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="response-details">
              <h3>Business Contact Information:</h3>
              <p><strong>Business:</strong> ${business.business_name}</p>
              ${business.phone ? `<p><strong>Phone:</strong> ${business.phone}</p>` : ''}
              ${business.email ? `<p><strong>Email:</strong> ${business.email}</p>` : ''}
              ${business.website_url ? `<p><strong>Website:</strong> ${business.website_url}</p>` : ''}
            </div>
            
            <p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/business/${business.category}/${business.slug}" class="button">
                View Business Profile
              </a>
            </p>
          </div>
          
          <div class="footer">
            <p>This email was sent by ServiceRW in response to your inquiry.</p>
            <p>If you have additional questions, you can contact the business directly using the information above.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return { subject, html };
  }

  // Send inquiry notification to business owner
  async sendInquiryNotification(inquiryId) {
    try {
      const result = await query(`
        SELECT 
          ci.*,
          b.business_name, b.contact_person, b.email as business_email, b.phone, b.website_url, b.category, b.slug,
          u.email as owner_email, u.first_name, u.last_name
        FROM customer_inquiries ci
        JOIN businesses b ON ci.business_id = b.id
        JOIN users u ON b.owner_id = u.id
        WHERE ci.id = $1
      `, [inquiryId]);

      if (result.rows.length === 0) {
        throw new Error('Inquiry not found');
      }

      const data = result.rows[0];
      const inquiry = {
        id: data.id,
        inquiry_type: data.inquiry_type,
        subject: data.subject,
        message: data.message,
        priority: data.priority,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        created_at: data.created_at
      };

      const business = {
        business_name: data.business_name,
        contact_person: data.contact_person || `${data.first_name} ${data.last_name}`,
        email: data.business_email,
        phone: data.phone,
        website_url: data.website_url,
        category: data.category,
        slug: data.slug
      };

      const template = this.getInquiryNotificationTemplate(inquiry, business);
      
      return await this.sendEmail(
        data.owner_email,
        template.subject,
        template.html
      );
    } catch (error) {
      console.error('Failed to send inquiry notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send response notification to customer
  async sendResponseNotification(inquiryId, responseMessage) {
    try {
      const result = await query(`
        SELECT 
          ci.*,
          b.business_name, b.email as business_email, b.phone, b.website_url, b.category, b.slug
        FROM customer_inquiries ci
        JOIN businesses b ON ci.business_id = b.id
        WHERE ci.id = $1
      `, [inquiryId]);

      if (result.rows.length === 0) {
        throw new Error('Inquiry not found');
      }

      const data = result.rows[0];
      const inquiry = {
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        subject: data.subject,
        message: data.message,
        created_at: data.created_at
      };

      const business = {
        business_name: data.business_name,
        email: data.business_email,
        phone: data.phone,
        website_url: data.website_url,
        category: data.category,
        slug: data.slug
      };

      const template = this.getInquiryResponseTemplate(inquiry, business, responseMessage);
      
      return await this.sendEmail(
        inquiry.customer_email,
        template.subject,
        template.html
      );
    } catch (error) {
      console.error('Failed to send response notification:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
