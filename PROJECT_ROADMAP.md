# 🚀 FormsAwesome Project Roadmap

**Complete step-by-step breakdown of remaining work to complete the project.**

---

## 📋 Current Project Status

### ✅ Completed Components

- App Router structure with proper folder hierarchy
- UI Component Library (Button, Card, Dropdown, Badge, Table, etc.)
- Redux store setup with slices
- Database connection (MongoDB)
- Auth user model
- Landing page with navbar, hero, features, testimonials, pricing

### 🔄 In Progress / Partially Complete

- Authentication system (login/register routes exist)
- Dashboard layout
- Form Builder components structure
- API routes structure

### ❌ Not Started / Needs Work

- Complete authentication flow with NextAuth
- Form CRUD operations (full backend)
- Drag & Drop form builder
- Form submissions tracking
- Analytics dashboard
- User profile & settings

---

## 🎯 PHASE 1: Complete Authentication System

### Step 1.1: Setup NextAuth.js Configuration

**Goal:** Configure NextAuth with Credentials, Google, and GitHub providers

#### Sub-steps:

1. Install required packages: `npm install next-auth`
2. Create `/app/api/auth/[...nextauth]/route.ts`
3. Setup NextAuth configuration with:
   - Credentials provider (email + password)
   - Google OAuth provider
   - GitHub OAuth provider
   - JWT callbacks for custom tokens
   - Session callbacks
4. Add environment variables:
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
5. Create JWT token generation utilities
6. Setup refresh token rotation logic

---

### Step 1.2: Fix User Authentication Routes

**Goal:** Make login/register pages fully functional

#### Sub-steps:

##### 1.2.1 Login Page (`/app/auth/login/page.tsx`)

- [ ] Create login form with email & password inputs
- [ ] Add "Remember me" checkbox
- [ ] Add Google login button
- [ ] Add GitHub login button
- [ ] Implement form validation using react-hook-form
- [ ] Handle sign-in with NextAuth (`signIn()`)
- [ ] Show error messages for failed login
- [ ] Add loading states
- [ ] Redirect to dashboard on successful login
- [ ] Add "Forgot password?" link
- [ ] Add "Don't have account?" link to register

##### 1.2.2 Register Page (`/app/auth/register/page.tsx`)

- [ ] Create registration form (name, email, password, confirm password)
- [ ] Implement password strength validation
- [ ] Add form validation using react-hook-form
- [ ] Create POST API endpoint `/api/auth/register`
  - Create user in database
  - Hash password using bcryptjs
  - Send verification email
  - Return success/error response
- [ ] Show success message after registration
- [ ] Send verification email with code/link
- [ ] Add "Already have account?" link to login

##### 1.2.3 Email Verification Page (`/app/auth/verify-email/page.tsx`)

- [ ] Get verification code from URL query params
- [ ] Create POST endpoint `/api/auth/verify-email`
  - Verify code is valid and not expired
  - Update user's `emailVerified` status
  - Return success/error
- [ ] Show verification status to user
- [ ] Add "Resend verification email" button
- [ ] Redirect to login after verification

##### 1.2.4 Password Reset Flow

- [ ] Create forgot password page (`/app/auth/forgot-password/page.tsx`)
  - Form to enter email
  - Submit to `/api/auth/forgot-password` endpoint
  - Show success message
- [ ] Create reset password page (`/app/auth/reset-password/page.tsx`)
  - Get reset token from URL
  - Form to enter new password
  - Submit to `/api/auth/reset-password` endpoint
  - Validate token expiry
  - Update password and clear token

---

### Step 1.3: Create Auth API Endpoints

**Goal:** Setup complete backend authentication

#### Sub-steps:

##### 1.3.1 `/api/auth/register` - POST

```
Body: { email, password, name }
- Validate email format
- Hash password with bcryptjs
- Create user in MongoDB
- Generate verification code
- Send verification email
- Return { success, message, userId }
```

##### 1.3.2 `/api/auth/verify-email` - POST

```
Body: { email, code }
- Find user by email
- Verify code matches and not expired
- Mark email as verified
- Return { success, message }
```

##### 1.3.3 `/api/auth/forgot-password` - POST

```
Body: { email }
- Find user by email
- Generate reset token
- Save token with expiry (15 mins)
- Send reset link via email
- Return { success, message }
```

