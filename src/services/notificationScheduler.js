import emailService from './emailService';

class NotificationScheduler {
    constructor() {
        this.scheduledJobs = [];
        this.checkInterval = null;
    }

    // Start checking for notifications
    start(userEmail, userName, schedule) {
        this.stop(); // Clear existing interval
        
        this.checkInterval = setInterval(() => {
            this.checkAndSendNotifications(userEmail, userName, schedule);
        }, 60000); // Check every minute

        console.log('📨 Notification scheduler started');
    }

    // Stop checking
    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    // Check and send notifications
    async checkAndSendNotifications(email, name, schedule) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // Check study session reminders
        if (schedule && schedule.weeklyPlan && schedule.weeklyPlan[currentDay]) {
            const todayPlan = schedule.weeklyPlan[currentDay];
            
            todayPlan.slots.forEach(slot => {
                if (!slot.completed && !slot.notificationSent) {
                    const [slotHour, slotMinute] = slot.start.split(':').map(Number);
                    
                    // Send notification 5 minutes before session
                    if (slotHour === currentHour && slotMinute - currentMinute === 5) {
                        this.sendStudyReminder(email, name, slot);
                        slot.notificationSent = true;
                    }
                }
            });
        }

        // Check for missed sessions
        this.checkMissedSessions(email, name, schedule, currentDay, currentHour);
    }

    // Send study reminder
    sendStudyReminder(email, name, slot) {
        emailService.sendEmail(email, 'studyReminder', {
            name: name,
            topics: ['JavaScript Fundamentals', 'React Hooks'], // Dynamic from schedule
            duration: 60,
            skill: 'Web Development',
            startLink: 'http://localhost:3000/skills'
        });

        // Also show browser notification
        this.showBrowserNotification('Study Time!', `Your study session starts in 5 minutes`);
    }

    // Check for missed sessions
    checkMissedSessions(email, name, schedule, day, hour) {
        if (schedule && schedule.weeklyPlan && schedule.weeklyPlan[day]) {
            const todayPlan = schedule.weeklyPlan[day];
            
            todayPlan.slots.forEach(slot => {
                if (!slot.completed && !slot.missedNotified) {
                    const [slotHour] = slot.start.split(':').map(Number);
                    
                    // If current hour is past the slot hour
                    if (hour > slotHour) {
                        emailService.sendEmail(email, 'missedSession', {
                            name: name,
                            topic: slot.topic || 'Study Session',
                            scheduledTime: `${day} ${slot.start}`,
                            newTime: this.rescheduleTime(day, slot),
                            scheduleLink: 'http://localhost:3000/schedule'
                        });
                        
                        slot.missedNotified = true;
                    }
                }
            });
        }
    }

    // Calculate new time for rescheduled session
    rescheduleTime(day, slot) {
        // Simple rescheduling - move to next day same time
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const currentIndex = days.indexOf(day);
        const nextDay = days[(currentIndex + 1) % 7];
        
        return `${nextDay} ${slot.start}`;
    }

    // Show browser notification
    showBrowserNotification(title, message) {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            new Notification(title, { body: message });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body: message });
                }
            });
        }
    }

    // Request notification permission
    requestNotificationPermission() {
        if ("Notification" in window) {
            Notification.requestPermission();
        }
    }
}

const notificationScheduler = new NotificationScheduler();
export default notificationScheduler;