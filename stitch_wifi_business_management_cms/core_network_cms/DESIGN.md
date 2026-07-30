---
name: Core Network CMS
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#464555'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  sidebar-width: 260px
  container-max: 1440px
---

## Brand & Style

This design system is built for high-utility ISP management, prioritizing clarity, speed of data retrieval, and a sense of reliability. The aesthetic follows a **Modern SaaS** direction: a blend of high-end minimalism with functional density. 

The personality is professional and authoritative yet accessible, reducing the cognitive load for administrators managing complex billing and networking tasks. The UI utilizes expansive whitespace, a restrained color palette, and subtle depth to organize information into a clear visual hierarchy. It avoids unnecessary decoration, focusing instead on structural integrity and status visibility.

## Colors

The palette is anchored by a high-performance **Indigo Primary**, used for key actions and active states. The background is a cool-toned **Off-White (#F8FAFC)**, providing a soft canvas that reduces eye strain during long working hours.

**Semantic Colors** are non-negotiable for status tracking:
- **Success:** Active subscriptions and paid invoices.
- **Warning:** Overdue accounts or "Due Soon" notices.
- **Danger:** Disconnected services or unpaid balances.
- **Info:** System notifications or pending technician deployments.

Use **Dark Slate (#1E293B)** for all primary text to ensure maximum contrast and legibility, with **Slate (#64748B)** reserved for secondary metadata.

## Typography

The design system utilizes **Inter** for its exceptional readability in data-heavy environments. The hierarchy is strictly enforced through weight and color rather than excessive size shifts.

- **Headlines:** Use SemiBold (600) or Bold (700) with slight negative letter spacing for a compact, professional look.
- **Body:** Standardized at 14px for data tables and 16px for general content to balance density and accessibility.
- **Labels:** Uppercase labels with increased letter spacing should be used for section headers in the sidebar and table headers to differentiate from interactive data.

## Layout & Spacing

The system follows an **8px linear scale**. All margins, paddings, and component heights must be multiples of 8.

- **Grid:** A 12-column fluid grid for the main content area with 24px gutters.
- **Sidebar:** A fixed 260px left-hand sidebar. On mobile, this transitions to a hidden drawer.
- **Mobile Patterns:** Use a bottom navigation bar for the four primary actions (Dashboard, Customers, Billing, Profile) to ensure thumb-reachability, while secondary links remain in the hamburger drawer.
- **Margins:** Page containers use 24px padding on desktop, reducing to 16px on mobile devices.

## Elevation & Depth

Depth is used sparingly to define functional containers. The system avoids heavy drop shadows in favor of **Tonal Layering** and soft, ambient shadows.

- **Level 0 (Background):** #F8FAFC - The base canvas.
- **Level 1 (Cards/Sidebar):** #FFFFFF - Primary content containers. These use a 1px border (#E2E8F0) and a very soft shadow (Y: 1px, Blur: 3px, Opacity: 0.05).
- **Level 2 (Overlays/Dropdowns):** #FFFFFF - Used for menus and modals. These feature a more pronounced shadow (Y: 4px, Blur: 12px, Opacity: 0.1) to clearly separate from the card layer below.

Interactive elements (buttons) do not use shadows except for the "Primary Action" button, which may have a subtle indigo-tinted shadow on hover to indicate clickability.

## Shapes

The design system utilizes a **Rounded (Level 2)** shape language to soften the industrial nature of a CMS.

- **Small Elements (Inputs, Buttons):** 8px (0.5rem) radius.
- **Medium Elements (Cards, Modals):** 12px-16px (0.75rem-1rem) radius.
- **Status Badges:** Fully pill-shaped (999px) to distinguish them from interactive buttons.

This consistent rounding creates a modern, friendly environment that feels contemporary and approachable.

## Components

### Sidebar & Navigation
- **Active State:** The active link uses a subtle background tint of the primary color (indigo at 10% opacity) and a 3px vertical "pill" indicator on the left edge.
- **Icons:** Use 20px stroke-based icons with a medium weight.

### Data Tables
- **Header:** Light gray background (#F1F5F9) or white with a distinct bottom border. Use `label-md` typography.
- **Rows:** Minimum height of 56px to ensure touch-targets and readability.
- **Status Badges:** Use semantic colors with 10% opacity backgrounds and 100% opacity text for the "Subtle Badge" look.

### Summary Cards
- **Layout:** Icon on the left (contained in a circle or soft-square background) with the metric and label stacked on the right.
- **Interaction:** Cards are non-interactive unless they link to a filtered view, in which case a hover state of `border-color: #4F46E5` is applied.

### Forms & Inputs
- **Inputs:** White background, 1px #E2E8F0 border.
- **Focus State:** 1px indigo border with a 3px indigo "halo" at 20% opacity.
- **Labels:** Always positioned above the input field using `body-sm` Bold.

### Buttons
- **Primary:** Solid indigo background, white text.
- **Secondary:** White background, #E2E8F0 border, slate text.
- **Ghost:** No border or background, indigo text; used for "Cancel" or "Go Back" actions.