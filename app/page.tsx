"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  UsersIcon,
  MousePointerClickIcon,
  PercentIcon,
} from "lucide-react"
import { format, subDays, isWithinInterval, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

// Mock data
const mockData = {
  range: "2025-01-01..2025-01-30",
  kpis: {
    totalUsers: 12450,
    activeUsers: 3120,
    sessions: 18900,
    conversion: 3.7,
    deltas: {
      totalUsers: 5.1,
      activeUsers: -1.2,
      sessions: 2.3,
      conversion: 0.4,
    },
  },
  timeseries: [
    { date: "2025-01-01", dau: 320 },
    { date: "2025-01-02", dau: 305 },
    { date: "2025-01-03", dau: 285 },
    { date: "2025-01-04", dau: 310 },
    { date: "2025-01-05", dau: 295 },
    { date: "2025-01-06", dau: 340 },
    { date: "2025-01-07", dau: 355 },
    { date: "2025-01-08", dau: 330 },
    { date: "2025-01-09", dau: 315 },
    { date: "2025-01-10", dau: 325 },
    { date: "2025-01-11", dau: 345 },
    { date: "2025-01-12", dau: 360 },
    { date: "2025-01-13", dau: 375 },
    { date: "2025-01-14", dau: 350 },
    { date: "2025-01-15", dau: 365 },
    { date: "2025-01-16", dau: 380 },
    { date: "2025-01-17", dau: 395 },
    { date: "2025-01-18", dau: 385 },
    { date: "2025-01-19", dau: 370 },
    { date: "2025-01-20", dau: 390 },
    { date: "2025-01-21", dau: 405 },
    { date: "2025-01-22", dau: 420 },
    { date: "2025-01-23", dau: 410 },
    { date: "2025-01-24", dau: 425 },
    { date: "2025-01-25", dau: 440 },
    { date: "2025-01-26", dau: 435 },
    { date: "2025-01-27", dau: 450 },
    { date: "2025-01-28", dau: 465 },
    { date: "2025-01-29", dau: 455 },
    { date: "2025-01-30", dau: 470 },
  ],
  sources: [
    { name: "Direct", sessions: 5200 },
    { name: "Organic", sessions: 4700 },
    { name: "Paid", sessions: 3600 },
    { name: "Referral", sessions: 2100 },
    { name: "Social", sessions: 1300 },
  ],
  pages: [
    { path: "/", views: 8200, avgTime: 72, bounce: 0.42 },
    { path: "/pricing", views: 3100, avgTime: 51, bounce: 0.48 },
    { path: "/docs", views: 2600, avgTime: 180, bounce: 0.31 },
    { path: "/features", views: 2100, avgTime: 95, bounce: 0.38 },
    { path: "/about", views: 1800, avgTime: 65, bounce: 0.45 },
    { path: "/contact", views: 1200, avgTime: 45, bounce: 0.52 },
  ],
}

type DateRange = {
  from: Date
  to: Date
}

type SortField = "views" | "avgTime" | "bounce"
type SortDirection = "asc" | "desc"

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>("views")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [isLoading, setIsLoading] = useState(false)

  // Filter and process data based on date range
  const filteredData = useMemo(() => {
    const filtered = mockData.timeseries.filter((item) => {
      const itemDate = parseISO(item.date)
      return isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to })
    })

    return {
      ...mockData,
      timeseries: filtered,
    }
  }, [dateRange])

  // Sort pages data
  const sortedPages = useMemo(() => {
    return [...mockData.pages].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [sortField, sortDirection])

  const handleDateRangeSelect = (preset: string) => {
    setIsLoading(true)
    const today = new Date()

    switch (preset) {
      case "7":
        setDateRange({ from: subDays(today, 7), to: today })
        break
      case "30":
        setDateRange({ from: subDays(today, 30), to: today })
        break
      case "90":
        setDateRange({ from: subDays(today, 90), to: today })
        break
    }

    // Simulate loading
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(1)}%`
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const DeltaIndicator = ({ value }: { value: number }) => {
    const isPositive = value > 0
    const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon

    return (
      <div
        className={cn("flex items-center gap-1 text-sm font-medium", isPositive ? "text-green-600" : "text-red-600")}
      >
        <Icon className="h-3 w-3" />
        {Math.abs(value)}%
      </div>
    )
  }

  const KPICard = ({
    title,
    value,
    delta,
    icon: Icon,
    formatter = formatNumber,
  }: {
    title: string
    value: number
    delta: number
    icon: any
    formatter?: (value: number) => string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatter(value)}</div>
        <div className="flex items-center justify-between mt-2">
          <DeltaIndicator value={delta} />
          <p className="text-xs text-muted-foreground">vs previous period</p>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header skeleton */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          </div>

          {/* KPI cards skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">PagePilot Analytics</h1>
            <p className="text-muted-foreground">
              {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
            </p>
          </div>

          <div className="flex gap-2">
            <Select onValueChange={handleDateRangeSelect}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-auto bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Custom
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to })
                      setIsCalendarOpen(false)
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Users"
            value={filteredData.kpis.totalUsers}
            delta={filteredData.kpis.deltas.totalUsers}
            icon={UsersIcon}
          />
          <KPICard
            title="Active Users"
            value={filteredData.kpis.activeUsers}
            delta={filteredData.kpis.deltas.activeUsers}
            icon={TrendingUpIcon}
          />
          <KPICard
            title="Sessions"
            value={filteredData.kpis.sessions}
            delta={filteredData.kpis.deltas.sessions}
            icon={MousePointerClickIcon}
          />
          <KPICard
            title="Conversion Rate"
            value={filteredData.kpis.conversion}
            delta={filteredData.kpis.deltas.conversion}
            icon={PercentIcon}
            formatter={(value) => `${value}%`}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Daily Active Users</CardTitle>
              <CardDescription>User activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData.timeseries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => format(parseISO(value), "MMM dd")} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => format(parseISO(value as string), "MMM dd, yyyy")}
                    formatter={(value) => [formatNumber(value as number), "Daily Active Users"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="dau"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    name="Daily Active Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions by Source</CardTitle>
              <CardDescription>Traffic sources breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData.sources}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatNumber(value as number), "Sessions"]} />
                  <Legend />
                  <Bar dataKey="sessions" fill="hsl(var(--chart-2))" name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Pages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("views")}>
                    <div className="flex items-center gap-1">
                      Views
                      {sortField === "views" &&
                        (sortDirection === "desc" ? (
                          <ArrowDownIcon className="h-3 w-3" />
                        ) : (
                          <ArrowUpIcon className="h-3 w-3" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("avgTime")}>
                    <div className="flex items-center gap-1">
                      Avg. Time
                      {sortField === "avgTime" &&
                        (sortDirection === "desc" ? (
                          <ArrowDownIcon className="h-3 w-3" />
                        ) : (
                          <ArrowUpIcon className="h-3 w-3" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("bounce")}>
                    <div className="flex items-center gap-1">
                      Bounce Rate
                      {sortField === "bounce" &&
                        (sortDirection === "desc" ? (
                          <ArrowDownIcon className="h-3 w-3" />
                        ) : (
                          <ArrowUpIcon className="h-3 w-3" />
                        ))}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPages.map((page, index) => (
                  <TableRow key={page.path}>
                    <TableCell className="font-medium">
                      <code className="text-sm bg-muted px-1 py-0.5 rounded">{page.path}</code>
                    </TableCell>
                    <TableCell>{formatNumber(page.views)}</TableCell>
                    <TableCell>{formatTime(page.avgTime)}</TableCell>
                    <TableCell>
                      <Badge variant={page.bounce > 0.5 ? "destructive" : page.bounce > 0.4 ? "secondary" : "default"}>
                        {formatPercentage(page.bounce)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
