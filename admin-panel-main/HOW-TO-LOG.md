# Quick Reference: How to Log (Admin Panel)

## For Users: Viewing Logs

### Where to Find Logs

1. **Login History** (All admin logins)
   - URL: `/loginHistory`
   - Location: Admin Panel Sidebar → "Login History"
   - Shows: All admin login attempts with IP, location, browser info

2. **Sub Admin Logs** (Your activities + your logins)
   - URL: `/sub-admin-logs`
   - Location: Admin Panel Sidebar → "Sub Admin Logs"
   - Shows: Your activity logs and login history

### How to View Logs

#### Login History Page
```
1. Log in to admin panel
2. Click "Login History" in sidebar
3. View table of all login attempts
4. Use filters to search specific data
5. Click column headers to sort
```

#### Sub Admin Logs Page
```
1. Log in to admin panel
2. Click "Sub Admin Logs" in sidebar
3. Choose tab:
   - "Admin Logs" = Your activities
   - "Login History" = Your logins
4. Use filters and sorting as needed
```

### Common Tasks

**Find failed login attempts:**
1. Go to Login History
2. Filter Status column by typing "failed"
3. Review results

**Check your recent activities:**
1. Go to Sub Admin Logs
2. Click "Admin Logs" tab
3. View recent actions

**See logins from specific country:**
1. Go to Login History
2. Type country name in "Country Name" filter
3. View filtered results

## For Developers: How Logging Works

### Backend (Automatic)

Login events are automatically logged when:
- Admin logs in successfully → Saved to LoginHistory collection
- Admin login fails → Saved with "failed" status
- Admin performs actions → Saved to AdminLogs collection

### Frontend Components

**LoginHistory Component**
```
File: components/defaults/LoginHistory/login-history-datatables.tsx
Endpoint: GET /api/admin/login-history
Data: All admin login attempts
```

**SubAdminLogs Component**
```
File: components/defaults/SubAdminLogs/sub-admin-logs-datatables.tsx
Endpoint: GET /api/admin/admin-logs-data?adminId={adminId}
Data: Logs specific to current admin
```

### Adding More Logging (Backend)

To log admin activities in your code:

```javascript
// Example: Log when admin creates a user
const adminLog = new AdminLogs({
  userId: user._id,
  taskType: 'Create',
  taskDescription: 'Created new user account',
  adminUserId: req.admin._id,
  adminEmail: req.admin.email,
});
await adminLog.save();
```

## Troubleshooting

**Can't see any logs?**
- Check if you're logged in
- Verify you have permission to view logs
- Try refreshing the page

**"No records found"?**
- No logs exist yet (perform some actions first)
- Filters are too restrictive (click "Clear Filters")

**Page won't load?**
- Check browser console (F12) for errors
- Verify backend API is running
- Check network connection

## Need More Help?

See full documentation: [LOGGING.md](./LOGGING.md)
