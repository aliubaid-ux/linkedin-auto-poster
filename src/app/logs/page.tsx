"use client";

import { useAppContext } from "@/context/app-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import type { LogEntry } from "@/lib/types";

const statusIcons = {
    success: <CheckCircle className="h-4 w-4 text-green-500" />,
    partial: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    failed: <XCircle className="h-4 w-4 text-destructive" />,
}

const statusColors: { [key in LogEntry['status']]: 'default' | 'secondary' | 'destructive' } = {
    success: 'default',
    partial: 'secondary',
    failed: 'destructive',
}

export default function LogsPage() {
    const { logs } = useAppContext();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold">Automation Logs</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Cron Job History</CardTitle>
                    <CardDescription>A log of all automated post generation and publishing runs.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Run ID</TableHead>
                                <TableHead>Generated</TableHead>
                                <TableHead>Posted</TableHead>
                                <TableHead>Errors</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <Badge variant={statusColors[log.status]} className="capitalize flex items-center gap-2">
                                            {statusIcons[log.status]}
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                    <TableCell className="font-mono text-xs">{log.runId}</TableCell>
                                    <TableCell>{log.generatedCount}</TableCell>
                                    <TableCell>{log.postedCount}</TableCell>
                                    <TableCell className="text-destructive text-xs">{log.errors.join(', ')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {logs.length === 0 && (
                        <div className="text-center p-8 text-muted-foreground">
                            No logs found. Automated jobs have not run yet.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
