# CORS Fix - Testing & Restart Guide

## ✅ Problem Solved

**Error**: `Access-Control-Allow-Origin: http://localhost:3000,http://localhost:5173,http://localhost:3001`

**Reason**: Multiple origins in a single header violates CORS specification

**Solution**: Parse comma-separated CORS_ORIGIN as array and let Express handle individual requests

---

## 🔧 What Was Changed

### File: `backend/src/app.js`

**Before:**

```javascript
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
```

**After:**

```javascript
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0)
  : ["http://localhost:3001", "http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);
```

---

## 🚀 How to Test

### Step 1: Restart Backend Server

```bash
# Terminal 1: Backend
cd backend
npm start

# You should see:
# ✅ Server running on http://localhost:5000
# ✅ Connected to MongoDB
# ✅ CORS configured with allowed origins
```

### Step 2: Verify CORS Configuration Loaded

Check console output:

```
CORS Origins: [ 'http://localhost:3001', 'http://localhost:3000', 'http://localhost:5173' ]
```

### Step 3: Start Frontend

```bash
# Terminal 2: Frontend
cd frontend
npm start

# Opens: http://localhost:3001
```

### Step 4: Test Registration/Login

1. Go to http://localhost:3001
2. Click **Register** or **Login**
3. Fill in the form
4. **Submit** the form
5. Monitor the Network tab (F12 → Network)

**Look for:**

- ✅ OPTIONS request (preflight) - Status 200
- ✅ POST request (actual) - Status 200
- ✅ Response includes correct CORS headers

### Step 5: Check Network Tab

Open DevTools (F12) → Network tab:

#### Preflight Request (OPTIONS)

```
Request Headers:
  Origin: http://localhost:3001
  Access-Control-Request-Method: POST
  Access-Control-Request-Headers: content-type

Response Headers:
  Access-Control-Allow-Origin: http://localhost:3001
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
```

#### Actual Request (POST)

```
Request Headers:
  Origin: http://localhost:3001
  Authorization: Bearer YOUR_TOKEN

Response Headers:
  Access-Control-Allow-Origin: http://localhost:3001
  Content-Type: application/json
```

---

## ✅ Success Indicators

You'll know it's fixed when:

- ✅ No CORS errors in browser console
- ✅ Register/Login forms work
- ✅ Movies page loads
- ✅ Can view movie details
- ✅ Can proceed to booking

**Console should show:**

```
✅ User registered successfully
✅ Redirecting to movies...
```

**NOT showing:**

```
❌ CORS policy: Response to preflight request doesn't pass...
❌ Access to XMLHttpRequest at '...' has been blocked by CORS
```

---

## 🔍 Troubleshooting

### Issue 1: Still Getting CORS Error

**Solution:**

1. Stop backend server (Ctrl+C)
2. Delete `node_modules` folder in backend
3. Run `npm install`
4. Restart backend: `npm start`

```bash
cd backend
rm -r node_modules
npm install
npm start
```

### Issue 2: Frontend Still on Old Port

**Solution:** Clear browser cache and cookies:

- Chrome: DevTools → Application → Clear Storage
- Or open in Incognito Mode

### Issue 3: Incorrect Origin URL

**Check:** Frontend is running on exactly one of:

- http://localhost:3001 ✅
- http://localhost:3000 ✅
- http://localhost:5173 ✅

NOT on:

- http://127.0.0.1:3001 ❌ (different from localhost)
- http://localhost:3001/ ❌ (trailing slash)

---

## 📋 Full Startup Checklist

- [ ] Backend installed (`npm install` done)
- [ ] Backend `.env` file exists with CORS_ORIGIN
- [ ] Frontend installed (`npm install` done)
- [ ] Frontend `.env` configured correctly
- [ ] Backend started: `npm start` in backend folder
- [ ] Frontend started: `npm start` in frontend folder
- [ ] Backend shows "Server running"
- [ ] Frontend opens on http://localhost:3001
- [ ] No errors in browser console
- [ ] Can submit registration form
- [ ] Received successful response

---

## 🎯 Testing Flow

