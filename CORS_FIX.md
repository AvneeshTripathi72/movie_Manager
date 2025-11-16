# CORS Configuration Fix

## Problem

The backend was sending multiple values in the `Access-Control-Allow-Origin` header:

```
Access-Control-Allow-Origin: http://localhost:3000,http://localhost:5173,http://localhost:3001
```

This violates the CORS spec which only allows **ONE** origin value.

## Solution

### 1. Updated Backend Configuration (`src/app.js`)

The CORS middleware now properly parses the `CORS_ORIGIN` environment variable:

```javascript
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0)
  : ["http://localhost:3001", "http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: corsOrigins, // Pass as array, not string
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);
```

### 2. How It Works

When a request comes from any of the allowed origins:

- ✅ `http://localhost:3001` → Allowed
- ✅ `http://localhost:3000` → Allowed
- ✅ `http://localhost:5173` → Allowed
- ❌ Any other origin → Blocked

The CORS middleware automatically responds with the correct single origin:

```
Access-Control-Allow-Origin: http://localhost:3001
```

### 3. Configuration via .env

Set multiple origins in `.env` file:

```dotenv
# Use comma-separated list (no spaces before/after comma recommended)
CORS_ORIGIN=http://localhost:3001,http://localhost:3000,http://localhost:5173
```

Or for production:

```dotenv
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
```

### 4. Default Fallback

If `CORS_ORIGIN` is not set, it defaults to:

```javascript
["http://localhost:3001", "http://localhost:3000", "http://localhost:5173"];
```

This is useful for development without needing to set environment variables.

## Testing

### Before Fix

```
❌ Error: CORS policy: Response to preflight request doesn't pass access control check:
The 'Access-Control-Allow-Origin' header contains multiple values
```

### After Fix

```
✅ Request succeeds
✅ Preflight OPTIONS request passes
✅ Authentication headers are transmitted
```

## Key Changes in app.js

1. **Parse CORS_ORIGIN**: Split comma-separated string into array
2. **Trim whitespace**: Remove any accidental spaces
3. **Filter empty**: Remove empty strings
4. **Explicit methods**: Define allowed HTTP methods
5. **Explicit headers**: Define allowed request headers
6. **Options status**: Set 200 for successful preflight

## Browser Behavior

When browser makes a cross-origin request:

1. **Preflight Request** (OPTIONS)

   - Browser automatically sends this
   - Asks: "Is this cross-origin request allowed?"
   - Receives: `Access-Control-Allow-*` headers

2. **Actual Request** (GET/POST/PUT/DELETE)
   - Only sent if preflight passes
   - Includes credentials if `credentials: true`

## Production Deployment

For production, update `.env`:

```dotenv
# Production
CORS_ORIGIN=https://cinebook.com,https://admin.cinebook.com,https://app.cinebook.com
```

Or use wildcard for public APIs (not recommended for secured endpoints):

```dotenv
# Only for public, read-only endpoints
CORS_ORIGIN=*
```

## Troubleshooting

### Still Getting CORS Errors?

1. **Check frontend origin matches exactly**

   ```
   http://localhost:3001 ≠ http://localhost:3001/
   ```

2. **Clear browser cache and cookies**

   - In Chrome DevTools: Application → Clear Storage

3. **Check server restart**

   - Stop and restart backend to apply .env changes

4. **Verify environment variable is loaded**

   - Add debug log in app.js:

   ```javascript
   console.log("CORS Origins:", corsOrigins);
   ```

5. **Check network tab in DevTools**
   - Look for `Access-Control-Allow-Origin` header in response

### Different Ports for Frontend/Backend?

Make sure CORS_ORIGIN includes all frontend URLs:

```
Frontend: http://localhost:3001
Backend:  http://localhost:5000
CORS_ORIGIN: http://localhost:3001
```

## Summary

✅ **Fixed**: CORS error with multiple origin values  
✅ **Improved**: Better CORS configuration  
✅ **Updated**: Supports comma-separated origins in .env  
✅ **Added**: Default fallback origins for development  
✅ **Enhanced**: Explicit HTTP methods and headers

**Status**: Production-ready CORS configuration ✓
