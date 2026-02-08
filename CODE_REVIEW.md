# Code Review: TravelPartner-Golb

**Date:** 2026-02-08
**Scope:** Full-stack application (API, Admin Panel, User Panel)

---

## Critical Security Issues

### 1. Hardcoded Secrets in Source Code (CRITICAL)

**Files:** `api-main/config/index.js:24-25`, `api-main/lib/cryptoJS.js:10-11`

- JWT secret key is hardcoded: `"vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3"` (same value in both production and development)
- AES encryption key is hardcoded: `"1234567812345678"` (trivially weak, sequential digits)
- The AES IV is identical to the key (`"1234567812345678"`), defeating the purpose of having an IV
- `cryptoSecretKey` config value is `"1234567812345678"` in both environments

**Impact:** Anyone reading this source code can forge JWT tokens, impersonate any user or admin, and decrypt all encrypted data.

**Recommendation:** Move all secrets to environment variables. Use cryptographically random keys of appropriate length. Never reuse the key as the IV.

---

### 2. Hardcoded Admin Credentials in Seed Script (CRITICAL)

**File:** `api-main/seedAdmin.js:44,58-59`

- Default superadmin password `"Admin@123"` is hardcoded and printed to console
- Email `admin@travelpartner.com` is predictable

**Impact:** If the seed runs in production without changing the password, the admin account is trivially compromised.

---

### 3. Private Keys and SSL Certificates Committed to Git (CRITICAL)

**Directory:** `api-main/private/`

- 20 private key/certificate files are committed to the repository including:
  - `key.pem`, `public.pem`
  - `client.key`, `server.key`, `ca.key`
  - `walletapi.alwin.io.key`, `walletapi.alwin.io.pem`
- The `.gitignore` does NOT exclude the `private/` directory

**Impact:** All SSL/TLS private keys are exposed to anyone with repository access. These should never be in version control.

---

### 4. CORS Completely Disabled (HIGH)

**File:** `api-main/server.js:23`

```js
app.use(cors({ origin: "*" }));
```

- A proper CORS config exists in `api-main/config/cors.js` but is commented out in `server.js:8`
- Socket.IO also has `cors: { origin: "*" }` in `api-main/config/socketIO.js:10-12`

**Impact:** Any website can make authenticated API requests on behalf of users if tokens are exposed.

---

### 5. JWT Tokens Have No Expiration (HIGH)

**File:** `api-main/models/User.js:449-452`

```js
var token = jwt.sign(payload, config.secretOrKey)
```

- No `expiresIn` option is set. Tokens are valid forever once issued.

**Impact:** Stolen tokens can never be revoked through expiration. Combined with the hardcoded secret, this is a severe issue.

---

### 6. reCAPTCHA Validation Disabled (HIGH)

**File:** `api-main/controllers/auth.controller.js:39,100-106`

- reCAPTCHA checks are commented out for both `createNewUser` and `registerRequest`
- No rate limiter on the login endpoint (`api-main/routes/auth.route.js:21`)

**Impact:** Registration and login endpoints are vulnerable to brute force and automated abuse. Only the register-request route has a rate limiter.

---

### 7. Exposed Crypto Secret in Frontend Environment (HIGH)

**File:** `user-panel-main/.env.production:2`

```
NEXT_PUBLIC_CRYPTOSECRETKEY="1234567812345678"
```

- The `NEXT_PUBLIC_` prefix means this value is bundled into the client-side JavaScript
- It's the same key used for server-side encryption

**Impact:** Any user can see this key in their browser's JS bundle and decrypt data that was meant to be encrypted.

---

### 8. HTTPS-to-HTTP Redirect (HIGH)

**File:** `api-main/server.js:72-78`

```js
if (req.headers["x-forwarded-proto"] === "https") {
  res.redirect("http://" + req.hostname + req.url);
}
```

- The server actively downgrades HTTPS connections to HTTP

**Impact:** Forces plaintext transmission, exposing tokens, passwords, and all data to network interception.

---

## Authentication & Authorization Issues

### 9. Account Lockout Bypass (MEDIUM)

**File:** `api-main/controllers/auth.controller.js:238-253`

- Failed login increments `login_attempt` and sets `isBlock: true` at attempt 5
- However, the block check `if (!checkUser.isBlock)` only prevents incrementing further - the "Password incorrect" response is always returned, and there's no check preventing login attempts on blocked accounts
- On successful login (line 287-291), `login_attempt` is reset to 0 and `isBlock` is set to false - meaning the lockout has no time-based duration

**Impact:** The lockout mechanism is ineffective. A blocked account can still attempt logins and immediately resets on success.

---

### 10. Password Reset Token Expiry Disabled (MEDIUM)

**File:** `api-main/controllers/auth.controller.js:330-337`

- OTP time-based validation is completely commented out
- Reset tokens never expire

