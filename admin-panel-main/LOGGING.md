# Admin Panel Logging Documentation

This document explains how to use and understand the logging functionality in the TravelPartner admin panel.

## Overview

The admin panel includes two logging pages that help you monitor and track administrative activities:

1. **Login History** - Track all admin login attempts
2. **Sub Admin Logs** - Monitor admin activities and login history for specific sub-admins

## Accessing the Logging Pages

### Navigation

The logging pages are accessible from the admin panel sidebar:

- **Login History**: Navigate to `/loginHistory` or click "Login History" in the sidebar (if you have access)
- **Sub Admin Logs**: Navigate to `/sub-admin-logs` or click "Sub Admin Logs" in the sidebar

### Permissions

- **Super Admin**: Has access to all logging pages
- **Sub Admin**: Access depends on assigned permissions/restrictions

## Login History Page

### Purpose
Displays a comprehensive log of all admin login attempts, including successful and failed logins.

### Features
- **Sortable Columns**: Click on any column header to sort data
- **Column Filters**: Filter data by specific values in each column
- **Pagination**: Browse through records 10 at a time
- **Clear Filters**: Reset all filters with one click
- **Real-time Status**: See success/failed status with color coding

### Data Displayed

| Column | Description |
|--------|-------------|
| **Login Date** | Timestamp of the login attempt (Asia/Kolkata timezone) |
| **Country Code** | Two-letter country code (e.g., IN, US) |
| **Country Name** | Full country name |
| **Region** | State or region name |
| **IP Address** | IP address of the login attempt |
| **Browser** | Browser used for login |
| **Device Type** | Type of device (Desktop, Mobile, Tablet) |
| **OS** | Operating system |
| **Status** | Success (green) or Failed (red) |

### How to Use

1. **View All Logins**: The page automatically loads all login history when opened
2. **Filter by Column**: Type in any filter box below column headers to search
3. **Sort Data**: Click column headers to sort ascending/descending
4. **Clear Filters**: Click "Clear Filters" button to reset all search fields

### Example Use Cases

- **Security Audit**: Check for failed login attempts from unusual locations
- **User Tracking**: Monitor when and from where admins are logging in
- **Compliance**: Generate reports of admin access for compliance purposes

## Sub Admin Logs Page

### Purpose
Track specific admin activities and login history for individual sub-admins. This page is particularly useful for monitoring sub-admin behavior.

### Features
- **Tabbed Interface**: Switch between "Admin Logs" and "Login History"
- **Scoped Data**: Shows data only for the currently logged-in admin
- **Sortable and Filterable**: Same powerful filtering as Login History
- **Activity Tracking**: See what actions admins have performed

### Admin Logs Tab

Displays administrative actions performed by the sub-admin:

| Column | Description |
|--------|-------------|
| **Date** | When the action was performed |
| **Task Type** | Type of action (e.g., "Create", "Update", "Delete") |
| **Task Description** | Detailed description of the action |
| **Admin Email** | Email of the admin who performed the action |

### Login History Tab

Similar to the main Login History page, but filtered for the current admin:

| Column | Description |
|--------|-------------|
| **Login Date** | Timestamp of login |
| **Country** | Country of login |
| **IP Address** | IP used for login |
| **Browser** | Browser information |
| **Status** | Success or Failed |

### How to Use

1. **Switch Tabs**: Click "Admin Logs" or "Login History" buttons at the top
2. **Filter Results**: Use the filter inputs under each column
3. **Sort Data**: Click column headers to sort
4. **Clear Filters**: Reset all filters with the "Clear Filters" button

## Technical Details

### API Endpoints

The logging pages connect to these backend endpoints:

- **Login History**: `GET /api/admin/login-history`
- **Sub Admin Logs**: `GET /api/admin/admin-logs-data?adminId={adminId}`

### Authentication

- All requests require authentication via token stored in `localStorage`
- Token is automatically included in request headers as `Authorization: {token}`

### Data Refresh

- Data is fetched when the page loads
- To see updated data, refresh the browser page

### Timezone

All timestamps are displayed in **Asia/Kolkata** timezone for consistency.

## Troubleshooting

### No Data Displayed

**Possible causes:**
1. No login history or activity logs exist yet
2. Authentication token expired - try logging in again
3. API endpoint is unavailable - check backend status

### "Loading..." Appears Indefinitely

**Possible causes:**
1. Network connection issue
2. Backend API is down
3. CORS or authentication error

**Solution:** Check browser console (F12) for error messages

### Filters Not Working

**Solution:** Click "Clear Filters" and try again. Ensure you're typing exact matches (case-insensitive).

## Best Practices

1. **Regular Monitoring**: Check login history regularly for security
2. **Filter by Date Range**: (Note: Date range filtering coming soon)
3. **Export Data**: (Note: Export functionality coming soon)
4. **Security Alerts**: Watch for failed login attempts or logins from unexpected locations

## Future Enhancements

Planned features for logging:
- [ ] Date range filtering
- [ ] Export to CSV/Excel/PDF
- [ ] Email alerts for suspicious activity
- [ ] More detailed activity logs
- [ ] Search across all fields
- [ ] Custom report generation

## Support

For issues or questions about logging functionality:
1. Check browser console for errors
2. Verify backend API is running
3. Confirm your admin permissions
4. Contact system administrator

---

**Last Updated**: February 2026
**Version**: 1.0
