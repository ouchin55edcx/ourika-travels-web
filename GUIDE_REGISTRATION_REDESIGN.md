# Guide Registration Page Redesign — Complete ✅

## 🎨 Design Overview

The guide registration page has been completely redesigned with a modern split-screen layout featuring a 3-step wizard flow.

---

## 📐 Layout Structure

### Desktop (lg+)
- **LEFT PANEL** (420px / 480px): Fixed dark green (#0b3a2c) brand panel
  - Logo + close button
  - Headline: "Share the magic of Ourika Valley"
  - Vertical step progress indicator with animated states
  - Testimonial from existing guide
  
- **RIGHT PANEL**: Scrollable white form area (#f8faf8)
  - Step header with progress indicator
  - Form fields for current step
  - Navigation buttons (Back / Continue)
  - Sign in link

### Mobile
- No left panel
- Compact header with logo + close
- Horizontal progress bar showing step X of 3
- Full-width form content
- Same navigation pattern

---

## 🔢 3-Step Flow

### Step 1: Account
**Fields:**
- First name (required)
- Last name (required)
- Email address (required, validated)
- Password (required, min 8 chars)
  - Real-time strength indicator (red/amber/green)
  - Show/hide toggle
- Confirm password (required, must match)
  - Show/hide toggle

**Validation:**
- All fields validated before advancing to Step 2
- Inline error messages with icons
- Email format validation
- Password strength visual feedback

### Step 2: Your Profile
**Fields:**
- Phone number (required)
  - Icon prefix
  - Placeholder: "+212 6XX XXX XXX"
  
- Official guide badge (optional)
  - Drag & drop upload zone
  - Image preview with remove button
  - Upload progress indicator
  - Success badge when uploaded
  - Error handling
  - Accepts: JPG, PNG, WebP (max 10 MB)

**Validation:**
- Phone number required before advancing to Step 3
- Badge upload is optional

### Step 3: Verification
**Content:**
- Registration summary card
  - Name
  - Email
  - Phone
  - Badge status (✓ Uploaded or "Not uploaded")
  
- "What happens next" info box
  1. You'll receive a verification email
  2. Click the link to activate your account
  3. Complete your guide profile to start accepting bookings

- Terms & Privacy checkbox (required)
- Submit button: "Complete registration"

**Actions:**
- Validates terms checkbox
- Calls `registerGuide` server action
- Shows loading state: "Submitting..."
- Redirects to success page on completion
- Displays error message if registration fails

---

## 🎨 Visual Design

### Color Palette
- **Primary Green**: `#0b3a2c` (dark green)
- **Accent Green**: `#00ef9d` (bright green)
- **Background**: `#f8faf8` (light gray)
- **White**: `#ffffff`
- **Text Gray**: Various shades

### Typography
- **Headings**: Font-black, tight tracking
- **Labels**: Uppercase, wide tracking (0.2em)
- **Body**: Font-medium
- **Buttons**: Font-black

### Components

#### Left Panel (Desktop)
```
- Fixed position, full height
- Dark green background (#0b3a2c)
- White text with opacity variations
- Vertical step indicator with:
  - Numbered circles (or checkmark when complete)
  - Connecting lines (green when complete)
  - Step labels with hints
  - Smooth color transitions
```

#### Step Progress Indicator
```
States:
- Completed: Green circle with checkmark, green line
- Active: Green border circle with number, white text
- Upcoming: Gray border circle with number, gray text

Transitions: 300-500ms duration
```

#### Form Fields
```
- Rounded-xl borders
- Gray-200 border, white background
- Focus: Green border + ring
- Icon prefixes where applicable
- Error state: Red text + icon
```

#### Password Strength Bar
```
< 8 chars:  Red (1/4 width) - "Too short"
8-11 chars: Amber (2/4 width) - "Good"
12+ chars:  Green (full width) - "Strong"
```

#### Badge Upload Zone
```
States:
- Empty: Dashed border, hover effect
- Uploading: Spinner overlay
- Uploaded: Image preview + remove button + success badge
- Error: Red error message below
```

#### Navigation Buttons
```
Back: Text button, gray → green on hover
Continue/Submit: 
  - Rounded-full
  - Green background (#0b3a2c)
  - White text, font-black
  - Shadow effect
  - Hover: Darker green
  - Active: Scale down (0.95)
  - Disabled: 60% opacity
```

---

## 🔧 Technical Implementation

### State Management
```typescript
const [step, setStep] = useState(1);
const [form, setForm] = useState({
  firstName: '', lastName: '', email: '',
  password: '', confirmPassword: '', phone: '',
});
const [badgeUrl, setBadgeUrl] = useState('');
const [errors, setErrors] = useState<Record<string, string>>({});
const [submitError, setSubmitError] = useState<string | null>(null);
const [isPending, startTransition] = useTransition();
const [uploadingBadge, setUploadingBadge] = useState(false);
const [badgeError, setBadgeError] = useState<string | null>(null);
const [showPass, setShowPass] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);
```

### Validation Logic
```typescript
// Step 1 validation (before advancing to Step 2)
- First name: Required
- Last name: Required
- Email: Required + format validation
- Password: Min 8 characters
- Confirm password: Must match password

// Step 2 validation (before advancing to Step 3)
- Phone: Required
- Badge: Optional (no validation)

// Step 3 validation (before submit)
- Terms checkbox: Required (HTML5 validation)
```

### Server Actions
```typescript
// Badge upload
uploadGuideBadgeImage(formData) → { url: string } | { error: string }

// Registration
registerGuide(formData) → { success: string } | { error: string }
```

### Animations
```css
- Step content: fade-in + slide-in-from-right-4 (300ms)
- Progress bar: width transition (500ms)
- Step circles: color transition (300ms)
- Connecting lines: color transition (500ms)
- Buttons: scale on active (95%)
```

---

## 📱 Responsive Breakpoints

### Mobile (< lg)
- No left panel
- Full-width form
- Compact header
- Horizontal progress bar
- Stacked layout

### Desktop (lg: 1024px+)
- Left panel: 420px
- Form area: Remaining width (ml-[420px])

### Desktop XL (xl: 1280px+)
- Left panel: 480px
- Form area: Remaining width (ml-[480px])
- Larger headline text (5xl)

---

## ✅ Features Preserved

All existing logic maintained:
- ✅ Form state management
- ✅ Validation functions
- ✅ Badge upload to Cloudflare
- ✅ `registerGuide` server action
- ✅ Success page redirect
- ✅ Error handling
- ✅ Password visibility toggles
- ✅ Loading states

---

## 🎯 User Experience Improvements

### Before (Old Design)
- Single-page form
- All fields visible at once
- No progress indication
- Basic layout
- Mobile-first only

### After (New Design)
- ✅ Progressive disclosure (3 steps)
- ✅ Clear progress indication
- ✅ Desktop split-screen layout
- ✅ Visual hierarchy
- ✅ Step-by-step validation
- ✅ Password strength feedback
- ✅ Summary review before submit
- ✅ "What happens next" guidance
- ✅ Testimonial for social proof
- ✅ Smooth animations & transitions

---

## 🚀 Build Status

```bash
npm run build
```

**Result:** ✅ **SUCCESS** — Zero errors

---

## 📸 Layout Preview

```
┌─────────────────────────────────────────────────────────────┐
│ DESKTOP LAYOUT                                              │
├──────────────────┬──────────────────────────────────────────┤
│                  │                                          │
│  LEFT PANEL      │  RIGHT PANEL (Scrollable)                │
│  (Fixed)         │                                          │
│                  │  ┌────────────────────────────────────┐  │
│  ┌────────────┐  │  │ Step 1 of 3                        │  │
│  │ Logo    [X]│  │  │ Create your account                │  │
│  └────────────┘  │  │                                    │  │
│                  │  │ [First Name]  [Last Name]          │  │
│  Join our guide  │  │ [Email]                            │  │
│  network         │  │ [Password] [👁]                     │  │
│                  │  │ [Confirm Password] [👁]             │  │
│  Share the magic │  │                                    │  │
│  of Ourika Valley│  │ [Back]              [Continue →]   │  │
│                  │  └────────────────────────────────────┘  │
│  ┌─ Steps ────┐  │                                          │
│  │ ● Account  │  │                                          │
│  │ │          │  │                                          │
│  │ ○ Profile  │  │                                          │
│  │ │          │  │                                          │
│  │ ○ Verify   │  │                                          │
│  └────────────┘  │                                          │
│                  │                                          │
│  "Testimonial"   │                                          │
│  — Ahmed, 2022   │                                          │
│                  │                                          │
└──────────────────┴──────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ MOBILE LAYOUT                                               │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Ourika Travels                                    [X]   │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Step 1 of 3                              Account       │ │
│ │ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Step 1 of 3                                                 │
│ Create your account                                         │
│                                                             │
│ [First Name]  [Last Name]                                   │
│ [Email]                                                     │
│ [Password] [👁]                                              │
│ [Confirm Password] [👁]                                      │
│                                                             │
│                              [Continue →]                   │
│                                                             │
│ Already have an account? Sign in                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎉 Summary

The guide registration page has been completely redesigned with:
- ✅ Modern split-screen layout (desktop)
- ✅ 3-step progressive wizard
- ✅ Visual step progress indicator
- ✅ Password strength feedback
- ✅ Badge upload with preview
- ✅ Registration summary review
- ✅ Smooth animations
- ✅ Mobile-responsive
- ✅ All existing logic preserved
- ✅ Zero build errors

**Ready for production!** 🚀

