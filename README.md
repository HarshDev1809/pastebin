# Snippet-Lite

A lightweight snippet application where users can create text snippets with optional expiry constraints and share them via URLs.

## Features

- Create text snippets with arbitrary content
- Share snippets via unique URLs
- Optional time-based expiry (TTL)
- Optional view-count limits
- Snippets become unavailable when constraints are triggered

## How to Run the App Locally

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or Supabase account)

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/HarshDev1809/Snippet-Lite.git
cd snippet-lite
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following variables:
     ```
     DATABASE_URL=postgresql://username:password@host:port/database
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     TEST_MODE=0
     ```

4. Set up the database:
   - Create a PostgreSQL database
   - Run the following SQL schema:
     ```sql
        CREATE TABLE snippets (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        expires_at BIGINT,
        ttl_seconds INTEGER,
        remaining_views INTEGER,
        max_views INTEGER);

     ```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Persistence Layer Used

This application uses **PostgreSQL** as its persistence layer, hosted on Supabase.

**Why PostgreSQL?**
- Provides reliable, persistent storage that survives across serverless function invocations on platforms like Vercel
- ACID compliance ensures data integrity for snippet operations
- Supports efficient indexing for expiry and view count lookups
- Handles concurrent access safely, preventing race conditions with view counts

**Data Storage:**
- Snippet content and metadata are stored in a `snippets` table
- Timestamps are stored as milliseconds since epoch (BIGINT) for precision
- View counts are tracked and decremented on each API access
- Expiry times are indexed for fast lookup during TTL checks

## Important Design Decisions

### 1. Millisecond Timestamps
All timestamps (creation time, expiry time) are stored as milliseconds since epoch rather than using PostgreSQL's native timestamp types. This provides:
- Consistent time handling between Node.js and the database
- Easier arithmetic for TTL calculations
- Support for the `x-test-now-ms` header in TEST_MODE

### 2. View Count Decrement Strategy
Each successful API call to `GET /api/snippets/:id` counts as a view and decrements the `remaining_views` counter. The decremented value is returned in the response, ensuring accurate tracking.

### 3. TEST_MODE Support
The application supports deterministic expiry testing via:
- Environment variable `TEST_MODE=1`
- Request header `x-test-now-ms` containing milliseconds since epoch
- When both are present, the header value is used instead of `Date.now()` for expiry calculations

### 4. Constraint Handling
When both TTL and max_views constraints are present, the snippet becomes unavailable as soon as **either** constraint triggers (whichever comes first).

### 5. Error Responses
- Invalid inputs (missing content, invalid TTL/view counts) return `400 Bad Request` with JSON error messages
- Unavailable snippets (not found, expired, view limit exceeded) consistently return `404 Not Found` with JSON responses
- Database/server errors return `500 Internal Server Error`

### 6. XSS Protection
Snippet content is rendered safely in a `<textarea>` element which automatically escapes HTML/JavaScript, preventing script execution.

## API Endpoints

- `GET /api/healthz` - Health check with database connectivity test
- `POST /api/snippets` - Create a new snippet
- `GET /api/snippets/:id` - Fetch snippet metadata (API, decrements view count)
- `GET /s/:id` - View snippet content (HTML page)

## Technologies Used

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **PostgreSQL** - Database (via Supabase)
- **Tailwind CSS 4** - Styling
- **nanoid** - Unique ID generation for snippet URLs
- **pg** - PostgreSQL client for Node.js

## Deployment

This application is designed to be deployed on Vercel. The serverless architecture works seamlessly with the PostgreSQL persistence layer.
