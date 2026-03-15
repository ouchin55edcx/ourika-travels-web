# Guide Registration & Profile System Implementation

## ✅ Completed Tasks

All tasks have been successfully implemented and the build passes with zero errors.

---

## 📋 Implementation Summary

### PART 1: Database Schema (Supabase SQL)

**⚠️ ACTION REQUIRED:** Run this SQL migration in your Supabase SQL Editor:

```sql
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS specialties    TEXT[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS languages      TEXT[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS location       TEXT,
  ADD COLUMN IF NOT EXISTS years_experience INTEGER,
  ADD COLUMN IF NOT EXISTS certifications TEXT[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS badge_image_url TEXT;
```

### PART 2: Updated AuthUser Type ✅

**File:** `lib/auth.ts`

Added new fields to the `AuthUser` type:
- `badge_image_url: string | null`
- `specialties: string[]`
- `languages: string[]`
- `location: string | null`
- `years_experience: number | null`
- `certifications: string[]`

### PART 3: Simplified Guide Registration ✅

**File:** `app/register/guide/page.tsx`

**Changes:**
- ✅ Removed multi-step wizard
- ✅ Single-page registration form
- ✅ Minimal required fields: first name, last name, email, phone, password
- ✅ Optional badge upload during registration
- ✅ Clean, modern UI with proper validation
- ✅ Badge upload integration with Cloudflare Images

**Features:**
- Real-time validation
- Password visibility toggle
- Badge image preview
- Error handling
- Success redirect to `/register/guide/success`

### PART 4: Server Actions ✅

**File:** `app/actions/auth.ts`

Added `uploadGuideBadgeImage` function:
- Validates file type (JPG, PNG, WebP)
- Max file size: 10 MB
- Uploads to Cloudflare Images with folder: 'guide-badges'
- Returns `{ url: string }` or `{ error: string }`

Updated `registerGuide` function:
- Accepts `badge_image_url` from form data
- Saves badge URL to database during registration
- Simplified to work with single-step form

**File:** `app/actions/profile.ts`

Added `updateGuideProfile` function:
- Updates all guide profile fields
- Handles JSON parsing for arrays (languages, specialties, certifications)
- Validates user role (guide only)
- Revalidates profile pages after update
- Returns `{ success: true }` or `{ error: string }`

### PART 5: Guide Profile Page Structure ✅

**File:** `app/dashboard/guide/profile/page.tsx`

Server Component features:
- ✅ Dynamic metadata generation (SEO-optimized)
- ✅ Profile completeness calculation (10 fields)
- ✅ Role-based access control
- ✅ Renders two components: GuideProfileView + GuideProfileEditor

**Completeness Score Calculation:**
```typescript
const fields = [
  !!user.full_name, !!user.phone, !!user.bio,
  !!user.avatar_url, !!user.location,
  (user.languages?.length ?? 0) > 0,
  (user.specialties?.length ?? 0) > 0,
  !!user.years_experience,
  (user.certifications?.length ?? 0) > 0,
  !!user.guide_badge_code || !!user.badge_image_url,
];
const completeness = Math.round(
  (fields.filter(Boolean).length / fields.length) * 100
);
```

### PART 6: GuideProfileView Component ✅

**File:** `app/dashboard/guide/profile/GuideProfileView.tsx`

Server Component that displays:
- ✅ Profile completeness progress bar (color-coded: green >80%, amber 50-80%, red <50%)
- ✅ Avatar (circular, 120×120)
- ✅ Full name, location, bio
- ✅ Stats row: years experience, languages count, specialties count
- ✅ Specialties pills (with star icons)
- ✅ Languages pills (with language icons)
- ✅ Certifications list (with checkmarks)
- ✅ Guide badge display (image + verification status)
- ✅ Contact information (email, phone)
- ✅ "View as traveler" button (disabled, coming soon)

### PART 7: GuideProfileEditor Component ✅

**File:** `app/dashboard/guide/profile/GuideProfileEditor.tsx`

Client Component with 8 sections:

#### 1. Identity Section
- Full name input
- Location input (e.g., "Setti Fatma, Ourika Valley")
- Years of experience (number input, 1-50)

#### 2. Your Story Section
- Bio textarea (5 rows)
- Character counter
- Minimum 100 characters recommended

#### 3. Profile Photo Section
- Circular avatar upload zone (120×120 preview)
- Drag & drop or click to upload
- Image preview with remove button
- Upload progress indicator

#### 4. Official Guide Badge Section
- Badge image upload zone
- Badge code text input (optional)
- Placeholder: "e.g., GD-2026-MA-0042"

#### 5. Languages Section
- Multi-select pill toggles
- Available: Arabic, French, English, Spanish, German, Italian, Chinese, Russian
- Selected: green background, white text
- Unselected: gray border