##### 1.3.4 `/api/auth/reset-password` - POST

```
Body: { token, newPassword }
- Verify token is valid and not expired
- Hash new password
- Update user password
- Clear reset token
- Return { success, message }
```

##### 1.3.5 `/api/auth/login` - POST (for credentials)

```
Body: { email, password }
- Find user by email
- Compare password with bcryptjs
- If valid: generate JWT tokens (access + refresh)
- Return { success, accessToken, refreshToken, user }
```

##### 1.3.6 `/api/auth/refresh-token` - POST

```
Body: { refreshToken }
- Verify refresh token
- Generate new access token
- Optionally rotate refresh token
- Return { accessToken, refreshToken }
```

---

### Step 1.4: Setup Auth Middleware

**Goal:** Protect routes and verify user session

#### Sub-steps:

1. Create middleware in `middleware.ts` at root
2. Use `withAuth()` wrapper from NextAuth
3. Protect routes:
   - `/app/(pages)/*` → require authentication
   - `/app/create/*` → require authentication
   - `/app/api/forms/*` → require authentication
4. Handle unauthorized access → redirect to login
5. Attach user data to request headers

---

## 🎯 PHASE 2: Complete Form CRUD API

### Step 2.1: Form Creation Endpoint

**Goal:** `/api/forms` - POST - Create new blank form

#### Sub-steps:

- [ ] Create POST endpoint at `/app/api/forms/route.ts`
- [ ] Verify user is authenticated
- [ ] Validate request body: `{ title, description }`
- [ ] Generate unique slug from title
- [ ] Create form document in MongoDB:
  ```
  {
    userId: string,
    title: string,
    description: string,
    slug: string,
    state: 'DRAFT',
    version: 1,
    fields: [],
    settings: { theme, notifications },
    submissions: 0,
    views: 0,
    createdAt: Date,
    updatedAt: Date
  }
  ```
- [ ] Return created form with 201 status

---

### Step 2.2: Get All Forms Endpoint

**Goal:** `/api/forms` - GET - List all user's forms with pagination

#### Sub-steps:

- [ ] Create GET endpoint
- [ ] Verify authentication
- [ ] Query database for all forms where `userId === currentUser`
- [ ] Support pagination: `?page=1&limit=10`
- [ ] Support sorting: `?sort=newest` (default) or `sort=oldest`
- [ ] Support filtering: `?state=PUBLISHED` or `state=DRAFT`
- [ ] Return paginated list with total count

---

### Step 2.3: Get Single Form Endpoint

**Goal:** `/api/forms/[id]` - GET - Fetch form for editing

#### Sub-steps:

- [ ] Create GET endpoint with `[id]` dynamic segment
- [ ] Verify authentication
- [ ] Verify user owns the form
- [ ] Return full form object including all fields
- [ ] Return 404 if form not found

---

### Step 2.4: Update Form Endpoint

**Goal:** `/api/forms/[id]` - PUT - Update form data, fields, settings

#### Sub-steps:

- [ ] Create PUT endpoint
- [ ] Verify authentication and ownership
- [ ] Allow updating: title, description, fields, settings, state
- [ ] If publishing (state → PUBLISHED): increment version
- [ ] Update `updatedAt` timestamp
- [ ] Validate updated data
- [ ] Return updated form

---

### Step 2.5: Delete/Archive Form Endpoint

**Goal:** `/api/forms/[id]` - DELETE - Remove form

#### Sub-steps:

- [ ] Create DELETE endpoint
- [ ] Verify authentication and ownership
- [ ] Soft delete: set `state = ARCHIVED` (preferred)
- [ ] Or hard delete: remove from database
- [ ] Return success message

---

### Step 2.6: Form Model & Schema

**Goal:** Define proper MongoDB schema

#### Sub-steps:

- [ ] Create/update `models/form.model.ts`:
  ```typescript
  interface Form {
    _id: ObjectId;
    userId: ObjectId;
    title: string;
    description: string;
    slug: string;
    state: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    version: number;
    fields: FormField[];
    settings: FormSettings;
    submissions: number;
    views: number;
    createdAt: Date;
    updatedAt: Date;
  }
  ```
