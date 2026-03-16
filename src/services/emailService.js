// This is a mock email service for development
// In production, replace with actual email API (SendGrid, NodeMailer, etc.)

class EmailService {
    constructor() {
        this.notificationsEnabled = true;
        this.emailTemplates = {
            studyReminder: {
                subject: "📚 Time to Study! - AI Learning Assistant",
                template: (data) => `
                    <h2>Hello ${data.name}!</h2>
                    <p>It's time for your scheduled study session.</p>
                    <h3>Today's Learning Plan:</h3>
                    <ul>
                        ${data.topics.map(topic => `<li>${topic}</li>`).join('')}
                    </ul>
                    <p><strong>Duration:</strong> ${data.duration} minutes</p>
                    <p><strong>Focus Area:</strong> ${data.skill}</p>
                    <br>
                    <p>Click here to start your session: <a href="${data.startLink}">Start Learning</a></p>
                    <br>
                    <p>Keep learning! 🚀</p>
                    <p>- AI Learning Assistant Team</p>
                `
            },
            missedSession: {
                subject: "⚠️ Missed Study Session - Reschedule Needed",
                template: (data) => `
                    <h2>Hi ${data.name},</h2>
                    <p>We noticed you missed your study session yesterday.</p>
                    <p><strong>Missed Topic:</strong> ${data.topic}</p>
                    <p><strong>Scheduled Time:</strong> ${data.scheduledTime}</p>
                    <br>
                    <p>Don't worry! We've automatically rescheduled it for:</p>
                    <p><strong>New Time:</strong> ${data.newTime}</p>
                    <br>
                    <p>Click here to view your updated schedule: <a href="${data.scheduleLink}">View Schedule</a></p>
                    <br>
                    <p>Stay consistent! 💪</p>
                    <p>- AI Learning Assistant Team</p>
                `
            },
            weeklyReport: {
                subject: "📊 Your Weekly Learning Report",
                template: (data) => `
                    <h2>Weekly Progress Report - ${data.week}</h2>
                    <p>Great job this week, ${data.name}!</p>
                    
                    <h3>📈 Statistics:</h3>
                    <ul>
                        <li><strong>Study Hours:</strong> ${data.studyHours} hours</li>
                        <li><strong>Topics Completed:</strong> ${data.topicsCompleted}</li>
                        <li><strong>Assignments Done:</strong> ${data.assignmentsDone}</li>
                        <li><strong>Current Streak:</strong> ${data.streak} days</li>
                    </ul>
                    
                    <h3>📚 Skills Improved:</h3>
                    <ul>
                        ${data.skillsImproved.map(skill => `
                            <li>${skill.name}: ${skill.improvement}% improvement</li>
                        `).join('')}
                    </ul>
                    
                    <h3>🎯 Next Week's Focus:</h3>
                    <ul>
                        ${data.nextFocus.map(topic => `<li>${topic}</li>`).join('')}
                    </ul>
                    
                    <br>
                    <p>View detailed analytics: <a href="${data.dashboardLink}">Your Dashboard</a></p>
                    <br>
                    <p>Keep up the great work! 🌟</p>
                    <p>- AI Learning Assistant Team</p>
                `
            },
            assignmentReminder: {
                subject: "📝 Assignment Due Soon",
                template: (data) => `
                    <h2>Assignment Reminder</h2>
                    <p>Hi ${data.name},</p>
                    <p>You have an assignment due soon:</p>
                    
                    <h3>${data.assignmentTitle}</h3>
                    <p><strong>Due:</strong> ${data.dueDate}</p>
                    <p><strong>Time Remaining:</strong> ${data.timeRemaining}</p>
                    <p><strong>Topic:</strong> ${data.topic}</p>
                    
                    <br>
                    <p>Start now: <a href="${data.assignmentLink}">Take Assignment</a></p>
                    <br>
                    <p>Good luck! 🍀</p>
                    <p>- AI Learning Assistant Team</p>
                `
            }
        };
    }

    // Send email (mock function)
    async sendEmail(to, type, data) {
        if (!this.notificationsEnabled) {
            console.log('Email notifications are disabled');
            return;
        }

        const template = this.emailTemplates[type];
        if (!template) {
            console.error(`Email template not found: ${type}`);
            return;
        }

        // Log email for development
        console.log(`
            ==================================
            📧 EMAIL NOTIFICATION
            To: ${to}
            Subject: ${template.subject}
            Type: ${type}
            ==================================
            ${template.template(data)}
            ==================================
        `);

        // In production, replace with actual email sending
        // Example with SendGrid:
        // const msg = {
        //     to: to,
        //     from: 'your-email@domain.com',
        //     subject: template.subject,
        //     html: template.template(data)
        // };
        // await sgMail.send(msg);

        return Promise.resolve({ success: true, message: 'Email sent successfully' });
    }

    // Schedule email notification
    scheduleNotification(email, type, data, scheduleTime) {
        const now = new Date();
        const scheduledTime = new Date(scheduleTime);
        const delay = scheduledTime - now;

        if (delay > 0) {
            setTimeout(() => {
                this.sendEmail(email, type, data);
            }, delay);
            
            console.log(`📅 Email scheduled for ${scheduledTime.toLocaleString()}`);
            return { scheduled: true, time: scheduledTime };
        } else {
            console.log('Scheduled time is in the past, sending immediately');
            return this.sendEmail(email, type, data);
        }
    }

    // Enable/disable notifications
    setNotificationsEnabled(enabled) {
        this.notificationsEnabled = enabled;
    }
}

// Create singleton instance
const emailService = new EmailService();
export default emailService;