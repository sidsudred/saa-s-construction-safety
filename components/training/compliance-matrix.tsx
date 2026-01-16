"use client"

import { CertificationRecord, InductionRecord } from "@/lib/types/safety-record"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, AlertTriangle, XCircle, TrendingUp, Users, Award } from "lucide-react"
import { useMemo } from "react"

interface ComplianceMatrixProps {
    certifications: CertificationRecord[]
    inductions: InductionRecord[]
}

export function ComplianceMatrix({ certifications, inductions }: ComplianceMatrixProps) {
    const metrics = useMemo(() => {
        const now = new Date()

        // Certification metrics
        const totalCerts = certifications.length
        const activeCerts = certifications.filter(c => {
            if (!c.expiryDate) return true // No expiry = always active
            const expiry = new Date(c.expiryDate)
            return expiry > now
        }).length

        const expiringSoon = certifications.filter(c => {
            if (!c.expiryDate) return false
            const expiry = new Date(c.expiryDate)
            const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            return daysUntilExpiry > 0 && daysUntilExpiry <= 30
        }).length

        const expired = certifications.filter(c => {
            if (!c.expiryDate) return false
            const expiry = new Date(c.expiryDate)
            return expiry < now
        }).length

        const revoked = certifications.filter(c => c.status === "revoked").length

        // Induction metrics
        const totalInductions = inductions.length
        const completedInductions = inductions.filter(i =>
            i.status === "verified" || i.status === "completed"
        ).length

        const complianceRate = totalCerts > 0 ? Math.round((activeCerts / totalCerts) * 100) : 0
        const inductionRate = totalInductions > 0 ? Math.round((completedInductions / totalInductions) * 100) : 0

        // Overall compliance index (weighted average)
        const overallCompliance = Math.round((complianceRate * 0.6) + (inductionRate * 0.4))

        return {
            totalCerts,
            activeCerts,
            expiringSoon,
            expired,
            revoked,
            complianceRate,
            totalInductions,
            completedInductions,
            inductionRate,
            overallCompliance
        }
    }, [certifications, inductions])

    const getComplianceColor = (rate: number) => {
        if (rate >= 90) return "text-green-600"
        if (rate >= 70) return "text-amber-600"
        return "text-red-600"
    }

    const getComplianceStatus = (rate: number) => {
        if (rate >= 90) return { label: "Excellent", color: "bg-green-500" }
        if (rate >= 70) return { label: "Good", color: "bg-amber-500" }
        return { label: "Needs Attention", color: "bg-red-500" }
    }

    const status = getComplianceStatus(metrics.overallCompliance)

    return (
        <div className="space-y-6">
            {/* Overall Compliance Score */}
            <Card className="border-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Overall Compliance Index</CardTitle>
                            <CardDescription>Aggregated safety maturity score</CardDescription>
                        </div>
                        <Badge className={`${status.color} text-white text-sm px-4 py-2`}>
                            {status.label}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className={`text-6xl font-bold ${getComplianceColor(metrics.overallCompliance)}`}>
                                    {metrics.overallCompliance}%
                                </span>
                                <TrendingUp className="h-8 w-8 text-green-500" />
                            </div>
                            <Progress value={metrics.overallCompliance} className="h-3" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Certification Compliance */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Award className="h-4 w-4 text-indigo-600" />
                            Certification Compliance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-2">{metrics.complianceRate}%</div>
                        <Progress value={metrics.complianceRate} className="mb-3 h-2" />
                        <div className="text-sm text-muted-foreground">
                            {metrics.activeCerts} of {metrics.totalCerts} active
                        </div>
                    </CardContent>
                </Card>

                {/* Induction Completion */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-indigo-600" />
                            Induction Completion
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-2">{metrics.inductionRate}%</div>
                        <Progress value={metrics.inductionRate} className="mb-3 h-2" />
                        <div className="text-sm text-muted-foreground">
                            {metrics.completedInductions} of {metrics.totalInductions} completed
                        </div>
                    </CardContent>
                </Card>

                {/* Expiring Soon */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            Expiring Soon
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-600 mb-2">{metrics.expiringSoon}</div>
                        <div className="text-sm text-muted-foreground">
                            Certifications expiring within 30 days
                        </div>
                    </CardContent>
                </Card>

                {/* Expired */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            Expired
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600 mb-2">{metrics.expired}</div>
                        <div className="text-sm text-muted-foreground">
                            Certifications past expiry date
                        </div>
                    </CardContent>
                </Card>

                {/* Revoked */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                            Revoked
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-2">{metrics.revoked}</div>
                        <div className="text-sm text-muted-foreground">
                            Certifications revoked
                        </div>
                    </CardContent>
                </Card>

                {/* Active Certifications */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                            Active & Valid
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600 mb-2">{metrics.activeCerts}</div>
                        <div className="text-sm text-muted-foreground">
                            Currently valid certifications
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recommendations */}
            {(metrics.expired > 0 || metrics.expiringSoon > 0) && (
                <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                            Action Required
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {metrics.expired > 0 && (
                            <p className="text-sm">
                                • <strong>{metrics.expired}</strong> certification{metrics.expired > 1 ? 's have' : ' has'} expired and require immediate renewal
                            </p>
                        )}
                        {metrics.expiringSoon > 0 && (
                            <p className="text-sm">
                                • <strong>{metrics.expiringSoon}</strong> certification{metrics.expiringSoon > 1 ? 's are' : ' is'} expiring within 30 days
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