- [ ] Define `FormField` interface
- [ ] Define `FormSettings` interface

---

## 🎯 PHASE 3: Dashboard & Forms List UI

### Step 3.1: Setup Dashboard Layout

**Goal:** Create main dashboard with sidebar and header

#### Sub-steps:

- [ ] Create dashboard layout in `/app/(pages)/dashboard/layout.tsx`
- [ ] Add Sidebar component with:
  - Logo/Brand
  - Navigation links (Dashboard, Forms, Submissions, Analytics, Profile, Settings)
  - Logout button
  - User avatar with dropdown
- [ ] Add Header component with:
  - Search bar
  - Notifications icon
  - User profile dropdown
- [ ] Make responsive (mobile hamburger menu)
- [ ] Add dark mode toggle

---

### Step 3.2: Dashboard Home Page

**Goal:** `/app/(pages)/dashboard/page.tsx` - Overview

#### Sub-steps:

- [ ] Create dashboard home page
- [ ] Fetch user's statistics:
  - Total forms
  - Total submissions
  - Total views
  - Forms published count
- [ ] Display stats cards
- [ ] Show recent forms list (5-10 recent)
- [ ] Add "Create New Form" button
- [ ] Display quick stats charts

---

### Step 3.3: All Forms Page

**Goal:** `/app/(pages)/all-forms/page.tsx` - Complete forms list with features

#### Sub-steps:

- [ ] Create forms list page
- [ ] Fetch all forms from API
- [ ] Implement pagination
- [ ] Add search functionality (by title)
- [ ] Add filtering: by state (Draft/Published/Archived)
- [ ] Add sorting options: Newest, Oldest, Most views, Most submissions
- [ ] Display forms in grid using existing `FormsGrid` component
- [ ] Each form card should show:
  - Form title and description
  - State badge (Draft/Published/Archived)
  - View count
  - Submission count
  - Last modified date
  - Action dropdown (Preview, Edit, Analytics, Share, Archive, Delete)
- [ ] Fix the nested button error in dropdown

---

### Step 3.4: Forms List Component

**Goal:** Fix and complete `features/dashboard/components/FormsGrid.tsx`

#### Sub-steps:

- [ ] Update `FormsGrid` to accept forms as props
- [ ] Implement grid layout responsively
- [ ] Each `FormCard` component should:
  - Display form thumbnail/icon
  - Show form title (truncate if long)
  - Show form description (1-2 lines max)
  - Show status badge
  - Show view/submission counts
  - Have dropdown menu with actions
  - Be clickable to edit form
- [ ] Add empty state when no forms
- [ ] Add loading skeleton state while fetching
- [ ] Implement proper dropdown menu without nested buttons

---

## 🎯 PHASE 4: Form Builder - Drag & Drop

### Step 4.1: Form Builder Page Setup

**Goal:** `/app/create/page.tsx` - Drag & Drop editor

#### Sub-steps:

- [ ] Create form builder page
- [ ] Setup layout with:
  - Left sidebar: Field palette (Text, Email, Number, Select, Checkbox, Radio, etc.)
  - Center: Canvas/Preview area
  - Right sidebar: Properties panel
- [ ] Implement drag & drop using `@dnd-kit` or `react-dnd`
- [ ] Allow adding fields to canvas
- [ ] Allow removing fields from canvas
- [ ] Allow reordering fields

---

### Step 4.2: Field Components

**Goal:** Create reusable field components for form builder

#### Sub-steps:

- [ ] Create field types:
  - Text Input
  - Email Input
  - Number Input
  - Textarea
  - Select/Dropdown
  - Checkbox
  - Radio Button Group
  - Date Picker
  - File Upload
  - Rating
  - Phone Number
  - Address (with autocomplete)
  - Signature
  - Payment (Stripe integration - optional)

- [ ] Each field should have configurable properties:
  - Label
  - Placeholder
  - Required/Optional
  - Help text
  - Validation rules
  - Conditional display logic (optional)

---

### Step 4.3: Properties Panel

**Goal:** Right-side panel to configure selected field

#### Sub-steps:

- [ ] When field is selected, show its properties
- [ ] Allow editing:
  - Field label
  - Field placeholder
  - Required toggle
  - Help text
  - Default value
  - Min/Max length (for text)
  - Min/Max value (for numbers)
  - Options (for select/radio/checkbox)
  - Validation rules
