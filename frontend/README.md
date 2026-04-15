# CivicPulse — Frontend

React frontend for the **Smart Civic Issue Reporting System**.  
Built with React 18, React Router v6, Axios, react-hot-toast, and react-dropzone.

---

## Quick Start

```bash
cd civicpulse-frontend
npm install
cp .env.example .env.local    # edit REACT_APP_API_URL if needed
npm start                      # runs on http://localhost:3000
```

The `"proxy": "http://localhost:5000"` in `package.json` forwards all `/api/*`
requests to your Express backend during development.

---

## Project Structure

```
src/
├── api/
│   └── index.js          # Axios instance + all API calls (authAPI, complaintsAPI)
├── context/
│   └── AuthContext.jsx   # Global user/role state, login/register/logout
├── hooks/
│   └── useComplaints.js  # Data-fetching hooks: useComplaints, useMyComplaints, useStats, useUpdateStatus
├── components/
│   ├── UI.jsx            # Shared: Badge, Card, Button, Skeleton, Timeline, EmptyState
│   ├── Navbar.jsx        # Sticky top nav, role-aware links
│   ├── ComplaintCard.jsx # Reusable complaint row (citizen + authority modes)
│   ├── ComplaintModal.jsx# Detail modal with timeline + authority status controls
│   └── ProtectedRoute.jsx# Route guards for auth / role
└── pages/
    ├── LoginPage.jsx     # Login + Register (toggle)
    ├── HomePage.jsx      # Public landing, recent issues
    ├── ReportPage.jsx    # Submit issue with image upload + AI preview
    ├── MyReportsPage.jsx # Citizen's own complaints, tabbed by status
    ├── DashboardPage.jsx # Authority metrics, charts, quick actions
    └── ComplaintsPage.jsx# Authority full complaint list, filterable
```

---

## API Contract

Your Express backend must expose these endpoints:

### Auth
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/register` | `{ name, email, password, role }` | `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user }` |
| POST | `/api/auth/logout` | — | `200 OK` |
| GET  | `/api/auth/me` | — (JWT in header) | `{ user }` |

**User object shape:**
```json
{ "_id": "...", "name": "Ravi Kumar", "email": "ravi@example.com", "role": "citizen" }
```
`role` must be one of: `"citizen"` | `"authority"` | `"admin"`

---

### Complaints
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET  | `/api/complaints` | Query: `status`, `category`, `severity`, `duplicate`, `page`, `limit` |
| GET  | `/api/complaints/my` | Citizen's own reports. Same query params. |
| GET  | `/api/complaints/stats` | Authority dashboard stats |
| GET  | `/api/complaints/:id` | Single complaint with `statusUpdates` array |
| POST | `/api/complaints` | `multipart/form-data` with `image` file field |
| PATCH| `/api/complaints/:id/status` | Body: `{ status: "pending"|"inprogress"|"completed" }` |
| DELETE| `/api/complaints/:id` | Admin only |
| GET  | `/api/complaints/duplicates` | List duplicate-flagged complaints |

**Complaint object shape:**
```json
{
  "_id": "664abc...",
  "title": "Pothole on MG Road",
  "description": "Deep pothole near junction...",
  "category": "Roads",
  "severity": "high",
  "status": "inprogress",
  "location": "MG Road, Junction 4",
  "imageUrl": "https://your-bucket.s3.amazonaws.com/...",
  "isDuplicate": false,
  "duplicateOf": null,
  "aiClassification": "Roads — High Severity (94% confidence)",
  "createdAt": "2025-04-08T10:30:00.000Z",
  "statusUpdates": [
    { "message": "Complaint received", "createdAt": "2025-04-08T10:30:00.000Z", "done": true },
    { "message": "Assigned to Roads Dept.", "createdAt": "2025-04-09T08:00:00.000Z", "done": true }
  ]
}
```

**GET /api/complaints/stats response:**
```json
{
  "total": 40,
  "pending": 15,
  "inprogress": 12,
  "completed": 13,
  "highSeverity": 8,
  "duplicates": 3,
  "avgResolutionDays": 2.4,
  "byCategory": [
    { "_id": "Roads",        "count": 16 },
    { "_id": "Garbage",      "count": 10 },
    { "_id": "Water",        "count": 8  },
    { "_id": "Streetlights", "count": 6  }
  ]
}
```

**Paginated list response:**
```json
{
  "complaints": [ /* array */ ],
  "pagination": { "page": 1, "limit": 20, "total": 40, "pages": 2 }
}
```

---

## Auth Flow

1. JWT token stored in `localStorage` under key `"token"`.
2. Axios interceptor attaches it as `Authorization: Bearer <token>` on every request.
3. On 401 response, token is cleared and user is redirected to `/login`.
4. `AuthContext` exposes `user`, `isAuthority`, `login()`, `register()`, `logout()`.

---

## Role-Based Routing

| Route | Access |
|-------|--------|
| `/` | Public |
| `/login` | Unauthenticated only |
| `/report` | Citizen (authenticated) |
| `/my-reports` | Citizen (authenticated) |
| `/dashboard` | Authority / Admin only |
| `/complaints` | Authority / Admin only |

---

## Production Build

```bash
npm run build
# Outputs to /build — serve with nginx or any static host
```

For nginx, add this rewrite rule so React Router works on refresh:
```nginx
location / {
  try_files $uri /index.html;
}
```