1. **Start Backend**

   ```
   cd backend
   npm start
   ```

   Wait for: `✅ Server listening on port 5000`

2. **Start Frontend**

   ```
   cd frontend
   npm start
   ```

   Wait for: `✅ Compiled successfully!`

3. **Test Registration**

   - Open http://localhost:3001/register
   - Fill in details
   - Click Register
   - Check console for success

4. **Test Login**

   - Go to http://localhost:3001/login
   - Use registered credentials
   - Click Login
   - Should redirect to movies

5. **Test API Calls**
   - Browse movies
   - View movie details
   - Check bookings
   - All should work without CORS errors

---

## 📊 CORS Header Flow

```
Browser (http://localhost:3001)
    ↓
    ├─ Preflight: OPTIONS /api/auth/register
    │  Headers: Origin: http://localhost:3001
    │
Backend (http://localhost:5000)
    ↓
    ├─ Check: Is http://localhost:3001 allowed?
    │  Yes! Found in corsOrigins array
    │
    ├─ Response to OPTIONS:
    │  Access-Control-Allow-Origin: http://localhost:3001
    │  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
    │  Access-Control-Allow-Headers: Content-Type, Authorization
    │
Browser
    ↓
    ├─ Preflight passed! Send actual request.
    │
    ├─ Actual: POST /api/auth/register
    │  Headers:
    │    Origin: http://localhost:3001
    │    Content-Type: application/json
    │
Backend
    ↓
    ├─ Process request
    │
    ├─ Response:
    │  Access-Control-Allow-Origin: http://localhost:3001
    │  Status: 200 OK
    │  Body: { success: true, token: "..." }
    │
Browser
    ↓
    ✅ Request successful! No CORS error!
```

---

## 🎓 Understanding the Fix

### Old (Broken) Way:

```
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:3001
                ↓ (passed as string)
cors({ origin: "http://localhost:3000,http://localhost:5173,http://localhost:3001" })
                ↓ (sent as-is in header)
Access-Control-Allow-Origin: http://localhost:3000,http://localhost:5173,http://localhost:3001
                ↓ (INVALID - multiple values not allowed!)
❌ CORS Error
```

### New (Fixed) Way:

```
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:3001
                ↓ (split and parse)
corsOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001']
                ↓ (passed as array)
cors({ origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'] })
                ↓ (Express handles it)
For each request from 'http://localhost:3001':
Access-Control-Allow-Origin: http://localhost:3001
                ↓ (VALID - single origin!)
✅ Works!
```

---

## 📝 Environment Variables

Verify your `.env` files:

**Backend** (`backend/.env`):

```dotenv
PORT=5000
CORS_ORIGIN=http://localhost:3001,http://localhost:3000,http://localhost:5173
# ... other variables
```

**Frontend** (`frontend/.env`):

```dotenv
REACT_APP_API_URL=http://localhost:5000
# ... other variables
```

---

## 🎉 Expected Results

After applying the fix:

### ✅ Working Features

- User Registration
- User Login
- View Movies
- View Movie Details
- Browse Shows
- Make Bookings
- View Bookings
- Admin Dashboard (for admin users)

### ✅ CORS Headers

```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### ✅ Console Output

No errors! Only:

```
✅ Registered successfully
✅ Login successful
✅ Movies loaded
✅ Booking confirmed
```

---

## 🆘 Need Help?

1. **Check Backend Console**

   - Look for any error messages
   - Verify "Server running" message

2. **Check Frontend Console** (F12)

   - Look for CORS errors
   - Look for API call failures

3. **Check Network Tab** (F12 → Network)

   - Look at failed requests
   - Check response headers

4. **Verify URLs Match**

   - Frontend: http://localhost:3001
   - Backend: http://localhost:5000
   - Both must be running

5. **Restart Both Servers**
   - Kill both (Ctrl+C)
   - Clear cache (Ctrl+Shift+Delete)
   - Start backend first, then frontend

---

**Status**: ✅ CORS Configuration Fixed
**Version**: 1.0
**Last Updated**: November 2024
