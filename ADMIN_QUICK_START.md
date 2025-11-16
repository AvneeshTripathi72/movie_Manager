# Admin Dashboard Setup & Usage Guide

## Quick Start

### Accessing the Admin Panel

1. Navigate to `http://localhost:3000/admin`
2. Login with an admin account
3. You'll see the complete admin dashboard

### Creating Admin Users

To create an admin user, update your backend user creation:

```javascript
// Backend: auth controller
const user = new User({
  name: "Admin User",
  email: "admin@example.com",
  password: hashedPassword,
  role: "admin", // Set this to 'admin'
  phone: "1234567890",
  email_verified: true,
});
```

Or use MongoDB to update an existing user:

```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } });
```

## Admin Dashboard Sections

### 1. Overview Dashboard (/admin)

**What it shows:**

- Total movies, shows, and bookings
- Total revenue from all bookings
- Quick action buttons
- Recent activity feed

**Best for:** Getting a snapshot of your business metrics

### 2. Movies Management (/admin → Movies tab)

**What you can do:**

- ✅ Add new movies with full details
- ✅ Edit movie information (title, genre, duration, etc.)
- ✅ Delete movies from the system
- ✅ View all movies in a sortable table

**How to add a movie:**

1. Click "Add Movie" button
2. Fill in all required fields:
   - Title (required)
   - Genre
   - Duration in minutes
   - Release date
   - Language (dropdown)
   - Rating (U/UA/A/S)
   - Description
   - Poster URL
3. Click "Add Movie"

### 3. Shows Management (/admin → Shows tab)

**What you can do:**

- ✅ Create new shows linking movies to theatres
- ✅ Set show times and ticket prices
- ✅ Edit show details
- ✅ Delete shows

**How to add a show:**

1. Click "Add Show" button
2. Select movie from dropdown
3. Select theatre from dropdown
4. Pick date and time using datetime picker
5. Enter ticket price
6. Click "Add Show"

### 4. Bookings Management (/admin → Bookings tab)

**What you can do:**

- ✅ View all customer bookings
- ✅ Filter bookings by status (Pending, Confirmed, Cancelled)
- ✅ Confirm pending bookings (approve)
- ✅ Cancel bookings (refund)
- ✅ Track booking details and customer info

**How to manage a booking:**

1. Browse the bookings table
2. Click status filter buttons to find specific bookings
3. For pending bookings, use action buttons:
   - ✅ Check mark = Confirm booking
   - ❌ X mark = Cancel booking

**Booking Status:**

- 🟡 **Pending**: Awaiting confirmation
- 🟢 **Confirmed**: Approved by admin
- 🔴 **Cancelled**: Refunded to customer

### 5. Reports & Analytics (/admin → Reports tab)

**What you can see:**

- Total revenue generated
- Total tickets sold (bookings)
- Average ticket price
- Top performing movies
- Key business metrics:
  - Occupancy rate (how full shows are)
  - Customer satisfaction rating
  - Repeat customer percentage
  - Growth rate

**How to use reports:**

1. Select date range (7 days, 30 days, 90 days, all time)
2. View key statistics and trends
3. Identify top movies and popular genres
4. Track business growth and performance

## Important Features

### 1. Dark/Light Mode

- Toggle in the header (sun/moon icon)
- Respects system preference on first visit
- Persists your preference

### 2. Mobile Responsive

- Hamburger menu on mobile devices
- All tables scroll horizontally on small screens
- Touch-friendly buttons

### 3. Real-time Data

- All data fetches from backend API
- Changes reflect immediately
- Error handling with user-friendly messages

### 4. User Session

- Shows your admin username
- Logout button in sidebar
- Session managed by JWT tokens

## Common Tasks

### Task 1: Add a New Movie

```
1. Go to Movies tab
2. Click "Add Movie"
3. Enter: Title, Genre, Duration, Release Date, Language, Rating, Description, Poster URL
4. Click "Add Movie"
5. Movie appears in the table
```

### Task 2: Create a Show

```
1. Go to Shows tab
2. Click "Add Show"
3. Select movie, theatre, date/time, and price
4. Click "Add Show"
5. Show is now available for customers to book
```

### Task 3: Confirm Customer Booking

```
1. Go to Bookings tab
2. Find pending booking (yellow status)
3. Click the checkmark (✓) button
4. Booking confirmed (green status)
5. Customer receives confirmation
```

### Task 4: Generate Sales Report

```
1. Go to Reports tab
2. Select date range at top
3. View total revenue, bookings, and average price
4. Scroll to see top movies
5. Check key metrics and trends
```

## Best Practices

✅ **DO:**

- Check dashboards daily for bookings
- Confirm bookings promptly
- Monitor revenue trends
- Add shows ahead of time
- Keep movie information updated

❌ **DON'T:**

- Delete popular movies without checking
- Accidentally cancel customer bookings
- Leave pending bookings unconfirmed too long
- Set unrealistic ticket prices
- Forget to logout when done

## Troubleshooting

**Q: I see "Access Denied" message**
A: Your account doesn't have admin role. Contact database admin.

**Q: Movies/Shows not showing**
A: Verify backend API is running on correct port (default 5000).

**Q: Can't confirm bookings**
A: Backend admin endpoints may not be implemented. Check API documentation.

**Q: Theme changes not saving**
A: Clear browser cache and cookies, then try again.

## API Integration

The admin dashboard calls these backend endpoints:

```
GET    /movies                    → Fetch all movies
POST   /movies                    → Create movie
PUT    /movies/:id                → Update movie
DELETE /movies/:id                → Delete movie

GET    /shows                     → Fetch all shows
POST   /shows                     → Create show
PUT    /shows/:id                 → Update show
DELETE /shows/:id                 → Delete show

GET    /admin/bookings            → Fetch all bookings
POST   /admin/bookings/:id/confirm → Confirm booking
POST   /admin/bookings/:id/cancel  → Cancel booking

GET    /admin/reports/sales       → Get sales data
GET    /admin/reports/top-movies  → Get top movies
```

## Security Notes

- ✅ Admin access is role-based (role: 'admin')
- ✅ JWT tokens expire automatically
- ✅ All actions are logged (in backend)
- ✅ Sensitive data shown only to admins
- ✅ HTTPS recommended for production

## Performance Tips

1. Use filters to narrow down results
2. Avoid loading very large date ranges
3. Refresh page if data seems outdated
4. Clear browser cache monthly
5. Keep browser updated

## Support

For technical issues:

1. Check browser console (F12 → Console tab)
2. Review backend logs
3. Verify API connectivity
4. Check database connection

---

**Last Updated**: November 2024
**Version**: 1.0
**Admin Dashboard Status**: ✅ Fully Functional
