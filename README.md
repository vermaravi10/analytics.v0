# PagePilot Analytics Dashboard

A comprehensive, responsive analytics dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Interactive Date Range Picker**: Preset ranges (7/30/90 days) and custom date selection
- **KPI Cards**: Total Users, Active Users, Sessions, and Conversion Rate with delta indicators
- **Interactive Charts**: 
  - Line chart for Daily Active Users over time
  - Bar chart for Sessions by traffic source
- **Sortable Data Table**: Top pages with sortable columns (Views, Avg. Time, Bounce Rate)
- **Loading States**: Skeleton screens during data loading
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Dark Mode Support**: Automatic theme switching

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone or download the project
2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx          # Main dashboard component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/ui/        # shadcn/ui components
├── data/
│   └── analytics.json    # Mock analytics data
├── lib/
│   └── utils.ts          # Utility functions
└── README.md
\`\`\`

## Data Structure

The dashboard uses mock data with the following structure:

- **KPIs**: Total users, active users, sessions, conversion rate with deltas
- **Time Series**: Daily active users over time
- **Traffic Sources**: Sessions breakdown by source (Direct, Organic, Paid, etc.)
- **Top Pages**: Page views, average time, and bounce rates

## Customization

### Adding New Metrics

1. Update the mock data structure in `app/page.tsx`
2. Add new KPI cards using the `KPICard` component
3. Create additional charts using Recharts components

### Styling

The dashboard uses Tailwind CSS with a custom design system. Colors and spacing can be customized in `app/globals.css`.

### Data Integration

Replace the mock data with real API calls by:

1. Creating API routes in `app/api/`
2. Using React Query or SWR for data fetching
3. Updating the data filtering logic

## Performance Features

- **Client-side filtering**: Fast date range filtering without API calls
- **Memoized calculations**: Optimized sorting and data processing
- **Responsive charts**: Automatically resize based on container
- **Loading states**: Skeleton screens for better UX

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use this project for personal or commercial purposes.
