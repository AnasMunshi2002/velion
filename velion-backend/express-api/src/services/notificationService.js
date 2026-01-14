class NotificationService {
  async sendNotification(userId, message, type = "info") {
    // Placeholder for sending notifications
    console.log(`Notification to ${userId}: ${message}`);
    return true;
  }

  async sendEmail(email, subject, body) {
    // Placeholder for email sending
    console.log(`Email to ${email}: ${subject}`);
    return true;
  }
}

module.exports = new NotificationService();
