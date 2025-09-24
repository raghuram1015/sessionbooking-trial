import nodemailer from "nodemailer"
import { bookingConfirmationTemplate, bookingCancellationTemplate, sessionReminderTemplate } from "./emailTemplates.js"

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export const sendBookingConfirmation = async (booking, session, user) => {
  try {
    const transporter = createTransporter()
    const template = bookingConfirmationTemplate(booking, session, user)

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    }

    await transporter.sendMail(mailOptions)
    console.log("✅ Booking confirmation email sent successfully")
  } catch (error) {
    console.error("❌ Error sending booking confirmation email:", error.message)
    // Don't throw error - email failure shouldn't break booking
  }
}

export const sendBookingCancellation = async (booking, session, user) => {
  try {
    const transporter = createTransporter()
    const template = bookingCancellationTemplate(booking, session, user)

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    }

    await transporter.sendMail(mailOptions)
    console.log("✅ Booking cancellation email sent successfully")
  } catch (error) {
    console.error("❌ Error sending booking cancellation email:", error.message)
  }
}

export const sendSessionReminder = async (booking, session, user) => {
  try {
    const transporter = createTransporter()
    const template = sessionReminderTemplate(booking, session, user)

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    }

    await transporter.sendMail(mailOptions)
    console.log("✅ Session reminder email sent successfully")
  } catch (error) {
    console.error("❌ Error sending session reminder email:", error.message)
  }
}

export const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Welcome to Session Booker!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Session Booker!</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${user.name},</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Welcome to Session Booker! We're excited to have you join our community of learners and instructors.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">What you can do:</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Browse and book sessions from expert instructors</li>
                <li>Create and manage your own sessions</li>
                <li>Track your bookings and session history</li>
                <li>Connect with other learners in your field</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Ready to get started? Log in to your account and explore the available sessions!
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px;">
                Session Booker - Making learning accessible for everyone
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Welcome to Session Booker!
        
        Hi ${user.name},
        
        Welcome to Session Booker! We're excited to have you join our community of learners and instructors.
        
        What you can do:
        - Browse and book sessions from expert instructors
        - Create and manage your own sessions
        - Track your bookings and session history
        - Connect with other learners in your field
        
        Ready to get started? Log in to your account and explore the available sessions!
        
        Session Booker - Making learning accessible for everyone
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log("✅ Welcome email sent successfully")
  } catch (error) {
    console.error("❌ Error sending welcome email:", error.message)
  }
}

export const sendBulkSessionReminders = async () => {
  try {
    // This would typically be called by a cron job
    // Find all bookings for sessions starting in 24 hours
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    // Note: This would need to be implemented with actual database queries
    console.log("📧 Bulk reminder system ready - implement with cron job")
  } catch (error) {
    console.error("❌ Error in bulk reminder system:", error.message)
  }
}
