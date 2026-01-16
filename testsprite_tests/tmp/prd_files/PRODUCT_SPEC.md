# auth.pcstyle.dev - Product Specification

## Overview

Centralized authentication service for the pcstyle.dev ecosystem using WorkOS AuthKit.

## Features

### 1. Login Page (`/`)

- Display cybernetic-styled login UI with PCSTYLE branding
- Show "Sign In" button that redirects to WorkOS hosted login
- Show "Create an account" link for new users
- If user is already authenticated, show welcome message with their name/email and a "Sign Out" button

### 2. OAuth Callback (`/callback`)

- Handle OAuth redirect from WorkOS after authentication
- Set session cookie and redirect user back to homepage

### 3. Session API (`/api/me`)

- GET endpoint that returns current user data if authenticated
- Returns `{ status: "success", user: {...} }` with user info
- Returns `{ status: "error", code: "UNAUTHORIZED" }` with 401 if not authenticated

### 4. Session Management

- Cross-subdomain cookie support for `*.pcstyle.dev`
- Automatic session refresh via AuthKit middleware

## User Flows

### Sign In Flow

1. User visits `/`
2. User clicks "Sign In" button
3. User is redirected to WorkOS hosted login
4. User completes authentication (email/Google/GitHub)
5. WorkOS redirects to `/callback`
6. User is redirected back to `/` showing authenticated state

### Sign Out Flow

1. Authenticated user clicks "Sign Out" button
2. Session is cleared
3. User sees unauthenticated login page

## Tech Stack

- Next.js 16 (App Router)
- WorkOS AuthKit
- Convex (database)
- Tailwind CSS v4
