# Design System Migration Guide
*Step-by-step guide to migrate components from hardcoded values to design tokens*

## Overview
This guide helps you migrate components from hardcoded font sizes, colors, and spacing to our standardized design token system. Based on the comprehensive visual design audit, we found **50+ hardcoded colors**, **15+ font variations**, and **random spacing values** across components.

## Quick Setup

### 1. Wrap Your App with ThemeProvider
```tsx
// In your main App component or _layout.tsx
import { ThemeProvider } from '@/providers/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 2. Import Theme Hook
```tsx
import { useTheme } from '@/providers/ThemeProvider';
```

## Migration Steps

### Step 1: Identify Hardcoded Values
Look for these patterns in your components:
```tsx
// ❌ Hardcoded values to replace
fontSize: 18,
fontWeight: '600',
color: '#00ff88',
backgroundColor: '#1a1a1a',
padding: 16,
margin: 20,
```

### Step 2: Use Design Tokens

#### **Fonts & Typography**
```tsx
// ❌ Before
<Text style={{
  fontSize: 24,
  fontWeight: '700',
  color: '#ffffff'
}}>
  Title
</Text>

// ✅ After
const theme = useTheme();
<Text style={[
  theme.fontStyle('h3'),
  { color: theme.colorStyle('sabo.text.100') }
]}>
  Title
</Text>
```

#### **Colors**
```tsx
// ❌ Before
backgroundColor: '#1a1a1a',
color: '#00ff88',

// ✅ After  
backgroundColor: theme.colorStyle('sabo.background.900'),
color: theme.colorStyle('sabo.primary.400'),
```

#### **Spacing**
```tsx
// ❌ Before
padding: 16,
marginBottom: 24,

// ✅ After
padding: theme.spacingStyle(4), // 16px
marginBottom: theme.spacingStyle(6), // 24px
```

## Available Design Tokens

### Typography Presets
| Preset | Use Case | Font Size | Weight |
|--------|----------|-----------|---------|
| `h1` | Page titles | 36px | Bold (700) |
| `h2` | Section headers | 30px | Bold (700) |
| `h3` | Card titles | 24px | Semibold (600) |
| `h4` | Subsections | 20px | Semibold (600) |
| `body` | Body text | 16px | Normal (400) |
| `bodySmall` | Secondary text | 14px | Normal (400) |
| `label` | Form labels | 14px | Medium (500) |
| `caption` | Captions | 12px | Normal (400) |
| `buttonLarge` | Primary buttons | 16px | Semibold (600) |
| `buttonMedium` | Secondary buttons | 14px | Semibold (600) |

### Color Paths
| Path | Example Usage |
|------|---------------|
| `sabo.primary.400` | Brand highlights |
| `sabo.secondary.500` | Secondary actions |
| `sabo.background.900` | Dark backgrounds |
| `sabo.background.800` | Card backgrounds |
| `sabo.text.100` | Primary text |
| `sabo.text.400` | Secondary text |
| `sabo.success.500` | Success states |
| `sabo.error.500` | Error states |

### Spacing Scale (8px grid)
| Token | Value | Usage |
|-------|-------|--------|
| `0.5` | 2px | Fine adjustments |
| `1` | 4px | Small gaps |
| `2` | 8px | Default spacing |
| `3` | 12px | Small padding |
| `4` | 16px | Standard padding |
| `6` | 24px | Section spacing |
| `8` | 32px | Large spacing |
| `12` | 48px | Extra large |

## Migration Examples by Component Type

### Card Components
```tsx
// ❌ Before
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
  }
});

// ✅ After
const CardComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.colorStyle('sabo.background.800'),
        padding: theme.spacingStyle(4),
        marginBottom: theme.spacingStyle(4),
      }
    ]}>
      <Text style={[
        theme.fontStyle('h4'),
        {
          color: theme.colorStyle('sabo.text.100'),
          marginBottom: theme.spacingStyle(2),
        }
      ]}>
        Card Title
      </Text>
      <Text style={[
        theme.fontStyle('bodySmall'),
        { color: theme.colorStyle('sabo.text.400') }
      ]}>
        Card subtitle
      </Text>
    </View>
  );
};
```

### Button Components
```tsx
// ❌ Before
const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  }
});

