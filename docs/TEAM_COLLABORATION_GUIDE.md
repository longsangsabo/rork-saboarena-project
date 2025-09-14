# 🚀 Team Collaboration Guide - SABO Billiards App

## 📋 Phân Chia Trách Nhiệm

### 👨‍🎨 **Developer A (UI/UX Specialist)**
**Chuyên trách: Frontend UI/UX, Components, Styling**

#### 🎯 Khu vực làm việc chính:
- `components/` - Tất cả UI components
- `app/(tabs)/` - Layout và styling của các tab screens
- `constants/colors.ts` - Design tokens và theme
- `packages/shared-ui/` - Shared UI components
- `packages/design-tokens/` - Design system

#### 📝 Nhiệm vụ cụ thể:
1. **Component Development**
   - Tối ưu hóa các component trong `components/shared/`
   - Tạo reusable components mới
   - Responsive design cho web/mobile
   - Animation và transitions

2. **Screen UI Implementation**
   - Hoàn thiện giao diện 5 tab chính
   - Profile screen avatar component
   - Club screen layout
   - Home screen feed design
   - Tournament screen UI

3. **Design System**
   - Maintain design tokens
   - Color schemes và typography
   - Spacing và layout consistency
   - Icon system với Lucide

---

### 👨‍💻 **Developer B (Backend/Logic Specialist)**
**Chuyên trách: Backend Logic, Data Flow, Business Logic**

#### 🎯 Khu vực làm việc chính:
- `backend/` - tRPC routes và business logic
- `packages/shared-business/` - Business logic modules
- `providers/` - Context providers và state management
- `lib/` - Utilities và helpers
- `supabase/` - Database functions

#### 📝 Nhiệm vụ cụ thể:
1. **Backend Development**
   - tRPC procedures trong `backend/trpc/routes/`
   - Database integration
   - Authentication flow
   - API endpoints

2. **State Management**
   - Context providers setup
   - Data fetching với React Query
   - AsyncStorage integration
   - Real-time updates

3. **Business Logic**
   - User management system
   - Tournament logic
   - Club management
   - Ranking system
   - Payment integration

---

## 🗂️ File Structure & Ownership

```
📁 Project Root
├── 🎨 UI Specialist Territory
│   ├── components/
│   │   ├── shared/           # Shared UI components
│   │   ├── tournaments/      # Tournament UI components  
│   │   └── clubs/           # Club UI components
│   ├── app/(tabs)/          # Tab screens UI
│   ├── constants/           # Design constants
│   └── packages/
│       ├── shared-ui/       # UI component library
│       └── design-tokens/   # Design system
│
├── 💻 Backend Specialist Territory  
│   ├── backend/             # tRPC backend
│   ├── providers/           # State management
│   ├── lib/                # Utilities
│   ├── packages/
│   │   ├── shared-business/ # Business logic
│   │   ├── shared-auth/     # Authentication
│   │   └── shared-types/    # TypeScript types
│   └── supabase/           # Database functions
│
└── 🤝 Shared Territory (Coordinate before changes)
    ├── app/_layout.tsx      # Root layout
    ├── app/index.tsx        # Entry point
    ├── types/              # Shared types
    └── utils/              # Shared utilities
```

---

## 🔄 Workflow & Communication

### 📅 Daily Sync (15 phút)
- **Thời gian**: Mỗi sáng 9:00 AM
- **Nội dung**: 
  - Progress update
  - Blockers và dependencies
  - Plan for the day

### 🔀 Git Workflow

#### Branch Naming Convention:
```bash
# UI Specialist
ui/feature-name
ui/fix-component-name
ui/refactor-screen-name

# Backend Specialist  
api/feature-name
logic/business-feature
data/integration-name
```

#### Commit Message Format:
```bash
# UI commits
ui: add tournament card component
ui: fix profile avatar sizing
ui: refactor home screen layout

# Backend commits
api: add user profile endpoint
logic: implement tournament ranking
data: setup club management
```

### 🚫 Conflict Prevention Rules

#### ❌ Tránh chỉnh sửa cùng lúc:
- `app/_layout.tsx` - Coordinate trước khi thay đổi
- `package.json` - Thông báo trước khi add dependencies
- `types/` folder - Discuss interface changes
- Shared components đã có người đang làm

#### ✅ Safe to work independently:
- UI Specialist: Tất cả files trong `components/`, styling, UI screens
- Backend Specialist: Tất cả files trong `backend/`, `providers/`, business logic

---

## 🛠️ Development Guidelines

### 🎨 UI Development Standards
```typescript
// Component structure
export interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({ }) => {
  // Component logic
  return (
    <View style={styles.container}>
      {/* JSX */}
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles using design tokens
});
```

### 💻 Backend Development Standards
```typescript
// tRPC procedure structure
export const procedureName = protectedProcedure
  .input(z.object({
    // Input validation
  }))
  .query/mutation(async ({ input, ctx }) => {
    // Business logic
    return result;
  });
```

---

## 📦 Dependencies Management

### 🎨 UI Dependencies (UI Specialist can add):
- UI libraries (react-native-*, expo-*)
- Animation libraries
- Icon libraries
- Styling utilities

### 💻 Backend Dependencies (Backend Specialist can add):
- Database libraries
- Validation libraries (zod, yup)
- Utility libraries (date-fns, lodash)
- Business logic libraries

### 🤝 Shared Dependencies (Discuss first):
- Major framework updates
- State management libraries
- Navigation libraries

---

## 🔧 Testing Strategy

### 🎨 UI Testing:
- Component visual testing
- Responsive design testing
- Cross-platform compatibility
- User interaction testing

### 💻 Backend Testing:
- API endpoint testing
- Business logic unit tests
- Database integration tests
- Authentication flow testing

---

## 📞 Communication Channels

### 💬 Quick Questions:
- Slack/Discord for immediate help
- Code comments for context

### 📋 Feature Discussions:
- GitHub Issues for feature planning
- Pull Request reviews for code quality

### 🚨 Blockers:
- Immediate notification if blocked
- Daily standup for resolution

---

## 🎯 Current Sprint Goals

### Week 1 Priorities:

#### 🎨 UI Specialist:
- [ ] Fix profile avatar component proportions
- [ ] Complete club screen layout
- [ ] Implement home screen feed design
- [ ] Create reusable tournament card component
- [ ] Setup design token system

#### 💻 Backend Specialist:
- [ ] Complete user authentication flow
- [ ] Implement tournament data endpoints
- [ ] Setup club management API
- [ ] Create ranking system logic
- [ ] Integrate real-time updates

---

## 🚀 Success Metrics

- **Zero merge conflicts** through proper coordination
- **Daily progress** on assigned areas
- **Clean code reviews** with constructive feedback
- **Feature completion** within sprint timelines
- **Cross-platform compatibility** maintained

---

## 📚 Resources

### 🎨 UI Resources:
- [React Native Styling Guide](https://reactnative.dev/docs/style)
- [Expo Design Guidelines](https://docs.expo.dev/guides/userinterface/)
- [Lucide Icons](https://lucide.dev/)

### 💻 Backend Resources:
- [tRPC Documentation](https://trpc.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Query Guide](https://tanstack.com/query/latest)

---

**Remember**: Communication is key! When in doubt, ask. Better to over-communicate than to create conflicts. 🤝

**Happy Coding!** 🚀