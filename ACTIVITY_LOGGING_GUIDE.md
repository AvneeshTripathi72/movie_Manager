# User Activity Logging System

## Overview

The user activity logging system automatically tracks and records all user actions in the movie booking application. All activities are written to the `frontend/logs` folder for easy access and analysis.

## Location

- **Log Storage**: `c:\Users\avani\Desktop\movie_rec\frontend\logs`
- **Utility**: `backend\utils\activityLogger.js`
- **Middleware**: `backend\middleware\activityMiddleware.js`

## What Gets Logged

### Logged Activities Include:

- **Authentication**: Login, Logout, Register
- **Bookings**: Create, View, Cancel bookings
- **Movies**: Viewing movies and shows
- **Admin Actions**: All admin operations (create, update, delete)
- **User Info**: User ID, email, IP address, user agent
- **Request Details**: HTTP method, endpoint, query parameters
- **Timestamp**: ISO format timestamp for each activity

### Sensitive Data Protection

The following fields are automatically redacted:

- Passwords
- Tokens
- Secrets
- API Keys
- Credit Card information

## Log Files

### Daily Activity Logs

- **File Format**: `activity_YYYY-MM-DD.json`
- **Example**: `activity_2025-11-17.json`
- **Contents**: Array of activity objects logged throughout the day

### Activity Summary

- **File**: `activity_summary.json`
- **Contents**:
  - Total logs generated
  - Last updated timestamp
  - Statistics on total activities
  - User action counts
  - Action type distribution

## Activity Object Structure

```json
{
  "timestamp": "2025-11-17T10:30:45.123Z",
  "userId": "user123",
  "userEmail": "user@example.com",
  "method": "POST",
  "endpoint": "/api/bookings",
  "action": "CREATE_BOOKING",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "statusCode": 201,
  "query": {},
  "body": {
    "showId": "show123",
    "seats": [1, 2, 3],
    "totalAmount": 300
  }
}
```

## Action Types

| Action Type    | Description                 |
| -------------- | --------------------------- |
| LOGIN          | User login                  |
| LOGOUT         | User logout                 |
| REGISTER       | User registration           |
| CREATE_BOOKING | New booking created         |
| VIEW_BOOKING   | User viewed booking details |
| CANCEL_BOOKING | User cancelled booking      |
| VIEW_MOVIES    | User viewed movies          |
| VIEW_SHOWS     | User viewed shows           |
| VIEW_THEATRES  | User viewed theatres        |
| ADMIN_VIEW     | Admin viewing data          |
| ADMIN_CREATE   | Admin creating resource     |
| ADMIN_UPDATE   | Admin updating resource     |
| ADMIN_DELETE   | Admin deleting resource     |
| CREATE         | Generic create action       |
| UPDATE         | Generic update action       |
| DELETE         | Generic delete action       |
| VIEW           | Generic view action         |

## Usage

### Automatic Logging

All activities are logged automatically through the middleware. No additional code is needed.

### Accessing Activity Logs

#### In Node.js Code:

```javascript
const {
  logActivity,
  getUserActivities,
  getActivitiesByAction,
  getActivitiesByDateRange,
} = require("./utils/activityLogger");

// Get all activities for a specific user
const userActivities = getUserActivities("user123");

// Get all activities of a specific type
const bookingActivities = getActivitiesByAction("CREATE_BOOKING");

// Get activities within a date range
const startDate = new Date("2025-11-01");
const endDate = new Date("2025-11-30");
const monthlyActivities = getActivitiesByDateRange(startDate, endDate);
```

#### API Endpoints (Admin Only):

Endpoints can be added to `backend/routes/admin.js` to expose activity logs via API.

### Querying Logs

Read the JSON files directly or parse them with the provided utility functions.

## Integration

### Already Integrated:

- ✅ Activity middleware added to `app.js`
- ✅ Logs directory created in frontend folder
- ✅ Utility functions available for log querying

### Next Steps (Optional):

1. Create admin API endpoints to view logs
2. Add frontend dashboard to visualize activities
3. Export logs to CSV/Excel
4. Set up log rotation/cleanup policies

## Example Log File

### `activity_2025-11-17.json`:

```json
[
  {
    "timestamp": "2025-11-17T09:15:30.123Z",
    "userId": "user1",
    "userEmail": "john@example.com",
    "method": "POST",
    "endpoint": "/api/auth/login",
    "action": "LOGIN",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0",
    "statusCode": 200,
    "query": {},
    "body": {}
  },
  {
    "timestamp": "2025-11-17T09:16:45.456Z",
    "userId": "user1",
    "userEmail": "john@example.com",
    "method": "GET",
    "endpoint": "/api/movies",
    "action": "VIEW_MOVIES",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0",
    "statusCode": 200,
    "query": { "page": "1" },
    "body": {}
  }
]
```

## Summary

Your project now has a comprehensive user activity logging system:

- 📝 All user activities automatically logged
- 📁 Logs stored in `frontend/logs` folder
- 🔒 Sensitive data automatically redacted
- 📊 Summary statistics automatically generated
- 🔍 Easy-to-use query functions available
- ⚡ Non-blocking logging (asynchronous)

Start the server and all activities will be automatically logged!
