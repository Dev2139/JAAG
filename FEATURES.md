# JNV Alumni Network - Features Overview

This document outlines all the key features of the JNV Alumni Network application.

## Core Features

### 1. Authentication System

#### Sign Up
- Email-based registration
- Password validation and security
- Automatic user account creation in Supabase Auth
- Email verification (optional, can be enabled)

**Route:** `/signup`
**Component:** `src/pages/auth/SignUp.tsx`

#### Login
- Email and password authentication  
- Session management
- "Remember me" functionality (optional)
- Password reset link

**Route:** `/login`
**Component:** `src/pages/auth/Login.tsx`

#### Protected Routes
- All authenticated pages require valid session
- Automatic redirect to login for unauthorized access
- Session state management via React hooks

### 2. Profile Management

#### Complete Profile (After Registration)
- Upload profile photo with image preview
- Enter personal information:
  - Full name
  - JNV batch year
  - JNV house (Aravali, Nilgiri, Shivalik, Udaygiri)
  - Migration JNV (if applicable)
- Enter professional information:
  - Current profession/job title
  - Company name
  - Current city
- Select help categories you can offer:
  - Mentorship
  - Career Guidance
  - Job Opportunities
  - Project Collaboration
  - Internship Opportunities
  - Technical Support
  - Business Advice
  - Interview Preparation
- Add personal bio

**Route:** `/complete-profile`
**Component:** `src/pages/auth/CompleteProfile.tsx`

#### Profile Image Upload
- Drag-and-drop or click-to-upload interface
- Image validation (type and size)
- Upload to Supabase Storage
- Direct URL storage in database

**Storage Bucket:** `profile-images`
**Max File Size:** 5MB
**Supported Formats:** JPEG, PNG, WebP, GIF

#### Profile Approval System
- Admin dashboard for profile verification
- Unapproved profiles hidden from directory
- Email notification on approval (optional)
- Auto-approval settings (optional)

**Admin Route:** `/admin`

### 3. Alumni Directory

#### Browse Profiles
- View all approved alumni profiles
- Grid layout with profile cards
- Profile information preview:
  - Name and batch year
  - Current profession and company
  - Current city
  - House affiliation
  - Profile photo
  - Help offered tags
  - Bio excerpt

**Route:** `/directory`
**Component:** `src/pages/Directory.tsx`

#### Search and Filter
- Search by name, company, or bio
- Filter by profession (dropdown)
- Filter by current city (dropdown)
- Advanced filtering combinations
- Real-time results update

#### Profile View
- Full profile details
- Large profile photo
- Complete bio
- All help categories
- Contact option
- Email display (for verified users)

**Route:** `/profile/:id`
**Component:** `src/pages/ProfileView.tsx`

### 4. Opportunities System

#### Post Opportunities
- Create internship postings
- Create job postings
- Create mentorship offers
- Create collaboration opportunities
- Add opportunity details:
  - Title
  - Description
  - Type (Internship, Job, Mentorship, Collaboration, Other)
  - Company name (optional)
  - Requirements
  - Active/inactive toggle

**Component:** `src/components/PostOpportunityDialog.tsx`

#### Browse Opportunities
- Filter opportunities by type
- Search opportunities
- View all active opportunities
- See poster information with opportunity

#### Opportunity Details
- Full opportunity description
- Poster profile information
- Quick contact option
- Share opportunity

### 5. Networking & Communication

#### Connect/Message
- Send direct messages to other alumni
- Message notifications (planned)
- Message history
- Read/unread status (planned)

#### Profile Verification
- Email-based verification
- Batch year validation
- Professional information verification

### 6. Admin Dashboard

#### Profile Management
- View all pending profile approvals
- Approve/reject profiles
- View profile full details
- Bulk operations (planned)

#### Statistics
- Total registered users
- Approved vs pending profiles
- Profiles by batch year
- Profiles by profession
- Profiles by city/location
- Opportunities posted
- Active opportunities

#### Settings (Admin)
- Create admin accounts
- Manage email templates
- Configure approval requirements
- View system logs

## Technical Stack

### Frontend
- **Framework:** React 18+ with TypeScript
- **Routing:** React Router v6
- **Styling:** TailwindCSS + PostCSS
- **UI Components:** shadcn/ui
- **State Management:** React Context API
- **HTTP Client:** Fetch API
- **Building:** Vite
- **Testing:** Vitest + Playwright

### Backend Services
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage
- **Real-time (Future):** Supabase Realtime

### Deployment
- **Frontend Host:** Vercel/Netlify/Azure Static Web Apps
- **Backend:** Supabase (serverless)
- **CDN:** Included with hosting providers

## Database Schema

### Profiles Table
- `id` (UUID) - User ID from Auth
- `email` - User email
- `full_name` - Display name
- `batch_year` - JNV batch year
- `house` - JNV house affiliation
- `migration_jnv` - Migration JNV name
- `profession` - Job title
- `company_name` - Current company
- `current_city` - Location
- `bio` - Personal bio
- `profile_image_url` - Photo URL
- `help_offered` - Array of help categories
- `is_approved` - Admin approval status
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

