# Authentication Testing Guide

This guide will help you test the authentication system that connects your frontend with the backend API.

## Prerequisites

1. **Backend Running**: Make sure your FastAPI backend is running on `http://localhost:8000`
2. **Frontend Running**: Make sure your Next.js frontend is running (usually on `http://localhost:3000`)

## Test Steps

### 1. Test Registration

1. Go to `http://localhost:3000/register`
2. Try registering as a **Student**:
   - First Name: John
   - Last Name: Doe
   - Email: john@student.com
   - Academic Year: 3rd Year
   - Department: Computer Science & Engineering
   - Password: 123456
   - Confirm Password: 123456

3. Try registering as **HR**:
   - First Name: Jane
   - Last Name: Smith
   - Email: jane@company.com
   - Company Name: Tech Solutions
   - Password: hrpassword
   - Confirm Password: hrpassword

### 2. Test Login

1. Go to `http://localhost:3000/login`
2. Login with the credentials you just created
3. You should be redirected to the dashboard

### 3. Test Protected Routes

1. **Dashboard**: Go to `http://localhost:3000/dashboard`
   - Should show your user information
   - Should have a logout button

2. **Profile Page**: Go to `http://localhost:3000/profile`
   - Should show detailed user information
   - Should demonstrate that authentication is working

3. **Direct URL Access**: Try accessing these URLs without logging in:
   - You should be redirected to the login page

### 4. Test Authentication State

1. **Refresh Test**: After logging in, refresh the page
   - You should remain logged in
   - User data should persist

2. **Logout Test**: Click the logout button
   - Should clear the session
   - Should redirect to login page

3. **Token Test**: Check browser's localStorage
   - Should contain `sb:access_token` and `sb:user` when logged in
   - Should be cleared when logged out

## Expected Behavior

### ✅ Working Authentication:
- Registration creates new users in your backend database
- Login validates credentials and returns JWT token
- Protected routes redirect unauthenticated users
- User data persists across page refreshes
- Logout clears session and redirects

### 🚨 If Something's Not Working:

1. **Backend Connection Issues**:
   - Check if backend is running on port 8000
   - Check browser console for network errors
   - Verify CORS settings in backend

2. **Authentication Issues**:
   - Check if JWT_SECRET is set in backend
   - Verify token format in browser localStorage
   - Check backend logs for authentication errors

3. **Frontend Issues**:
   - Check browser console for JavaScript errors
   - Verify all components are properly imported
   - Check if toast notifications are working

## API Endpoints Used

- `POST /auth/register/student` - Register student
- `POST /auth/register/hr` - Register HR
- `POST /auth/login` - Login (all roles)

## Files Modified/Created

- `lib/auth.ts` - Authentication API service
- `contexts/auth-context.tsx` - React context for auth state
- `components/protected-route.tsx` - Protected route component
- `app/login/page.tsx` - Updated login page
- `app/register/page.tsx` - Updated register page
- `app/dashboard/page.tsx` - Protected dashboard
- `app/profile/page.tsx` - Test protected route
- `app/layout.tsx` - Added AuthProvider and Toaster

## Test Data

You can use the test data from your Postman collection:

**Student:**
- Email: john@student.com
- Password: 123456

**HR:**
- Email: jane@company.com
- Password: hrpassword

This should match the data in your `smart-internship-auth.postman_collection.json` file.