- [ ] Show real-time preview updates

---

### Step 4.4: Form Settings

**Goal:** Configure form-level settings

#### Sub-steps:

- [ ] Add form settings panel:
  - Title
  - Description
  - Success message after submission
  - Redirect URL after submission (optional)
  - Theme color
  - Enable/disable notifications
  - Require email verification
  - Limit responses (optional)
  - Password protection (optional)

---

### Step 4.5: Save Form Functionality

**Goal:** Save form draft and publish

#### Sub-steps:

- [ ] Implement "Save Draft" button
  - Call PUT `/api/forms/[id]`
  - State stays as DRAFT
  - Show success toast
- [ ] Implement "Publish" button
  - Call PUT `/api/forms/[id]` with state=PUBLISHED
  - Version increments
  - Show success toast with form URL
- [ ] Implement "Preview" button
  - Show how form looks to respondents
  - Disable editing in preview

---

## 🎯 PHASE 5: Public Form & Submissions

### Step 5.1: Public Form Page

**Goal:** `/app/f/[slug]` - Public form respondents access

#### Sub-steps:

- [ ] Create public form route
- [ ] Fetch published form by slug
- [ ] Render form fields (non-editable)
- [ ] Track form view (increment view count)
- [ ] Submit form handler:
  - Validate all required fields
  - Validate field-specific rules
  - Save submission to database
  - Clear form and show success message
  - Redirect if success URL configured

---

### Step 5.2: Form Submissions API

**Goal:** `/api/forms/[id]/submissions` - Save respondent answers

#### Sub-steps:

- [ ] Create POST endpoint to save submission
- [ ] Store submission with:
  - Form ID
  - Timestamp
  - Respondent data (all field answers)
  - IP address
  - User agent (if tracking)
- [ ] Increment form's submission count
- [ ] Return success response
- [ ] Optional: Send notification email to form creator

---

### Step 5.3: Submissions List Page

**Goal:** `/app/(pages)/submissions/page.tsx` - View all form responses

#### Sub-steps:

- [ ] Create submissions list page
- [ ] Fetch user's forms
- [ ] Show submissions for selected form
- [ ] Display as table with:
  - Submission date/time
  - Respondent answers (columns for each field)
  - Individual row click to view full response
- [ ] Add filters:
  - By form
  - By date range
- [ ] Add export functionality (CSV/Excel)
- [ ] Add search by respondent answers

---

### Step 5.4: Submission Detail View

**Goal:** View individual submission details

#### Sub-steps:

- [ ] Create detail page or modal
- [ ] Show all respondent's answers
- [ ] Display submission metadata:
  - Submission date/time
  - Respondent IP
  - Browser/Device info
  - Submission number
- [ ] Allow adding notes/comments
- [ ] Allow marking as spam/flagged
- [ ] Allow deleting submission

---

## 🎯 PHASE 6: Analytics

### Step 6.1: Analytics Dashboard

**Goal:** `/app/(pages)/analytics/page.tsx` - Form performance metrics

#### Sub-steps:

- [ ] Create analytics page
- [ ] Show metrics:
  - Total views
  - Total submissions
  - Completion rate (submissions / views)
  - Average time to complete
  - Submissions over time (chart)
  - Submissions by day/week/month
  - Traffic sources
  - Device/Browser breakdown
- [ ] Add date range filter
- [ ] Allow export analytics data
- [ ] Show dropdown to select which form to analyze

---

### Step 6.2: Form Analytics Detail

**Goal:** Per-field analytics

#### Sub-steps:

- [ ] Show per-field analytics:
  - How many submitted this field
  - Skip rate for this field
  - For select/radio: distribution of answers (pie/bar chart)
  - For text fields: common answers
- [ ] Identify problem fields (high skip rate)
- [ ] Allow downloading field report

---

## 🎯 PHASE 7: User Profile & Settings

### Step 7.1: User Profile Page

**Goal:** `/app/(pages)/profile/page.tsx` - User information

#### Sub-steps:

- [ ] Display user info:
  - Avatar/Profile picture
  - Name
  - Email
  - Created date
  - Total forms count
  - Total submissions count