#### 6. Specialties Section
- Multi-select pill toggles
- Available: Hiking, Cultural tours, Cooking classes, Photography, Berber villages, Waterfall hikes, Sunrise treks, Family tours, Camel rides, 4x4 adventures
- Same styling as languages

#### 7. Certifications Section
- Dynamic list with add/remove
- Text input with "Add" button
- Quick-add suggestions:
  - Certified mountain guide
  - First-aid trained
  - Cultural ambassador
  - Tourism license
  - Language interpreter
- Each certification has a delete button

#### 8. Save Button
- Full-width, rounded
- States: "Save profile" → "Saving..." → "✓ Profile saved!"
- Auto-refreshes page after 2 seconds
- Error display if save fails

---

## 🎨 UI/UX Features

### Registration Page
- Clean, single-column layout
- Mobile-responsive
- Sticky header with close button
- Hero section with emoji icon (🧭)
- Inline validation errors
- Password visibility toggles
- Optional badge upload with preview
- Terms & privacy policy links
- "Already have an account?" link

### Profile View
- Completeness banner with progress bar
- Color-coded progress (green/amber/red)
- Professional card layout
- Icon-based stats
- Pill-style tags for specialties/languages
- Verified badge indicator
- Contact info section
- Disabled "public view" button (future feature)

### Profile Editor
- Sectioned form with clear headings
- Icon-based section headers
- Upload zones with drag & drop
- Image previews with remove buttons
- Toggle-style multi-select (languages, specialties)
- Dynamic list management (certifications)
- Quick-add suggestions
- Character counter for bio
- Error handling with alerts
- Success feedback with auto-refresh

---

## 🔧 Technical Details

### File Structure
```
app/
├── actions/
│   ├── auth.ts (uploadGuideBadgeImage, registerGuide)
│   └── profile.ts (updateGuideProfile)
├── dashboard/guide/profile/
│   ├── page.tsx (Server Component)
│   ├── GuideProfileView.tsx (Server Component)
│   └── GuideProfileEditor.tsx (Client Component)
└── register/guide/
    └── page.tsx (Client Component)

lib/
└── auth.ts (AuthUser type)
```

### Dependencies
- Next.js 16.1.6
- React 19
- Lucide React (icons)
- Cloudflare Images (file uploads)
- Supabase (database)

### API Routes
None required - uses Server Actions

### Environment Variables Required
- `NEXT_PUBLIC_APP_URL`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `NEXT_PUBLIC_CLOUDFLARE_IMAGE_DELIVERY_URL`
- Supabase credentials

---

## ✅ Verification Checklist

- [x] `npm run build` — zero errors ✅
- [ ] Run SQL migration in Supabase
- [ ] Test `/register/guide` — single-step form works
- [ ] Test badge upload — image appears in Cloudflare dashboard
- [ ] Test registration — saves full_name, phone, badge_image_url to users table
- [ ] Test `/dashboard/guide/profile` — shows completeness % bar
- [ ] Test profile editor — pre-fills with existing data
- [ ] Test avatar upload — updates profile photo preview
- [ ] Test save profile — updates all columns in Supabase
- [ ] Test completeness bar — updates after saving (page revalidates)
- [ ] Test metadata — uses real user bio and avatar_url for SEO
- [ ] Test badge display — shows in profile view if uploaded

---

## 🚀 Next Steps

1. **Run the SQL migration** in Supabase SQL Editor (see PART 1)
2. **Test the registration flow** at `/register/guide`
3. **Test the profile editor** at `/dashboard/guide/profile`
4. **Verify data persistence** in Supabase dashboard
5. **Check Cloudflare Images** dashboard for uploaded badges/avatars

---

## 📝 Notes

### What Changed
- Removed multi-step wizard from guide registration
- Guides now register with minimal info (name, email, phone, password)
- Badge upload is optional during registration
- Profile completion happens after registration in the dashboard
- Profile completeness score encourages guides to fill out their profiles

### What Stayed the Same
- Email verification flow
- Authentication system
- Role-based access control
- Cloudflare Images integration
- Supabase database structure (with new columns)

### Future Enhancements
- Public guide profile pages (`/guide/[id]`)
- Guide ratings and reviews
- Booking integration
- Availability calendar
- Guide verification workflow
- Multi-language support for profiles

---

## 🐛 Known Issues

- None! Build passes with zero errors ✅
- Warning about static params generation (non-critical)

---

## 📞 Support

If you encounter any issues:
1. Check the Supabase SQL migration was run successfully
2. Verify environment variables are set correctly
3. Check Cloudflare Images API credentials
4. Review browser console for client-side errors
5. Check server logs for server action errors

---

**Implementation completed successfully! 🎉**

