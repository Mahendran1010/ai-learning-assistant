class CalendarService {
    constructor() {
        this.calendarEvents = [];
    }

    // Add event to calendar (mock function)
    addEvent(event) {
        const newEvent = {
            id: Date.now(),
            title: event.title,
            start: event.start,
            end: event.end,
            description: event.description,
            location: event.location || 'Online',
            reminders: event.reminders || [
                { method: 'email', minutes: 30 },
                { method: 'popup', minutes: 5 }
            ]
        };

        this.calendarEvents.push(newEvent);
        
        console.log(`
            ==================================
            📅 CALENDAR EVENT ADDED
            Title: ${newEvent.title}
            Start: ${newEvent.start}
            End: ${newEvent.end}
            ==================================
        `);

        // In production, integrate with Google Calendar API
        // this.syncWithGoogleCalendar(newEvent);
        
        return newEvent;
    }

    // Create study schedule events
    createStudyEvents(schedule, userName) {
        const events = [];
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        days.forEach(day => {
            if (schedule.weeklyPlan && schedule.weeklyPlan[day]) {
                const dayPlan = schedule.weeklyPlan[day];
                
                dayPlan.slots.forEach((slot, index) => {
                    const event = this.addEvent({
                        title: `Study Session: ${slot.topic || 'Learning Session'}`,
                        start: this.getNextDateForDay(day, slot.start),
                        end: this.getNextDateForDay(day, slot.end),
                        description: `Study session for ${userName}. Focus on improving skills.`,
                        reminders: [
                            { method: 'email', minutes: 30 },
                            { method: 'popup', minutes: 5 }
                        ]
                    });
                    
                    events.push(event);
                });
            }
        });

        return events;
    }

    // Get next date for a given day and time
    getNextDateForDay(day, time) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDay = days.indexOf(day);
        
        const now = new Date();
        const currentDay = now.getDay();
        
        let daysToAdd = targetDay - currentDay;
        if (daysToAdd < 0) daysToAdd += 7;
        
        const [hours, minutes] = time.split(':').map(Number);
        
        const eventDate = new Date(now);
        eventDate.setDate(now.getDate() + daysToAdd);
        eventDate.setHours(hours, minutes, 0, 0);
        
        return eventDate.toISOString();
    }

    // Sync with Google Calendar (mock)
    syncWithGoogleCalendar(event) {
        // Google Calendar API integration would go here
        console.log('Syncing with Google Calendar:', event.title);
        
        // Example Google Calendar API call:
        // const event = {
        //   'summary': 'Google I/O 2015',
        //   'location': '800 Howard St., San Francisco, CA 94103',
        //   'description': 'A chance to hear more about Google\'s developer products.',
        //   'start': {
        //     'dateTime': '2015-05-28T09:00:00-07:00',
        //     'timeZone': 'America/Los_Angeles',
        //   },
        //   'end': {
        //     'dateTime': '2015-05-28T17:00:00-07:00',
        //     'timeZone': 'America/Los_Angeles',
        //   },
        // };
        //
        // const request = gapi.client.calendar.events.insert({
        //   'calendarId': 'primary',
        //   'resource': event,
        // });
        // request.execute(function(event) {
        //   console.log('Event created: ' + event.htmlLink);
        // });
    }

    // Get all calendar events
    getEvents() {
        return this.calendarEvents;
    }

    // Update event
    updateEvent(eventId, updates) {
        const index = this.calendarEvents.findIndex(e => e.id === eventId);
        if (index !== -1) {
            this.calendarEvents[index] = { ...this.calendarEvents[index], ...updates };
            return this.calendarEvents[index];
        }
        return null;
    }

    // Delete event
    deleteEvent(eventId) {
        this.calendarEvents = this.calendarEvents.filter(e => e.id !== eventId);
    }
}

const calendarService = new CalendarService();
export default calendarService;