// ✅ After
const Button = ({ title, variant = 'primary' }) => {
  const theme = useTheme();
  
  const getButtonColors = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: theme.colorStyle('sabo.primary.500'),
          text: theme.colorStyle('sabo.primary.50')
        };
      case 'secondary':
        return {
          bg: theme.colorStyle('sabo.secondary.500'),
          text: theme.colorStyle('sabo.secondary.50')
        };
      default:
        return {
          bg: theme.colorStyle('sabo.primary.500'),
          text: theme.colorStyle('sabo.primary.50')
        };
    }
  };
  
  const colors = getButtonColors();
  
  return (
    <TouchableOpacity style={[
      styles.button,
      {
        backgroundColor: colors.bg,
        paddingHorizontal: theme.spacingStyle(6),
        paddingVertical: theme.spacingStyle(3),
      }
    ]}>
      <Text style={[
        theme.fontStyle('buttonLarge'),
        { color: colors.text }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
```

### Form Components
```tsx
// ❌ Before
const formStyles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#cccccc',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
  }
});

// ✅ After
const FormField = ({ label, ...inputProps }) => {
  const theme = useTheme();
  
  return (
    <View style={{ marginBottom: theme.spacingStyle(4) }}>
      <Text style={[
        theme.fontStyle('label'),
        {
          color: theme.colorStyle('sabo.text.300'),
          marginBottom: theme.spacingStyle(1.5),
        }
      ]}>
        {label}
      </Text>
      <TextInput
        style={[
          theme.fontStyle('body'),
          {
            backgroundColor: theme.colorStyle('sabo.background.700'),
            borderColor: theme.colorStyle('sabo.border.default'),
            borderWidth: 1,
            borderRadius: 8,
            padding: theme.spacingStyle(3),
            color: theme.colorStyle('sabo.text.100'),
          }
        ]}
        {...inputProps}
      />
    </View>
  );
};
```

## Common Patterns & Tips

### 1. Conditional Styling with Themes
```tsx
const theme = useTheme();

// Dynamic colors based on state
const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return theme.colorStyle('sabo.success.500');
    case 'error': return theme.colorStyle('sabo.error.500');
    case 'warning': return theme.colorStyle('sabo.warning.500');
    default: return theme.colorStyle('sabo.text.400');
  }
};
```

### 2. Responsive Spacing
```tsx
// Use consistent spacing scale
const spacingPresets = {
  xs: theme.spacingStyle(1),   // 4px
  sm: theme.spacingStyle(2),   // 8px
  md: theme.spacingStyle(4),   // 16px
  lg: theme.spacingStyle(6),   // 24px
  xl: theme.spacingStyle(8),   // 32px
};
```

### 3. Typography Combinations
```tsx
// Combine font styles with custom properties
<Text style={[
  theme.fontStyle('body'),
  {
    textAlign: 'center',
    color: theme.colorStyle('sabo.text.300'),
    marginTop: theme.spacingStyle(2),
  }
]}>
  Additional text
</Text>
```

## Migration Checklist

### Pre-Migration
- [ ] ThemeProvider is wrapped around your app
- [ ] Import `useTheme` hook in component
- [ ] Identify all hardcoded values in component

### During Migration
- [ ] Replace hardcoded font sizes with typography presets
- [ ] Replace hardcoded colors with color paths
- [ ] Replace random spacing with spacing scale
- [ ] Test component rendering
- [ ] Verify colors in light/dark modes (if applicable)

### Post-Migration
- [ ] Remove old hardcoded style objects
- [ ] Clean up unused imports
- [ ] Test component responsiveness
- [ ] Update component documentation

## Performance Tips

1. **Memoize theme styles** for complex components:
```tsx
const styles = useMemo(() => ({
  container: {
    backgroundColor: theme.colorStyle('sabo.background.800'),
    padding: theme.spacingStyle(4),
  }
}), [theme]);
```

2. **Extract reusable style functions**:
```tsx
const createCardStyles = (theme: Theme) => ({
  card: {
    backgroundColor: theme.colorStyle('sabo.background.800'),
    padding: theme.spacingStyle(4),
    borderRadius: 12,
  }
});
```

## Priority Migration Order

1. **High Impact Components** (seen by all users):
   - Headers & Navigation
   - Buttons & CTAs
   - Cards & Lists

2. **Medium Impact Components**:
   - Forms & Inputs
   - Modals & Dialogs
   - Tabs & Navigation

3. **Low Impact Components**:
   - Settings screens
   - Profile pages
   - Admin interfaces

## Getting Help

- **Design Token Reference**: Check `/packages/design-tokens/src/` files
- **Color Reference**: Check `/constants/colors.ts`
- **Migration Examples**: Check `/examples/` directory
- **Component Library**: Check `/components/shared/` for standardized components

---

*This migration guide is based on the comprehensive visual design audit findings. Following this guide will ensure consistent visual design across the entire application.*