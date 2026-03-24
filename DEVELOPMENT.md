# Development Guide - JNV Alumni Network

This guide provides information for developers working on the JNV Alumni Network project.

## 📋 Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Database Operations](#database-operations)
- [Testing](#testing)
- [Debugging](#debugging)
- [Deployment](#deployment)
- [Common Tasks](#common-tasks)

## 🚀 Getting Started

### Prerequisites
```bash
# Check Node version (need 18+)
node --version

# Install nvm if needed (for version management)
# https://github.com/nvm-sh/nvm
```

### Initial Setup
```bash
# Clone repository
git clone <repo-url>
cd jnv_connect

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your Supabase credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-key

# Setup Supabase database (run SQL from docs/database_schema.sql)

# Start development server
npm run dev
```

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── ui/                 # shadcn/ui components (auto-generated)
│   ├── Navbar.tsx          # Navigation bar
│   ├── PostOpportunityDialog.tsx
│   └── ...
│
├── pages/                  # Full page components
│   ├── auth/              # Authentication pages
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   └── CompleteProfile.tsx
│   ├── Directory.tsx       # Alumni directory
│   ├── ProfileView.tsx     # Profile detail view
│   └── ...
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Supabase client initialization
│   │   └── AuthContext.tsx # Auth context provider
│   ├── types.ts           # TypeScript interfaces
│   ├── utils.ts           # Utility functions
│   ├── mockData.ts        # Mock data for development
│   └── mockOpportunities.ts
│
├── hooks/                 # Custom React hooks
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   └── ...
│
├── App.tsx               # Main app component with routes
└── main.tsx              # React entry point
```

## 🔄 Development Workflow

### Starting Development
```bash
# Terminal 1: Start dev server
npm run dev

# Application runs at http://localhost:5173
```

### Creating a New Component

1. **Create component file** in appropriate directory
2. **Use TypeScript** with proper typing
3. **Import UI components** from `@/components/ui`
4. **Handle loading/error states** with toast notifications
5. **Add proper exports**

Example:
```typescript
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onAction}>Click me</Button>
    </div>
  );
}
```

### Adding a New Page/Route

1. **Create page component** in `src/pages/`
2. **Add route** to `App.tsx`
3. **Wrap with PrivateRoute** if authentication required
4. **Include Navbar** if navigation needed

```typescript
// In App.tsx
<Route
  path="/new-page"
  element={
    <PrivateRoute>
      <>
        <Navbar />
        <main className="flex-1">
          <NewPage />
        </main>
      </>
    </PrivateRoute>
  }
/>
```

### Making Database Queries

#### Using Supabase Client
```typescript
import { supabase } from "@/lib/supabase/client";

// SELECT
const { data, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", userId);

// INSERT
const { data, error } = await supabase
  .from("profiles")
  .insert([{ ...profileData }]);

// UPDATE
const { data, error } = await supabase
  .from("profiles")
  .update({ full_name: newName })
  .eq("id", userId);

// DELETE
const { data, error } = await supabase
  .from("profiles")
  .delete()
  .eq("id", userId);
```

#### Best Practices
- Always check for errors
- Handle loading state
- Show user feedback with toast
- Use proper types
- Validate data before sending

```typescript
const [loading, setLoading] = useState(false);

try {
  setLoading(true);
  
  const { data, error } = await supabase
    .from("table")
    .select("*");
  
  if (error) throw error;
  
  // Process data
  setData(data);
  
  toast({
    title: "Success",
    description: "Operation completed"
  });
} catch (err) {
  toast({
    title: "Error",
    description: err.message,
    variant: "destructive"
  });
} finally {
  setLoading(false);
}
```

## 📝 Code Standards

### TypeScript
- Always use TypeScript for new files
- Define interfaces for all component props
- Use proper typing for Supabase responses
- Avoid `any` type

### React Patterns
- Use functional components with hooks
- Prefer React.useState for local state
- Use React.useEffect for side effects
- Use custom hooks for reusable logic

### Styling
- Use TailwindCSS classes
- Use shadcn/ui components for common UI
- Avoid inline styles
- Use responsive classes (md:, lg:, etc.)

### Error Handling
- Use try-catch for async operations
- Always show errors to users via toast
- Log errors for debugging
- Provide specific error messages

### Naming Conventions
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Functions: camelCase (e.g., `getUserData()`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- Directories: kebab-case (e.g., `async-operations`)

## 🗄️ Database Operations

### Common Queries

#### Get All Profiles
```typescript
const { data: profiles } = await supabase
  .from("profiles")
  .select("*")
  .eq("is_approved", true);
```

#### Get User Profile
```typescript
const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", userId)
  .single();
```

#### Get User's Opportunities
```typescript
const { data: opportunities } = await supabase
  .from("opportunities")
  .select("*")
  .eq("user_id", userId)
  .eq("is_active", true);
```

#### Search Profiles
```typescript
const { data: results } = await supabase
  .from("profiles")
  .select("*")
  .ilike("full_name", `%${searchTerm}%`);
```

#### Count Records
```typescript
const { data, error } = await supabase
  .from("profiles")
  .select("*", { count: "exact" });
```

### File Upload/Storage

#### Upload Image
```typescript
const { data, error } = await supabase.storage
  .from("profile-images")
  .upload(`profiles/${userId}.jpg`, file);

// Get public URL
const { data: publicUrl } = supabase.storage
  .from("profile-images")
  .getPublicUrl(`profiles/${userId}.jpg`);
```

#### Update Profile with Image
```typescript
// Upload first
const uploadResult = await uploadImage(file, userId);

// Then update profile with URL
const { error } = await supabase
  .from("profiles")
  .update({ profile_image_url: uploadResult })
  .eq("id", userId);
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests
npm run e2e

# Coverage report
npm run test:coverage
```

### Testing Guidelines

#### Component Tests
- Test UI rendering
- Test user interactions
- Test props variations
- Test error states

#### Integration Tests
- Test authentication flow
- Test database operations
- Test file uploads
- Test navigation

#### E2E Tests
- Test complete user flow
- Test signup to profile view
- Test search and filtering
- Test opportunity posting

## 🐛 Debugging

### VS Code Debugging
1. Install "Debugger for Chrome" extension
2. Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### Console Logging
```typescript
// Debug data structures
console.log("User profile:", profile);
console.table(profiles); // Table format

// Error logging
console.error("Error occurred:", error);
console.warn("Warning:", message);
```

### Network Debugging
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Check Supabase API calls
4. Verify request/response payloads

### React DevTools
- Install React DevTools extension
- Inspect component tree
- Check props and state
- Track re-renders

## 🚀 Deployment

### Pre-deployment Checklist
```bash
# Run all checks
npm run check

# Build for production
npm run build

# Build is in /dist folder (ready for deployment)
```

### Environment Setup
1. Set production environment variables in hosting platform
2. Ensure Supabase production database is separate
3. Configure domain/HTTPS
4. Set up monitoring and error tracking

### Deployment Commands
```bash
# Build static files
npm run build

# Preview build locally
npm run preview

# Deploy (platform-specific)
# Vercel: Push to GitHub, auto-deploys
# Netlify: Connect repo and auto-deploys
# Manual: Upload /dist folder to static host
```

## 📝 Common Tasks

### Add New UI Component
1. Go to Supabase shadcn/ui library
2. Copy component code to recommended location
3. Import and use in your components

### Update Database Schema
1. Create migration file or SQL query
2. Test in development database
3. Document changes
4. Apply to production database
5. Update type definitions in code

### Add New Feature
1. Create issue/ticket
2. Design feature and data flow
3. Plan database changes if needed
4. Implement backend (database/API)
5. Implement frontend components
6. Test thoroughly
7. Submit PR with documentation

### Fix Bug
1. Create bug report/issue
2. Reproduce bug locally
3. Find root cause
4. Implement fix
5. Add test to prevent regression
6. Submit PR with fix details

### Performance Optimization
1. Identify bottleneck (use DevTools Performance tab)
2. Analyze code
3. Implement optimization
4. Measure improvement
5. Document changes

## 🔗 Useful Links

- **Repository**: [GitHub URL]
- **Supabase Dashboard**: [Project URL]
- **Deployment Platform**: [Platform URL]
- **Issue Tracker**: [GitHub Issues]
- **Pull Requests**: [GitHub PRs]

## 📚 Documentation

- [Setup Guide](SETUP.md)
- [Features Documentation](FEATURES.md)
- [Quick Start](QUICKSTART.md)
- [Implementation Status](IMPLEMENTATION_STATUS.md)

## 🆘 Getting Help

1. Check existing documentation
2. Search GitHub issues
3. Ask in team discussions
4. Reach out to team lead

## 📞 Team Contacts

- **Project Lead**: [Name/Email]
- **Backend Lead**: [Name/Email]
- **Frontend Lead**: [Name/Email]

---

**Happy coding!** 🎉

If you have questions or suggestions, feel free to reach out or create an issue.
