# SABO Arena - Tab Architecture Overview 🏗️

## Tổng Quan Cấu Trúc Tab System

SABO Arena sử dụng **4 main tabs** với architecture patterns khác nhau, mỗi tab phục vụ mục đích và user experience riêng biệt.

---

## 🏠 HOME TAB - Social Media Feed Architecture

### Cấu Trúc Layout
```
HomeScreen (Social Feed Container)
├── ImageBackground (Pool Table Scene)
│   ├── CustomStatusBar
│   ├── HomeHeader
│   │   ├── Weather Info
│   │   ├── Messages Icon
│   │   └── Notifications Icon
│   ├── TabNavigation ("Lân cận" | "Đã Follow")
│   ├── MainContent (Flex Container)
│   │   ├── ProfileCard (User Avatar + Name)
│   │   ├── RankBadge (Current Rank Display)
│   │   └── ActionButtons ("Chơi ngay" | "Lên lịch")
│   └── Floating Elements (Absolute Positioned)
│       ├── SocialActions (Right Side)
│       │   ├── Like Button (❤️ + Count)
│       │   ├── Comment Button (💬 + Count)
│       │   └── Share Button (📤 + Count)
│       ├── ClubInfo (Bottom Left)
│       │   ├── Club Avatar
│       │   ├── Club Name + Location
│       │   └── Online Status
│       └── PostContent (Bottom Center)
│           ├── Username
│           ├── Date
│           └── Content + Hashtags
└── DemoButton (Floating FAB - Bottom Right)
```

### Architecture Pattern
- **Layout Style:** TikTok/Instagram-inspired vertical feed
- **Positioning:** Absolute positioning for social elements
- **Background:** ImageBackground with theme fallback
- **Interaction:** Social media interactions (like, comment, share)
- **Navigation:** Tab-based content filtering

### Key Components
- `CustomStatusBar` - Status bar theming
- `HomeHeader` - Top navigation with actions
- `TabNavigation` - Content filter tabs
- `ProfileCard` - User profile display
- `RankBadge` - Rank visualization
- `ActionButtons` - Primary CTAs
- `SocialActions` - Social interaction sidebar
- `ClubInfo` - Club information overlay
- `PostContent` - Post content display

---

## 👤 PROFILE TAB - User Dashboard Architecture

### Cấu Trúc Layout
```
ProfileScreen (User Dashboard)
├── Header Section
│   ├── StatusBar
│   ├── Profile Navigation
│   │   ├── Back Button
│   │   ├── Title ("Hồ sơ")
│   │   └── Menu Button
│   └── User Avatar (Large Display)
├── Profile Info Section
│   ├── User Name
│   ├── Rank Badge
│   └── Stats Container
│       ├── Win Rate (Tỉ lệ thắng)
│       ├── Tournaments (Giải đấu)
│       └── Points (SPA điểm)
└── Content Section
    └── ProfileTournamentList (Nested Component)
        ├── Tab Navigation
        │   ├── "Tham gia" Tab
        │   ├── "Đã thắng" Tab
        │   └── "Lịch sử" Tab
        ├── Tournament Items
        │   ├── Tournament Card
        │   │   ├── Tournament Info
        │   │   ├── Date & Time
        │   │   ├── Participants
        │   │   └── Status Badge
        │   └── Action Buttons
        ├── Loading State
        └── Empty State
```

### Architecture Pattern
- **Layout Style:** Traditional profile dashboard
- **Structure:** Hierarchical sections with nested components
- **Data Display:** Stats-focused with tournament history
- **Interaction:** Tab-based tournament filtering

### Key Components
- `AppHeader` - Unified header component
- `ProfileCard` - User profile display
- `RankBadge` - Rank visualization
- `StatsRow` - Statistics display
- `ProfileTournamentList` - Tournament history management
- `LoadingState` - Loading indicators
- `EmptyState` - Empty state handling

---

## 🏆 TOURNAMENTS TAB - Competition Hub Architecture

### Cấu Trúc Layout
```
TournamentsScreen (Competition Container)
├── SafeAreaView Container
├── ScrollView
│   ├── TournamentHeader
│   │   ├── Page Title
│   │   ├── Quick Stats
│   │   └── Ranking Button
│   ├── TournamentFilters
│   │   ├── "Tất cả" Filter
│   │   ├── "Sắp diễn ra" Filter
│   │   ├── "Đang live" Filter
│   │   └── "Đã kết thúc" Filter
│   └── Content Area
│       ├── Tournament List
│       │   └── TournamentListItem (Multiple)
│       │       ├── Tournament Image
│       │       ├── Tournament Info
│       │       │   ├── Title
│       │       │   ├── Status Badge
│       │       │   ├── Description
│       │       │   ├── Prize Pool
│       │       │   ├── Participants Count
│       │       │   ├── Rank Requirements
│       │       │   ├── Location & Time
│       │       │   └── Join Button
│       ├── TournamentLoadingState
│       └── TournamentEmptyState
└── Detail View (Conditional)
    └── TournamentDetail
        ├── Tournament Header
        ├── Detailed Information
        ├── Participants List
        ├── Rules & Requirements
        └── Action Buttons
```

### Architecture Pattern
- **Layout Style:** List-based content browser
- **Structure:** Filter → List → Detail workflow
- **Data Management:** Server-state with TRPC
- **Interaction:** Tournament browsing and joining

### Key Components
- `TournamentHeader` - Page header with navigation
- `TournamentFilters` - Status-based filtering
- `TournamentListItem` - Tournament card component
- `TournamentDetail` - Detailed tournament view
- `TournamentLoadingState` - Loading indicators
- `TournamentEmptyState` - Empty state handling

---

## 🏛️ CLUBS TAB - Multi-Level Navigation Architecture

