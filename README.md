# Skydo Task Management

A collaborative task management web app with real-time updates, Google Calendar integration, and a modern UI built using **Next.js**, **Chakra UI**, **Socket.IO**, and **Google OAuth2**.

---

## Features

- Google OAuth Login
- Create, Edit, Complete & Delete Tasks
- Sync with Google Calendar
- Real-time Updates via WebSockets
- UI built using Chakra UI
- Task Metadata: Priority, Status, Assigned User, Start & Due Dates
- Filter: Toggle to show/hide completed tasks

---

## Tech Stack

### Frontend

- Next.js (App Router)
- TypeScript
- Chakra UI
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MySQL Database
- Socket.IO Server

### Integrations

- Google OAuth 2.0
- Google Calendar API

### Utilities & Libraries

- Axios (custom api config)
- Day.js (date formatting)
- LocalStorage (user session persistence)

---

## DB structure

### Task table (task)

1. id - int
2. eventId(google calendar event ID) - varchar(100)
3. title - varchar(250)
4. description - text
5. user(user id that the task was assigned to) - int
6. startDate - datetime
7. dueDate - datetime
8. priority(see below for mapping) - int
9. status(see below for mapping) - int
10. createdAt - datetime
11. updatedAt - datetime

### User table (user)

1. id - int
2. userId(google user ID) - varchar(250)
3. name - varchar(50)
4. accessToken(for google calendar) - varchar(250)
5. refreshToken(for persistent auth) - varchar(250)
6. email - varchar(100)
7. status - int
8. createdAt - datetime
9. updatedAt - datetime

### Priority and status mapping

Priority: 0 = low; 1 = medium; 2 = high
Status: 0 = to do; 1 = in progress; 2 = completed