- [ ] Allow editing:
  - Profile picture upload
  - Name
  - Bio (optional)
- [ ] Save changes to API endpoint `/api/profile`

---

### Step 7.2: Settings Page

**Goal:** `/app/(pages)/settings/page.tsx` - User preferences

#### Sub-steps:

- [ ] Email preferences:
  - Get notification emails for new submissions
  - Digest frequency
- [ ] Security:
  - Change password
  - Two-factor authentication setup
  - Active sessions list
  - Logout all sessions button
- [ ] Billing (if premium):
  - Subscription status
  - Upgrade/downgrade options
  - Invoice history
- [ ] API Keys (optional):
  - Generate API key
  - List existing keys
  - Revoke key

---

## 🎯 PHASE 8: Additional Features (Nice to Have)

### Step 8.1: Form Sharing & Collaboration

- [ ] Share form via link
- [ ] QR code for form
- [ ] Email form to contacts
- [ ] Embed form on website
- [ ] Collaborate with team members (view only / edit access)

### Step 8.2: Form Templates

- [ ] Pre-built templates (Contact, Survey, Registration, etc.)
- [ ] Clone/duplicate forms
- [ ] Save custom forms as templates

### Step 8.3: Advanced Features

- [ ] Conditional logic (show field if X == Y)
- [ ] Custom CSS styling
- [ ] Payment integration (Stripe)
- [ ] Email notifications (SendGrid/NodeMailer)
- [ ] Webhook integrations (Zapier, Make, etc.)
- [ ] Database integrations (Google Sheets, Airtable)

### Step 8.4: File Storage

- [ ] File upload fields
- [ ] Store in cloud (AWS S3, Cloudinary)
- [ ] Set file size/type limits

---

## 🛠️ Technical Checklist

### Database/Models

- [ ] User model complete with all fields
- [ ] Form model with all relationships
- [ ] Submission model
- [ ] Create proper MongoDB indexes for performance

### API Endpoints Summary

- [x] Auth routes (basic structure exists)
- [ ] `/api/auth/register` - POST
- [ ] `/api/auth/verify-email` - POST
- [ ] `/api/auth/login` - POST
- [ ] `/api/auth/forgot-password` - POST
- [ ] `/api/auth/reset-password` - POST
- [ ] `/api/auth/refresh-token` - POST
- [ ] `/api/forms` - GET/POST
- [ ] `/api/forms/[id]` - GET/PUT/DELETE
- [ ] `/api/forms/[id]/submissions` - GET/POST
- [ ] `/api/profile` - GET/PUT
- [ ] `/api/profile/settings` - GET/PUT

### UI/UX

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states
- [ ] Error handling with user-friendly messages
- [ ] Success notifications/toasts
- [ ] Empty states
- [ ] Skeleton loading states
- [ ] Dark mode support
- [ ] Accessibility (ARIA labels, keyboard navigation)

### Performance

- [ ] Optimize database queries
- [ ] Add pagination to large lists
- [ ] Image optimization
- [ ] Code splitting/lazy loading
- [ ] API response caching (Redis)

### Security

- [ ] Protect API routes with authentication
- [ ] Validate all inputs server-side
- [ ] Sanitize user data
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] SQL/NoSQL injection prevention

### Testing

- [ ] Unit tests for utilities
- [ ] Integration tests for API
- [ ] E2E tests for critical flows

---

## 📅 Recommended Timeline

- **Week 1**: Complete Phase 1 (Auth system)
- **Week 2**: Complete Phase 2 (Form CRUD APIs)
- **Week 3**: Complete Phase 3 (Dashboard UI)
- **Week 4**: Complete Phase 4 (Form Builder)
- **Week 5**: Complete Phase 5 (Public form & submissions)
- **Week 6**: Complete Phase 6 (Analytics)
- **Week 7**: Complete Phase 7 (Profile & Settings)
- **Week 8**: Polish, testing, bug fixes, Phase 8 features

---

## 🎯 Quick Start - Do This First

**Next immediate step: Complete PHASE 1 (Authentication)**

Start with:

1. Setup NextAuth.js
2. Create login page
3. Create register page
4. Create auth API endpoints
5. Test auth flow

After auth is solid, move to Phase 2.

---

**Good luck! 💪**
