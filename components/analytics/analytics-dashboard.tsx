"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  ClipboardCheck,
  Users,
  Calendar,
  Download,
} from "lucide-react"
import Link from "next/link"

export function AnalyticsDashboard() {
  const [selectedProject, setSelectedProject] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("30d")
  const [selectedContractor, setSelectedContractor] = useState("all")

  const handleExportReport = () => {
    console.log("[v0] Exporting report with filters:", {
      project: selectedProject,
      dateRange: selectedDateRange,
      contractor: selectedContractor,
    })
    alert(
      `Exporting analytics report for:\n- Project: ${selectedProject}\n- Date Range: ${selectedDateRange}\n- Contractor: ${selectedContractor}`,
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Safety Analytics</h1>
          <p className="text-muted-foreground">Comprehensive safety performance metrics and insights</p>
        </div>
        <Button variant="outline" onClick={handleExportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Project</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="metro">Metro Station Construction</SelectItem>
                  <SelectItem value="tower">Commercial Tower Build</SelectItem>
                  <SelectItem value="bridge">Highway Bridge Project</SelectItem>
                  <SelectItem value="residential">Residential Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="12m">Last 12 Months</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Contractor</label>
              <Select value={selectedContractor} onValueChange={setSelectedContractor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contractors</SelectItem>
                  <SelectItem value="acme">ACME Construction</SelectItem>
                  <SelectItem value="builder">Builder Corp</SelectItem>
                  <SelectItem value="construct">Construct Pro</SelectItem>
                  <SelectItem value="safety">SafetyFirst Inc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leading Indicators */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Leading Indicators</h2>
        <p className="text-sm text-muted-foreground mb-4">Proactive metrics that predict and prevent incidents</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/observations">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Safety Observations</CardTitle>
                <Eye className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 text-chart-3" />
                  <span className="text-chart-3">+12% from last period</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">287 positive, 55 negative</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/jsa">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">JSAs Completed</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 text-chart-3" />
                  <span className="text-chart-3">+8% from last period</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">98% completion rate</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/training">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Training Sessions</CardTitle>
                <Users className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 text-chart-3" />
                  <span className="text-chart-3">+15% from last period</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">458 workers trained</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/inspections">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inspections</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 text-chart-3" />
                  <span className="text-chart-3">+5% from last period</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">92% pass rate</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Lagging Indicators */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Lagging Indicators</h2>
        <p className="text-sm text-muted-foreground mb-4">Reactive metrics that measure incidents after they occur</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/incidents">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <TrendingDown className="h-3 w-3 text-chart-3" />
                  <span className="text-chart-3">-18% from last period</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">2 serious, 26 minor</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/incidents?type=injury">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lost Time Injuries</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <TrendingDown className="h-3 w-3 text-chart-3" />
                  <span className="text-chart-3">-25% from last period</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">LTIFR: 0.42</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/incidents?type=near_miss">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Near Misses</CardTitle>
                <AlertTriangle className="h-4 w-4 text-chart-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <TrendingDown className="h-3 w-3 text-chart-3" />
                  <span className="text-chart-3">-12% from last period</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">All investigated</p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Without LTI</CardTitle>
              <Calendar className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 text-chart-3" />
                <span className="text-chart-3">Current streak</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Target: 90 days</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Open Actions Summary */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Open Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/capa?status=open&priority=high">
            <Card className="hover:border-destructive transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <Clock className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">12</div>
                <p className="text-xs text-muted-foreground mt-2">Requires immediate attention</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/capa?status=open">
            <Card className="hover:border-chart-4 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
                <Clock className="h-4 w-4 text-chart-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-4">23</div>
                <p className="text-xs text-muted-foreground mt-2">Monitor progress closely</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/capa?status=completed">
            <Card className="hover:border-chart-3 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-3">87</div>
                <p className="text-xs text-muted-foreground mt-2">94% on-time completion</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Incident Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Trend</CardTitle>
            <CardDescription>Monthly incident count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incidentTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  name="Total Incidents"
                />
                <Line
                  type="monotone"
                  dataKey="nearMiss"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  name="Near Misses"
                />
                <Line type="monotone" dataKey="injuries" stroke="hsl(var(--chart-5))" strokeWidth={2} name="Injuries" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Safety Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Safety Activities</CardTitle>
            <CardDescription>Leading indicator activities by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={safetyActivitiesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="observations" fill="hsl(var(--chart-1))" name="Observations" />
                <Bar dataKey="inspections" fill="hsl(var(--chart-2))" name="Inspections" />
                <Bar dataKey="trainings" fill="hsl(var(--chart-3))" name="Training Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Incident Types */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Distribution</CardTitle>
            <CardDescription>Breakdown by incident type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incidentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incidentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CAPA Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle>CAPA Completion Rate</CardTitle>
            <CardDescription>Monthly action closure performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={capaCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="opened" fill="hsl(var(--chart-4))" name="Opened" />
                <Bar dataKey="completed" fill="hsl(var(--chart-3))" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Mock data
const incidentTrendData = [
  { month: "Jul", incidents: 32, nearMiss: 18, injuries: 5 },
  { month: "Aug", incidents: 28, nearMiss: 15, injuries: 4 },
  { month: "Sep", incidents: 24, nearMiss: 14, injuries: 3 },
  { month: "Oct", incidents: 30, nearMiss: 19, injuries: 4 },
  { month: "Nov", incidents: 22, nearMiss: 12, injuries: 3 },
  { month: "Dec", incidents: 28, nearMiss: 18, injuries: 3 },
]

const safetyActivitiesData = [
  { month: "Jul", observations: 280, inspections: 72, trainings: 18 },
  { month: "Aug", observations: 295, inspections: 78, trainings: 22 },
  { month: "Sep", observations: 310, inspections: 81, trainings: 20 },
  { month: "Oct", observations: 298, inspections: 85, trainings: 19 },
  { month: "Nov", observations: 325, inspections: 88, trainings: 24 },
  { month: "Dec", observations: 342, inspections: 89, trainings: 24 },
]

const incidentTypeData = [
  { name: "Near Miss", value: 18, color: "hsl(var(--chart-4))" },
  { name: "Minor Injury", value: 7, color: "hsl(var(--chart-1))" },
  { name: "Equipment", value: 5, color: "hsl(var(--chart-2))" },
  { name: "Falls", value: 4, color: "hsl(var(--destructive))" },
  { name: "Property", value: 3, color: "hsl(var(--chart-3))" },
  { name: "Other", value: 3, color: "hsl(var(--muted))" },
]

const capaCompletionData = [
  { month: "Jul", opened: 45, completed: 38 },
  { month: "Aug", opened: 52, completed: 48 },
  { month: "Sep", opened: 48, completed: 45 },
  { month: "Oct", opened: 56, completed: 51 },
  { month: "Nov", opened: 49, completed: 47 },
  { month: "Dec", opened: 42, completed: 39 },
]
