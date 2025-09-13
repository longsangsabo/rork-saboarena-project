# Cấu trúc Navigation Hoàn chỉnh

## 1. Tab Navigation Chính (Bottom Tabs)

### 1.1 Trang chủ (Home)
- **File**: `app/(tabs)/home.tsx`
- **Chức năng**: Hiển thị tổng quan, tin tức, hoạt động gần đây

### 1.2 Tìm đối (Challenges)
- **File**: `app/(tabs)/challenges.tsx`
- **Chức năng**: Giao diện social media để tìm kiếm và tương tác với người chơi khác

### 1.3 Giải đấu (Tournaments)
- **File**: `app/(tabs)/tournaments.tsx`
- **Sub-tabs**: 
  - Ready: Giải đấu sắp diễn ra
  - Live: Giải đấu đang diễn ra
  - Done: Giải đấu đã kết thúc
- **Chi tiết giải đấu**: `components/tournaments/TournamentDetail.tsx`
  - **Sub-tabs trong chi tiết**:
    - Người tham gia
    - Giải thưởng
    - Bảng đấu
      - **Sub-tabs trong bảng đấu**:
        - Nhánh thắng
        - Nhánh thua
        - Semi-final

### 1.4 Club
- **File**: `app/(tabs)/clubs.tsx`
- **Main tabs**:
  - **CLB**: Quản lý club hiện tại
    - **Sub-tabs**:
      - Thành viên
      - Giải đấu (Ready/Live/Done)
      - Bảng xếp hạng (Prize Pool/ELO/SPA)
      - Thách đấu (Chờ đối/Lên xe/Đã xong)
  - **Tìm đối**: Danh sách các club khác để tham gia

### 1.5 Hồ sơ (Profile)
- **File**: `app/(tabs)/profile.tsx`
- **Chức năng**: Thông tin cá nhân, thống kê, cài đặt

## 2. Các trang độc lập (Stack Routes)

### 2.1 Bảng đấu chi tiết
- **File**: `app/tournament-bracket.tsx`
- **Sub-tabs**:
  - Nhánh thắng
  - Nhánh thua
  - Loại trực tiếp

### 2.2 Bảng xếp hạng
- **File**: `app/ranking.tsx`
- **Sub-tabs**:
  - Prize Pool
  - ELO
  - SPA

## 3. Components chính

### 3.1 Tournament Components
- `components/tournaments/TournamentCard.tsx`
- `components/tournaments/TournamentDetail.tsx`
- `components/tournaments/TournamentListItem.tsx`

### 3.2 Challenge Components
- `components/challenges/ChallengeCard.tsx`
- `components/challenges/ChallengeTabs.tsx`
- `components/challenges/ChallengeHeader.tsx`

### 3.3 Ranking Components
- `components/shared/RankingCard.tsx`
- `components/shared/RankingTabs.tsx`
- `components/shared/RankingHeader.tsx`

### 3.4 Club Components
- `components/clubs/MemberItem.tsx`

### 3.5 Shared Components
- `components/shared/ActionButtons.tsx`
- `components/shared/AppHeader.tsx`
- `components/shared/ClubInfo.tsx`
- `components/shared/EmptyState.tsx`
- `components/shared/LoadingState.tsx`
- `components/shared/PostContent.tsx`
- `components/shared/ProfileCard.tsx`
- `components/shared/RankBadge.tsx`
- `components/shared/SocialActions.tsx`
- `components/shared/StatusBar.tsx`
- `components/shared/StatsRow.tsx`
- `components/shared/TabNavigation.tsx`

## 4. Cấu trúc phân cấp hoàn chỉnh

```
App
├── Bottom Tabs
│   ├── Trang chủ
│   ├── Tìm đối (Social Media Style)
│   ├── Giải đấu
│   │   ├── Ready/Live/Done
│   │   └── Tournament Detail
│   │       ├── Người tham gia
│   │       ├── Giải thưởng
│   │       └── Bảng đấu → Tournament Bracket
│   │           ├── Nhánh thắng
│   │           ├── Nhánh thua
│   │           └── Semi-final
│   ├── Club
│   │   ├── CLB
│   │   │   ├── Thành viên
│   │   │   ├── Giải đấu (Ready/Live/Done)
│   │   │   ├── Bảng xếp hạng (Prize Pool/ELO/SPA)
│   │   │   └── Thách đấu (Chờ đối/Lên xe/Đã xong)
│   │   └── Tìm đối
│   └── Hồ sơ
└── Stack Routes
    ├── Tournament Bracket
    └── Ranking
```

## 5. Tính năng đã triển khai

✅ **Hoàn thành**:
- Cấu trúc tab navigation chính
- Club với 2 main tabs (CLB/Tìm đối)
- Club CLB với 4 sub-tabs (Thành viên/Giải đấu/Bảng xếp hạng/Thách đấu)
- Tournament với sub-tabs (Ready/Live/Done)
- Tournament Detail với 3 tabs (Người tham gia/Giải thưởng/Bảng đấu)
- Tournament Bracket với 3 tabs (Nhánh thắng/Nhánh thua/Loại trực tiếp)
- Ranking với 3 tabs (Prize Pool/ELO/SPA)
- Challenge với 3 tabs (Chờ đối/Lên xe/Đã xong)
- Tích hợp navigation giữa các trang
- Components tái sử dụng
- Mock data cho demo

## 6. Lưu ý kỹ thuật

- Sử dụng Expo Router cho file-based routing
- TypeScript với type safety đầy đủ
- React Native Web compatibility
- Responsive design cho mobile
- Lucide React Native icons
- Consistent styling với StyleSheet
- Error handling và loading states
- tRPC integration cho backend calls