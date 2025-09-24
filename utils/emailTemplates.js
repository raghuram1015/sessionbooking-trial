const bookingConfirmationTemplate = (booking, session, user) => {
  return {
    subject: `Booking Confirmation - ${session.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333; margin-top: 0;">Hi ${user.name},</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Your booking has been confirmed! Here are the details:
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
            <h3 style="margin-top: 0; color: #333;">${session.title}</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${new Date(session.date).toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Time:</strong> ${session.startTime} - ${session.endTime}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Duration:</strong> ${session.duration} minutes</p>
            <p style="margin: 5px 0; color: #666;"><strong>Category:</strong> ${session.category}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Instructor:</strong> ${session.instructor.name}</p>
            ${session.location ? `<p style="margin: 5px 0; color: #666;"><strong>Location:</strong> ${session.location}</p>` : ""}
          </div>
          
          <div style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400E; font-size: 14px;">
              <strong>Important:</strong> You can cancel this booking up to 2 hours before the session starts.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you have any questions, please don't hesitate to contact us.
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
      Booking Confirmed!
      
      Hi ${user.name},
      
      Your booking has been confirmed! Here are the details:
      
      Session: ${session.title}
      Date: ${new Date(session.date).toLocaleDateString()}
      Time: ${session.startTime} - ${session.endTime}
      Duration: ${session.duration} minutes
      Category: ${session.category}
      Instructor: ${session.instructor.name}
      ${session.location ? `Location: ${session.location}` : ""}
      
      Important: You can cancel this booking up to 2 hours before the session starts.
      
      If you have any questions, please don't hesitate to contact us.
      
      Session Booker - Making learning accessible for everyone
    `,
  }
}

const bookingCancellationTemplate = (booking, session, user) => {
  return {
    subject: `Booking Cancelled - ${session.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Booking Cancelled</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333; margin-top: 0;">Hi ${user.name},</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Your booking has been cancelled. Here are the details:
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444;">
            <h3 style="margin-top: 0; color: #333;">${session.title}</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${new Date(session.date).toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Time:</strong> ${session.startTime} - ${session.endTime}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Instructor:</strong> ${session.instructor.name}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            We're sorry to see you go! You can always book another session anytime.
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
      Booking Cancelled
      
      Hi ${user.name},
      
      Your booking has been cancelled. Here are the details:
      
      Session: ${session.title}
      Date: ${new Date(session.date).toLocaleDateString()}
      Time: ${session.startTime} - ${session.endTime}
      Instructor: ${session.instructor.name}
      
      We're sorry to see you go! You can always book another session anytime.
      
      Session Booker - Making learning accessible for everyone
    `,
  }
}

const sessionReminderTemplate = (booking, session, user) => {
  return {
    subject: `Reminder: ${session.title} starts in 24 hours`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Session Reminder</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333; margin-top: 0;">Hi ${user.name},</h2>
          
          <p style="color: #666; line-height: 1.6;">
            This is a friendly reminder that your session starts in 24 hours!
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
            <h3 style="margin-top: 0; color: #333;">${session.title}</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${new Date(session.date).toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Time:</strong> ${session.startTime} - ${session.endTime}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Duration:</strong> ${session.duration} minutes</p>
            <p style="margin: 5px 0; color: #666;"><strong>Instructor:</strong> ${session.instructor.name}</p>
            ${session.location ? `<p style="margin: 5px 0; color: #666;"><strong>Location:</strong> ${session.location}</p>` : ""}
          </div>
          
          <div style="background-color: #DBEAFE; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1E40AF; font-size: 14px;">
              <strong>Tip:</strong> Make sure to arrive a few minutes early and bring any materials you might need!
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            We're excited to see you there! If you need to cancel, please do so at least 2 hours before the session.
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
      Session Reminder
      
      Hi ${user.name},
      
      This is a friendly reminder that your session starts in 24 hours!
      
      Session: ${session.title}
      Date: ${new Date(session.date).toLocaleDateString()}
      Time: ${session.startTime} - ${session.endTime}
      Duration: ${session.duration} minutes
      Instructor: ${session.instructor.name}
      ${session.location ? `Location: ${session.location}` : ""}
      
      Tip: Make sure to arrive a few minutes early and bring any materials you might need!
      
      We're excited to see you there! If you need to cancel, please do so at least 2 hours before the session.
      
      Session Booker - Making learning accessible for everyone
    `,
  }
}

module.exports = {
  bookingConfirmationTemplate,
  bookingCancellationTemplate,
  sessionReminderTemplate,
}