**Impact:** Password reset links remain valid indefinitely.

---

### 11. Admin Middleware Fallthrough (MEDIUM)

**File:** `admin-panel-main/middleware.ts:92-97`

- If the admin profile API call fails or the role doesn't match known values, the middleware falls through to `NextResponse.next()` on line 97
- This means a failed API call grants access instead of denying it

**Impact:** Network errors or API failures could grant unauthorized access to the admin panel.

---

### 12. No Auth on Several Admin Routes (MEDIUM)

**File:** `api-main/routes/admin.route.js:115-116`

```js
router.route("/get-all-bookings").get(packageCtrl.uploadLandscape, packageCtrl.getAllBookings);
router.route("/get-single-booking").get(packageCtrl.getSingleBooking);
```

- `/get-all-bookings` and `/get-single-booking` are missing `passportAuth` middleware
- `/getcms/:id` (line 222), `/policy/:id` (line 229) also lack auth

**Impact:** Unauthenticated users can access booking data and CMS content via admin API.

---

### 13. User Panel Middleware Does Not Validate Tokens (LOW)

**File:** `user-panel-main/middleware.ts:16-17`

- Only checks if a token cookie exists, never validates it
- Comment on line 16-17 says "Validate the token here if necessary" but no validation is implemented

---

## Code Quality Issues

### 14. Deprecated Buffer Constructor (MEDIUM)

**File:** `api-main/models/User.js:442`

```js
var salt = new Buffer(this.salt, "base64")
```

- `new Buffer()` has been deprecated since Node 6 due to security concerns. Should use `Buffer.from()`.

---

### 15. Deprecated Mongoose Options (LOW)

**File:** `api-main/config/dbConnection.js:9-12`

- `useNewUrlParser` and `useUnifiedTopology` are deprecated in Mongoose 6+ and ignored

---

### 16. Duplicate Dependencies (LOW)

**File:** `api-main/package.json:18-19`

- Both `bcrypt` and `bcryptjs` are listed as dependencies. The codebase uses both inconsistently.

---

### 17. AWS SDK v2 End-of-Life (LOW)

**File:** `api-main/package.json:16`

- `aws-sdk` v2 (`^2.1692.0`) is end-of-support as shown in the console warning. Should migrate to `@aws-sdk/*` v3 modular packages.

---

### 18. Inconsistent Error Response Format (LOW)

Throughout controllers, error responses inconsistently use `success: true` for 400 errors (e.g., `wallet.controller.js:42,48,54`) and `status: false` vs `success: false` interchangeably.

---

### 19. Empty/Stub Functions (LOW)

**File:** `api-main/controllers/wallet.controller.js:306-314`

- `declineWithdrawRequest` is an empty function with just a try/catch
- `forgotPasswordReq` in auth.controller.js:562-573 returns a hardcoded success without doing anything

---

### 20. Console Logging of Sensitive Data (LOW)

**Files:** `auth.controller.js:208,265`, `cryptoJS.js:32`

- Login request bodies (containing passwords) are logged: `console.log(reqBody, "<<< --- LOGIN REQBODY --- >>>")`
- Decrypted data is logged: `console.log(decryptedData, 'decryptedDAta')`
- JWT payloads logged: `console.log("payloadData: ", payloadData)`

---

### 21. `confirmMail` Null Reference Bug (MEDIUM)

**File:** `api-main/controllers/auth.controller.js:368-374`

```js
let userData = await User.findOne({ _id: userId })
if (userData.status == "unverified") {  // crashes if userData is null
  if (!userData) {                      // dead code - already accessed .status above
```

- If `userData` is null, `userData.status` throws a TypeError before the null check on line 370

---

## Architecture Observations

- The `private/` directory with SSL keys should be in `.gitignore`
- The same encryption key `"1234567812345678"` is used across frontend and backend, eliminating any security benefit
- The codebase shows signs of being adapted from a crypto exchange platform (references to spot trading, Binance, order books in socketIO) for a travel/hotel booking use case
- Both `bcrypt` and a custom `crypto.pbkdf2Sync` hashing are used for passwords (bcrypt for admin, pbkdf2 for users) - this inconsistency adds complexity without benefit

---

## Summary by Severity

| Severity | Count | Key Items |
|----------|-------|-----------|
| CRITICAL | 3 | Hardcoded secrets, committed private keys, hardcoded admin credentials |
| HIGH | 5 | CORS wildcard, no JWT expiry, disabled reCAPTCHA, exposed frontend crypto key, HTTPS downgrade |
| MEDIUM | 5 | Account lockout bypass, no token expiry, admin middleware fallthrough, unauthenticated routes, null reference bug |
| LOW | 6 | Deprecated APIs, duplicate deps, inconsistent errors, empty functions, sensitive logging, no frontend token validation |
