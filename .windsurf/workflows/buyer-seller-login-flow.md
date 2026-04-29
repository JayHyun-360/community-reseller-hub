---
description: Two-step login flow: Google auth first, then role selection
---

# Buyer-Seller Login Flow Plan

## Problem
Currently, all Google login users become "sellers" by default. There's no way for buyers (non-sellers) to log in.

## Solution: Two-Step Flow

### Step 1: Google OAuth Login
- User clicks "Continue with Google"
- User authenticates via Google
- User is created in `auth.users` with default role = `user` (NOT `seller`)
- User is redirected to onboarding page

### Step 2: Role Selection (Onboarding)
- Show onboarding page asking: "What would you like to do?"
- **Option A**: "Browse & Buy" (becomes buyer - no seller dashboard)
- **Option B**: "Start Selling" (becomes seller - gets dashboard access)

### Implementation Steps

#### 1. Database Changes
- Migration: Set default role to 'user' instead of 'seller'
```sql
-- In handle_new_user trigger, change:
COALESCE(NEW.raw_user_meta_data->>'role', 'user')
```

#### 2. Create Onboarding Page
- New route: `/onboarding` 
- After Google login, if role not set, redirect here
- Two large cards: "Browse" vs "Sell"
- On selection, update profile role and redirect accordingly

#### 3. Modify Login Flow
- After Google OAuth callback, check if user has role
- If no role yet (new user), redirect to `/onboarding`
- If role = 'user', redirect to home (browse mode)
- If role = 'seller', redirect to dashboard

#### 4. Role-Based Access
- Update middleware/RLS to check role
- Buyers: can browse, favorite, message sellers
- Sellers: all of above + dashboard, products management

## User Experience

```
[Login Page] 
    |
    v
[Google OAuth] --> [Onboarding Page]
    |                    |
    |               /          \
    |          "Browse"     "Start Selling"
    |              |             |
    v              v             v
[Home/Browse]   [Dashboard]
```
