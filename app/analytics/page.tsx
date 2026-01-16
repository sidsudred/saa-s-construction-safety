"use client"

import { useSafetyRecordStore } from "@/lib/stores/record-store"
import { AnalyticsFilters } from "@/components/analytics/analytics-filters"
import { IndicatorTile } from "@/components/analytics/indicator-tile"
import {
  BarChart3,
  Eye,
  ShieldCheck,
  Zap,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Construction,
  TrendingUp,
  Activity,
  ArrowUpRight
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
  const { records } = useSafetyRecordStore()

  const stats = useMemo(() => {
    const totalObservations = records.filter(r => r.type === "observation").length
    const positiveObservations = records.filter(r => (r as any).observationType === "positive").length
    const positiveRatio = totalObservations > 0 ? Math.round((positiveObservations / totalObservations) * 100) : 0

    const totalIncidents = records.filter(r => r.type === "incident").length
    const highSeverityIncidents = records.filter(r => r.type === "incident" && (r.priority === "high" || r.priority === "critical")).length

    const totalActions = records.filter(r => r.type === "capa").length
    const openActions = records.filter(r => r.type === "capa" && r.status === "open").length
    const overdueActions = openActions // Mock logic for demo

    const activePermits = records.filter(r => r.type === "permit" && r.status === "approved").length

    return {
      totalObservations,
      positiveRatio,
      totalIncidents,
      highSeverityIncidents,
      openActions,
      overdueActions,
      activePermits,
      ltiFrequency: 0.85, // Mocked
      triFrequency: 2.14,  // Mocked
    }
  }, [records])

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
            <TrendingUp className="h-4 w-4" />
            Intelligence Dashboard
          </div>
          <h1 className="text-3xl font-black tracking-tight font-display">Safety Analytics</h1>
          <p className="text-muted-foreground text-sm font-medium">Real-time indicators and performance trends across all projects.</p>
        </div>
      </div>

      <AnalyticsFilters />

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-600 font-bold uppercase tracking-widest text-[10px] py-1 px-3">Leading Indicators</Badge>
          <div className="h-px bg-border/60 flex-1" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Proactive Metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <IndicatorTile
            label="Reporting Rate"
            value={stats.totalObservations}
            unit="Observations"
            trend={12}
            target={50}
            icon={Eye}
            color="indigo"
            href="/observations"
          />
          <IndicatorTile
            label="Positive Ratio"
            value={stats.positiveRatio}
            unit="%"
            trend={5}
            target="80%"
            icon={CheckCircle2}
            color="emerald"
            href="/observations"
          />
          <IndicatorTile
            label="Active Permits"
            value={stats.activePermits}
            unit="Active"
            trend={0}
            target={10}
            icon={ShieldCheck}
            color="indigo"
            href="/permits"
          />
          <IndicatorTile
            label="Average Closure"
            value={3.2}
            unit="Days"
            trend={-8}
            target="4.0"
            icon={Clock}
            color="emerald"
            href="/actions"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Badge className="bg-red-600 font-bold uppercase tracking-widest text-[10px] py-1 px-3">Lagging Indicators</Badge>
          <div className="h-px bg-border/60 flex-1" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Reactive Metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <IndicatorTile
            label="Total Incidents"
            value={stats.totalIncidents}
            unit="MTI/LTI"
            trend={-15}
            target="Zero"
            icon={AlertOctagon}
            color="red"
            href="/incidents"
          />
          <IndicatorTile
            label="High Severity"
            value={stats.highSeverityIncidents}
            unit="Critical"
            trend={20}
            target="Zero"
            icon={Zap}
            color="red"
            href="/incidents"
          />
          <IndicatorTile
            label="LTIFR"
            value={stats.ltiFrequency}
            unit="Index"
            trend={-2}
            target="1.0"
            icon={Activity}
            color="amber"
          />
          <IndicatorTile
            label="Overdue Actions"
            value={stats.overdueActions}
            unit="Pending"
            trend={50}
            target="Zero"
            icon={Construction}
            color="red"
            href="/actions"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Safety Event Distribution</CardTitle>
                <CardDescription>Monthly volume of safety records by category</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 border-indigo-200">Trailing 6 Months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4 pb-8 border-b">
              {[45, 62, 38, 75, 54, 68].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div
                    className="bg-indigo-500/20 group-hover:bg-indigo-500/40 transition-all rounded-t-lg w-full"
                    style={{ height: `${h}%` }}
                  />
                  <div
                    className="bg-indigo-600 rounded-t-lg w-full absolute bottom-0"
                    style={{ height: `${h * 0.4}%` }}
                  />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-10">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-500/40" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Leading Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-600" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Critical Records</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Top Hazard Categories</CardTitle>
            <CardDescription>Based on recent observations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { label: 'Working at Heights', val: 45 },
              { label: 'PPE Non-compliance', val: 28 },
              { label: 'Housekeeping', val: 15 },
              { label: 'Electrical Safety', val: 12 },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{item.label}</span>
                  <span className="text-xs font-black text-indigo-600">{item.val}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.val}%` }} />
                </div>
              </div>
            ))}

            <Button variant="ghost" className="w-full mt-4 text-[10px] font-bold uppercase tracking-widest h-8 gap-2 hover:bg-indigo-50 hover:text-indigo-600">
              Detailed Breakdown
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