### Opportunities Table
- `id` (UUID) - Opportunity ID
- `user_id` (UUID) - Poster user ID
- `title` - Opportunity title
- `description` - Full description
- `type` - Category (Job, Internship, etc.)
- `company_name` - Associated company
- `requirements` - Requirements text
- `is_active` - Currently accepting
- `created_at` - Posted timestamp
- `updated_at` - Last update timestamp

### Messages Table
- `id` (UUID) - Message ID
- `sender_id` (UUID) - Sender user ID
- `recipient_id` (UUID) - Recipient user ID
- `subject` - Message subject
- `content` - Message body
- `is_read` - Read status
- `created_at` - Sent timestamp
- `updated_at` - Last update timestamp

## API Endpoints

All API operations use Supabase's auto-generated REST API and real-time database access. No custom backend required.

### Authentication
- `POST /auth/v1/signup` - Create account
- `POST /auth/v1/token` - Login
- `POST /auth/v1/logout` - Logout
- `POST /auth/v1/token/refresh` - Refresh session

### Profiles
- `GET /rest/v1/profiles?select=*` - List profiles
- `GET /rest/v1/profiles?id=eq.UUID` - Get profile
- `POST /rest/v1/profiles` - Create profile
- `PATCH /rest/v1/profiles?id=eq.UUID` - Update profile
- `DELETE /rest/v1/profiles?id=eq.UUID` - Delete profile

### Opportunities
- `GET /rest/v1/opportunities?select=*` - List opportunities
- `GET /rest/v1/opportunities?id=eq.UUID` - Get opportunity
- `POST /rest/v1/opportunities` - Create opportunity
- `PATCH /rest/v1/opportunities?id=eq.UUID` - Update opportunity
- `DELETE /rest/v1/opportunities?id=eq.UUID` - Delete opportunity

### Storage
- Profile images: `https://project.supabase.co/storage/v1/object/public/profile-images/profiles/{userId}.{ext}`

## User Flows

### Registration & Onboarding
1. User clicks "Sign Up"
2. Enters email and password
3. Account created via Supabase Auth
4. Redirected to Complete Profile page
5. Fills in profile information
6. Uploads profile photo
7. Selects help categories
8. Profile saved to database
9. Admin must approve profile
10. Email notification sent
11. Profile visible in directory
12. Can now browse and connect with others

### Browsing Alumni
1. Login to account
2. Navigate to Directory
3. Browse alumni profiles in grid
4. Search/filter profiles
5. Click on profile to view full details
6. Option to connect/message

### Posting Opportunities
1. Login to account
2. Open Post Opportunity dialog
3. Fill in opportunity details
4. Submit post
5. Opportunity visible to all authenticated users
6. Receive inquiries from interested alumni

## Security Features

### Authentication
- Secure password hashing (handled by Supabase)
- JWT token-based sessions
- Automatic session refresh
- Logout clears session

### Data Access
- Row-level security on all tables
- Users can only access their own data (except approved profiles)
- Admin access restricted to admin role
- Email verification (optional)

### File Upload
- File type validation (images only)
- File size limits (5MB max)
- Unique file names per user
- Public read, authenticated write to storage

### HTTPS
- All connections encrypted in transit
- Automatic redirect to HTTPS
- HSTS headers (on production)

## Email Notifications (Future)

### Planned Email Events
- Welcome email on signup
- Profile approval notification
- New message notification
- Connection request notification
- Opportunity posted by connections
- Weekly digest

### Email Configuration
- Supabase email templates editor
- Custom email sender
- Email template variables
- Unsubscribe management

## Analytics (Future)

### Tracked Metrics
- User registration count
- Profile completion rate
- Directory searches
- Profile views
- Messages sent
- Opportunities posted
- Connection requests

### Dashboard
- Real-time metrics
- Trends and charts
- User engagement stats
- Opportunity activity
- Demographics analysis

## Performance Optimizations

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Database query optimization with indexes
- Pagination for large lists
- Caching strategies

### Backend
- PostgreSQL indexes on frequently queried fields
- Batch operations for bulk data
- Connection pooling
- Query result caching

## Accessibility Features

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast compliance
- Alt text for images
- Screen reader support

## Mobile Responsiveness

- Mobile-first design
- Responsive grid layouts
- Touch-friendly buttons
- Mobile-optimized forms
- Responsive images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Future Enhancements

1. **Real-time Features**
   - Live notifications
   - Typing indicators in chat
   - Presence indicators

2. **Advanced Networking**
   - Direct messaging with real-time chat
   - Connection requests and approvals
   - Relationship status tracking

3. **Events System**
   - Create and RSVP for alumni events
   - Calendar integration
   - Event photos/gallery

4. **Analytics Dashboard**
   - Career path visualization
   - Network insights
   - Job market analytics

5. **Mobile App**
   - React Native iOS/Android
   - Offline support
   - Push notifications

6. **AI Features**
   - Profile recommendations
   - Connection suggestions
   - Smart search

7. **Integration**
   - LinkedIn integration
   - GitHub profile integration
   - Slack notifications

## Support & Maintenance

For issues or improvements:
1. Check existing GitHub issues
2. Create detailed bug report or feature request
3. Include environment details
4. Provide reproduction steps

See SETUP.md for deployment and configuration details.