### Cấu Trúc Layout
```
ClubsScreen (Complex Navigation Container)
├── SafeAreaView Container
├── ScrollView
│   ├── Header Section
│   │   ├── StatusBar
│   │   └── Page Title
│   ├── Main Tabs (Level 1)
│   │   ├── "Tham gia" Tab
│   │   ├── "Khám phá" Tab
│   │   └── "Đã tạo" Tab
│   └── Tab Content Areas
│       ├── Tham Gia Tab Content
│       │   ├── Sub-tabs (Level 2)
│       │   │   ├── "Hoạt động" Sub-tab
│       │   │   └── "Thành viên" Sub-tab
│       │   ├── Club Avatar Section
│       │   │   ├── Club Image
│       │   │   ├── Club Name
│       │   │   ├── Location
│       │   │   └── Member Count
│       │   ├── Stats Container
│       │   │   ├── Active Members
│       │   │   ├── Total Tournaments
│       │   │   └── Success Rate
│       │   └── Content Areas
│       │       ├── Hoạt động Content
│       │       │   ├── Activity Items
│       │       │   ├── Loading State
│       │       │   └── Empty State
│       │       └── Thành viên Content
│       │           ├── Member List
│       │           │   └── MemberItem
│       │           │       ├── Avatar
│       │           │       ├── Name & Rank
│       │           │       ├── Stats
│       │           │       └── Actions
│       │           ├── Loading State
│       │           └── Empty State
│       ├── Khám Phá Tab Content
│       │   ├── Search Functionality
│       │   ├── Club Discovery List
│       │   ├── Loading State
│       │   └── Empty State
│       └── Đã Tạo Tab Content
│           ├── Created Clubs List
│           ├── Create New Club Button
│           ├── Loading State
│           └── Empty State
```

### Architecture Pattern
- **Layout Style:** Multi-level nested navigation
- **Structure:** Tabs → Sub-tabs → Content hierarchy
- **State Management:** Complex state coordination
- **Interaction:** Multi-level content filtering

### Key Components
- `StatusBar` - Status bar management
- `TabNavigation` - Main tab navigation
- `ClubInfo` - Club information display
- `StatsRow` - Statistics visualization
- `MemberItem` - Member list item
- `LoadingState` - Loading indicators
- `EmptyState` - Empty state handling

---

## 🔄 Cross-Tab Integration & Shared Architecture

### Shared Components System
```
/components/shared/
├── Navigation Components
│   ├── AppHeader - Unified header across tabs
│   ├── TabNavigation - Reusable tab system
│   └── StatusBar - Status bar theming
├── Data Display Components
│   ├── ProfileCard - User profile display
│   ├── RankBadge - Rank visualization
│   ├── StatsRow - Statistics display
│   └── ClubInfo - Club information
├── Interactive Components
│   ├── ActionButtons - Primary CTAs
│   ├── SocialActions - Social interactions
│   └── PostContent - Content display
├── State Components
│   ├── LoadingState - Loading indicators
│   └── EmptyState - Empty state handling
└── Tournament Components
    ├── TournamentHeader - Tournament page header
    ├── TournamentFilters - Filter controls
    ├── TournamentListItem - Tournament cards
    └── TournamentDetail - Detailed views
```

### Navigation Flow
```
App Root
├── _layout.tsx (Root Layout + ThemeProvider)
└── (tabs)/ (Tab Layout)
    ├── _layout.tsx (Tab Navigation Setup)
    ├── home.tsx → HomeScreen
    ├── profile.tsx → ProfileScreen
    ├── tournaments.tsx → TournamentsScreen
    └── clubs.tsx → ClubsScreen
```

### Data Flow Architecture
```
Data Layer
├── TRPC Client (API Communication)
├── Server State Management
├── Local State (useState)
└── Context Providers
    ├── ThemeProvider (Design System)
    ├── AuthContext (Authentication)
    └── SABODataProvider (App Data)
```

---

## 📊 Architecture Patterns Comparison

### Complexity Levels
1. **Tournaments** - Simple (Container + Shared Components)
2. **Profile** - Medium (Dashboard + Nested Component)
3. **Home** - High (Social Media Layout + Absolute Positioning)
4. **Clubs** - Very High (Multi-level Navigation + Complex State)

### Design Token Integration
1. **Profile** - 100% integrated (Full migration)
2. **Clubs** - 100% integrated (Complex theming)
3. **Tournaments** - Container-level (Shared component focused)
4. **Home** - Hybrid approach (Systematic + Custom positioning)

### Component Reusability
- **High Reuse:** StatusBar, AppHeader, LoadingState, EmptyState
- **Medium Reuse:** ProfileCard, RankBadge, StatsRow
- **Tab Specific:** Tournament components, Social components
- **Unique:** Multi-level navigation (Clubs), Absolute positioning (Home)

### State Management Patterns
- **Simple State:** Home (local useState)
- **Server State:** Tournaments (TRPC queries)
- **Complex State:** Profile (nested component state)
- **Multi-level State:** Clubs (nested tab state coordination)

---

## 🎯 Architecture Success Metrics

### Code Reusability
- **Shared Components:** 15+ reusable components
- **Design System:** Consistent theming across all tabs
- **Type Safety:** 100% TypeScript coverage

### User Experience
- **Navigation Consistency:** Unified patterns across tabs
- **Performance:** Optimized rendering and state management
- **Accessibility:** Proper touch targets and screen reader support

### Maintainability
- **Clear Separation:** Layout vs. Components vs. Business Logic
- **Documentation:** Comprehensive migration summaries
- **Design Token Integration:** Systematic styling approach

This architecture overview shows how each tab serves different user needs while maintaining consistency through shared components and design system integration.

---
*Architecture documentation complete - SABO Arena tab system fully analyzed* 🏗️