# ListSync Repository Documentation

> Repo-level documentation for the **ListSync** Expo React Native application.

## 1) Project Overview

ListSync is a mobile-first list management app built with **Expo + React Native** and Firebase. It supports:

- Email/password and Google-based sign-in flows.
- List management (create/edit/delete/share lists).
- Item management inside lists, grouped by categories.
- A dedicated favourites list workflow.
- Settings and offer wall screens.

The app uses **expo-router** for routing and stores synchronized data across local AsyncStorage and Firebase Firestore.

## 2) Tech Stack

- **Framework**: Expo SDK 51, React Native 0.74
- **Routing**: expo-router (file-based)
- **UI**: React Native + react-native-paper
- **State**: Local component state + AsyncStorage
- **Backend**: Firebase Auth + Firestore
- **Language**: JavaScript/JSX
- **Testing/Lint**: Jest (jest-expo), Expo lint

## 3) Repository Structure

```text
app/
  _layout.jsx                 # Root stack + auth guard wrapper
  index.jsx                   # Default entry (welcome)
  auth/                       # Welcome/login/signup/google sign-in flows
  navigation/                 # AuthGuard + app navigation components
  ListManager/                # Main list overview screen and list-level actions
  ToDoManager/                # In-list item management screen
  BillsScreen/                # Bill-related feature screen
  Settings/                   # Settings and account actions
  firebase/                   # Firebase config + Firestore controllers
  util/                       # Reusable utility helpers/constants/theme
components/                   # Shared UI components (drawers/cards/loading)
reusables/                    # Reusable input/button/checkbox controls
assets/                       # Images, icons, fonts
scripts/                      # Maintenance scripts
```

## 4) App Flow and Navigation

### Root composition

- `app/_layout.jsx` loads fonts, injects `PaperProvider`, wraps routes in `AuthGuard`, and defines stack routes.
- `app/index.jsx` forwards to the welcome screen.

### Protected navigation

- `AuthGuard` listens for Firebase auth state (`onAuthStateChanged`).
- When unauthenticated, users are redirected to `/auth/login`.
- While auth state resolves, a loading component is shown.

### Bottom navigation

`BottomNavigationBar` exposes tabs:

- Home (`ToDoManager` with the default list)
- Lists (`ListManager`)
- Bills (`BillsScreen`)
- Favourite (`ToDoManager` with favourite list payload)
- Settings (`Settings`)

## 5) Data Model

### Firestore collections

#### `users`
Common fields (varies slightly by flow):
- `uid`
- `name`
- `email`
- `password` (non-google flow)
- `photo` (google flow)
- `notes` (JSON string array of note/list IDs)

#### `notes`
- `uid`
- `title`
- `notes` (description)
- `data` (serialized list items)
- `admin`
- `collaborators` (array)

### AsyncStorage keys

- `user`: currently logged-in user snapshot
- `todos`: local cache of all user list objects
- `favouriteList`: synthetic aggregate list + source IDs
- `defaultList`: persisted default list seed
- `suggestionList`: temporary selected recommendation items

## 6) Core Features

### Authentication

- Google sign-in is configured with a web client ID and validates users against Firestore.
- Existing users hydrate `todos` from Firestore notes.
- New users trigger:
  1. profile creation,
  2. default list initialization (local + cloud),
  3. favourite list initialization.

### List management (`ListManager`)

- Displays all lists from `todos`.
- Supports create/edit/delete list metadata.
- Supports share action via native share sheet.
- Can add source list items into the favourite list.

### Item management (`ToDoManager`)

- Opens a selected list from route params (`?item=` JSON payload).
- Ensures a default `My List` exists for guest users.
- Groups items by category and renders category-wise flat lists.
- Merges temporary suggestion items into active list.
- Syncs list item changes back to local storage and Firestore.

## 7) Local + Cloud Sync Strategy

The app keeps a local-first working copy in AsyncStorage while using Firestore as cloud source of truth. Common pattern:

1. Read/update list object in memory.
2. Persist to AsyncStorage (`todos`, related keys).
3. Push note changes to Firestore via controller methods.

This approach gives responsive UI even with variable network quality.

## 8) Setup and Run

### Prerequisites

- Node.js 18+
- npm
- Expo CLI toolchain (via `npx expo`)
- Android Studio / Xcode / Expo Go

### Install

```bash
npm install
```

### Start

```bash
npm run start
```

### Platform targets

```bash
npm run android
npm run ios
npm run web
```

### Lint / test

```bash
npm run lint
npm run test
```

## 9) Build and Release

EAS build profiles are configured in `eas.json` and scripts:

- `npm run build`
- `npm run build-dev`
- `npm run build-preview`
- `npm run build-production`

## 10) Security and Configuration Notes

- Firebase config and OAuth-related files are present in the repo (`firebaseConfig`, Google JSON files).
- For production hardening, prefer environment-variable or secret-managed config injection.
- Revisit any hardcoded IDs or test user references in auth/login flows before release.

## 11) Known Technical Debt / Improvement Opportunities

- Standardize routing usage (legacy navigator file vs expo-router stack).
- Consolidate duplicate helper names (`setToLocalStorage` exists in multiple modules).
- Improve async patterns in note hydration (`forEach(async ...)` sequencing).
- Add comprehensive unit/integration tests for storage sync and auth transitions.
- Replace placeholder legal/support content and ensure all linked routes exist.

## 12) Quick Start for Contributors

1. Install dependencies and run Expo.
2. Verify auth flow (Google + non-Google paths).
3. Create/edit/delete lists and items.
4. Validate favourite list aggregation and navigation.
5. Confirm Firestore writes and local cache consistency.

---

If you want this split into separate docs (`ARCHITECTURE.md`, `DATA_MODEL.md`, `CONTRIBUTING.md`) I can scaffold that next.
