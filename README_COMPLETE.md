# JNV Alumni Network

A modern web application connecting Jawahar Navodaya Vidyalaya (JNV) alumni, enabling networking, mentorship, and career opportunities.

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

## 🎯 Project Overview

JNV Alumni Network is a full-stack web application built to strengthen connections between JNV alumni across batches and locations. The platform enables:

- **Alumni Networking** - Browse and connect with fellow alumni
- **Profile Management** - Create and manage professional profiles
- **Opportunity Sharing** - Post and discover job, internship, and mentorship opportunities
- **Direct Communication** - Send messages to connect with others
- **Admin Management** - Profile approval and network administration

## ✨ Key Features

### For Students/Alumni
- ✅ Email-based registration and authentication
- ✅ Complete professional profile with photo upload
- ✅ Browse approved alumni directory with search/filter
- ✅ View detailed profiles of other alumni
- ✅ Post opportunities (jobs, internships, mentorship)
- ✅ Connect with other alumni
- ✅ Responsive mobile design

### For Administrators
- ✅ Admin dashboard for profile approvals
- ✅ Network statistics and analytics
- ✅ Opportunity management
- ✅ User management capabilities

## 🛠️ Tech Stack

### Frontend
- **React 18+** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **React Router v6** for client-side routing
- **TailwindCSS** for utility-first styling
- **shadcn/ui** for accessible UI components
- **Supabase Client** for backend integration

### Backend Services
- **Supabase** - PostgreSQL database, authentication, and file storage
- **PostgreSQL** - Relational database with RLS policies
- **Supabase Auth** - Email/password and OAuth authentication
- **Supabase Storage** - Profile image storage and CDN

### Development Tools
- **TypeScript** for type safety
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **ESLint** for code quality
- **Prettier** for code formatting

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jnv_connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Copy your Project URL and Anon Key
   - Create `.env.local`:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

4. **Setup Database**
   - In Supabase SQL Editor, run `docs/database_schema.sql`
   - Create `profile-images` storage bucket (public)

5. **Start Development Server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` to access the application.

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get running in 5 minutes
- **[Setup Guide](SETUP.md)** - Comprehensive setup with deployment options
- **[Features Documentation](FEATURES.md)** - Detailed feature overview
- **[Database Schema](docs/database_schema.sql)** - Complete database structure

## 📁 Project Structure

```
jnv_connect/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   └── *.tsx           # Feature components
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── Directory.tsx    # Alumni directory
│   │   └── ProfileView.tsx  # Profile viewing
│   ├── lib/
│   │   ├── supabase/       # Supabase client and context
│   │   ├── types.ts        # TypeScript type definitions
│   │   └── utils.ts        # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── docs/                   # Documentation files
│   └── database_schema.sql # Database setup
├── public/                 # Static assets
├── SETUP.md               # Complete setup guide
├── QUICKSTART.md          # Quick start guide
├── FEATURES.md            # Feature documentation
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── tailwind.config.ts     # TailwindCSS configuration
```

## 🔐 Security

- **Authentication**: Supabase Auth with email/password and optional OAuth
- **Row-Level Security**: Both `profiles` and `opportunities` tables have RLS enabled
- **Data Access**: Users can only access their own data (except approved profiles)
- **File Security**: Image uploads validated and stored securely
- **HTTPS**: All connections encrypted in transit
- **Password Security**: Minimum 6 characters with validation

## 📊 Database Schema

### Main Tables

**profiles**
- User profile information
- Contact and professional details
- Batch year and house affiliation
- Help offered categories
- Admin approval status

**opportunities**
- Job and internship postings
- Mentorship offers
- Collaboration requests
- Posted by alumni and marked as active/inactive

**messages**
- Direct messaging between alumni
- Read/unread status
- Timestamp tracking

See [Database Schema](docs/database_schema.sql) for complete structure.

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run e2e

# Run all checks (lint + test)
npm run check
```

## 🔗 API Endpoints

All API operations use Supabase's auto-generated REST API:

- **Authentication**: `/auth/v1/*` - User registration and login
- **Profiles**: `/rest/v1/profiles` - CRUD operations
- **Opportunities**: `/rest/v1/opportunities` - CRUD operations
- **Messages**: `/rest/v1/messages` - CRUD operations
- **Storage**: `/storage/v1/object/public/profile-images/*` - Image access

Full API documentation available at your Supabase project dashboard.

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub and import in Vercel
# Configure environment variables
# Auto-deploys on push
```

### Docker
```bash
docker build -t jnv-alumni .
docker run -p 80:80 jnv-alumni
```

### Other Platforms
- **Azure Static Web Apps**
- **AWS Amplify**
- **Netlify**
- **Firebase Hosting**

See [Setup Guide](SETUP.md) for detailed deployment instructions.

## 📝 User Flows

### Registration & Onboarding
1. Sign up with email/password
2. Complete profile with photo, career info, and availability
3. Admin approval process
4. Profile visible in directory

### Alumni Browsing
1. Login to account
2. Browse alumni directory with search/filters
3. View detailed profiles
4. Send connection requests

### Opportunity Management
1. Post job, internship, or mentorship opportunities
2. Other alumni can view and inquire
3. Opportunities marked active/inactive

## 🎨 Customization

### Branding
- Update logo and colors in component files
- Modify TailwindCSS theme in `tailwind.config.ts`
- Change email templates in Supabase dashboard

### Features
- Enable/disable authentication providers
- Configure profile approval process
- Customize help categories
- Add custom fields to profiles

## 🐛 Known Issues

- Real-time messaging not yet implemented
- Admin dashboard in development
- Event system in planning phase

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Authentication system
- [x] Profile management
- [x] Alumni directory
- [x] Image upload

### Phase 2 (In Progress)
- [ ] Real-time messaging
- [ ] Admin dashboard completion
- [ ] Email notifications
- [ ] Advanced search

### Phase 3 (Planned)
- [ ] Event management
- [ ] Mobile app (React Native)
- [ ] AI recommendations
- [ ] Video profiles
- [ ] LinkedIn integration

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/feature-name`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature/feature-name`)
5. Open a Pull Request

## 📖 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support & FAQ

### Setting up Supabase
- Create free account at https://supabase.com
- Get credentials from Project Settings > API
- Ensure environment variables in `.env.local`

### Database Issues
- Run SQL setup from `docs/database_schema.sql`
- Check RLS policies are enabled
- Verify Auth is configured

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm run clean` (if available)
- Check Node version: `node --version` (need 18+)

### Profile Not Appearing
- Profile must be approved by admin
- Check `is_approved` field in database
- Verify profile is saved before refresh

For more help, see [Full Documentation](SETUP.md) or [Features Guide](FEATURES.md).

## 📞 Contact & Feedback

- **Issues**: Create an issue on GitHub
- **Suggestions**: Open a discussion
- **Email**: [project contact info]

## 🙏 Acknowledgments

- JNV community for inspiration
- [Supabase](https://supabase.com) for backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- All contributors and testers

## 📊 Project Stats

- **Lines of Code**: ~3000+
- **Components**: 20+
- **Pages**: 8+
- **Database Tables**: 3+
- **API Endpoints**: 50+

---

**Made with ❤️ by the JNV Alumni Network Team**

[⬆ back to top](#jnv-alumni-network)
