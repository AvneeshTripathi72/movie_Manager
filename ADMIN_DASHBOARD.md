# Admin Dashboard Documentation

## Overview

The admin dashboard provides comprehensive management tools for the CineBook cinema booking platform. It includes features for managing movies, shows, bookings, and generating reports.

## Features

### 1. Dashboard Overview

- **Total Movies**: Count of all movies in the system
- **Active Shows**: Number of active cinema shows
- **Total Bookings**: Total tickets sold
- **Total Revenue**: Total income from all bookings
- **Quick Actions**: Shortcuts to common admin tasks

### 2. Movies Management

- **View All Movies**: Displays all movies with details (title, genre, duration, rating, release date)
- **Add Movie**: Create new movies with:
  - Movie title
  - Description
  - Genre
  - Duration (in minutes)
  - Release date
  - Language (English, Hindi, Tamil, Telugu, Kannada)
  - Rating (U, UA, A, S)
  - Poster URL
- **Edit Movie**: Modify existing movie details
- **Delete Movie**: Remove movies from the system

### 3. Shows Management

- **View All Shows**: Displays all cinema shows
- **Add Show**: Create new shows with:
  - Select movie
  - Select theatre
  - Show time (date and time)
  - Ticket price
- **Edit Show**: Modify show details
- **Delete Show**: Remove shows

### 4. Bookings Management

- **View All Bookings**: List all customer bookings
- **Filter Bookings**: Filter by status (All, Pending, Confirmed, Cancelled)
- **Booking Details**: View:
  - Booking ID
  - Customer name
  - Movie title
  - Selected seats
  - Total amount
  - Current status
- **Confirm Booking**: Approve pending bookings
- **Cancel Booking**: Cancel bookings if needed
- **Status Tracking**: Real-time booking status updates

### 5. Reports & Analytics

- **Sales Report**:
  - Total revenue generated
  - Total tickets sold
  - Average ticket price
  - Date range filtering (7 days, 30 days, 90 days, all time)
- **Top Movies**:
  - Ranking of movies by revenue
  - Ranking by number of bookings
  - Performance metrics
- **Key Metrics**:
  - Occupancy rate
  - Customer satisfaction rating
  - Repeat customer percentage
  - Growth rate
- **Trends Analysis**:
  - Revenue growth comparison
  - Customer base growth
  - Popular genres
  - Average ratings

## User Interface

### Navigation Sidebar

- Located on the left side (desktop) or hidden on mobile
- Contains navigation links to all admin sections
- User information and logout button at bottom
- Mobile-friendly hamburger menu

### Main Content Area

- Displays the selected section
- Responsive design for all screen sizes
- Dark/Light mode support with theme toggle

### Mobile Responsive

- Sidebar hidden by default on mobile
- Hamburger menu for navigation
- Mobile-optimized tables and forms
- Touch-friendly buttons and controls

## Accessing the Admin Dashboard

1. **URL**: `/admin`
2. **Access Control**: Only users with `admin` role can access
3. **Authentication Required**: Must be logged in

## API Endpoints Used

### Movies

- `GET /movies` - Get all movies
- `POST /movies` - Create new movie
- `PUT /movies/:id` - Update movie
- `DELETE /movies/:id` - Delete movie

### Shows

- `GET /shows` - Get all shows
- `POST /shows` - Create new show
- `PUT /shows/:id` - Update show
- `DELETE /shows/:id` - Delete show

### Bookings (Admin)

- `GET /admin/bookings` - Get all bookings
- `POST /admin/bookings/:id/confirm` - Confirm booking
- `POST /admin/bookings/:id/cancel` - Cancel booking

### Reports

- `GET /admin/reports/sales` - Get sales report
- `GET /admin/reports/top-movies` - Get top performing movies

## Component Structure

```
AdminDashboard (Main Container)
├── AdminOverview (Dashboard Home)
├── AdminMovies (Movies Management)
├── AdminShows (Shows Management)
├── AdminBookings (Bookings Management)
└── AdminReports (Reports & Analytics)
```

## Features by Component

### AdminOverview.jsx

- Statistics cards with icons
- Quick action buttons
- Recent activity display
- Performance at-a-glance

### AdminMovies.jsx

- Movies table with sorting
- Add/Edit movie form
- Delete functionality with confirmation
- Genre and language filters

### AdminShows.jsx

- Shows table with details
- Theatre and movie selection dropdowns
- Date/time picker for show times
- Price management

### AdminBookings.jsx

- Bookings table with filters
- Status indicators (color-coded)
- Quick confirm/cancel actions
- Customer information display

### AdminReports.jsx

- Revenue and booking statistics
- Top movies ranking
- Performance metrics cards
- Trend analysis
- Customizable date ranges

## Services & API Integration

### adminService.js

Provides helper functions for all admin operations:

- `movieService`: Movie CRUD operations
- `showService`: Show CRUD operations
- `theatreService`: Theatre management
- `bookingService`: Booking operations
- `adminService`: Admin-specific operations

## Theme Support

All admin components support:

- **Dark Mode**: Uses CSS variables `--bg-primary`, `--text-primary`, etc.
- **Light Mode**: Professional white/blue color scheme
- **Persistent Theme**: Theme preference saved in localStorage

## Error Handling

- Toast notifications for success/error messages
- Loading states with spinners
- Graceful error messages
- Try-catch blocks for all API calls

## Best Practices

1. **Always confirm** destructive actions (delete)
2. **Use filters** to find specific bookings quickly
3. **Check reports regularly** for business insights
4. **Manage inventory** by adding movies and shows timely
5. **Monitor bookings** to ensure customer satisfaction

## Future Enhancements

- User management page
- Theatre management page
- Advanced analytics with charts
- Email notifications for bookings
- Batch import/export functionality
- Payment processing integration
- Customer feedback management
- Dynamic pricing strategies

## Troubleshooting

**"Access Denied" message**

- Ensure you're logged in with an admin account
- Check user role in the database

**"Failed to fetch data" errors**

- Verify backend API is running
- Check network connectivity
- Review API endpoints in console logs

**Theme not persisting**

- Clear browser cache
- Check localStorage permissions
- Verify ThemeContext is properly initialized

## Support

For issues or feature requests related to the admin dashboard, please contact the development team.
