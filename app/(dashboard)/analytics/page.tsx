"use client";

import { DashboardHeader } from "@/app/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function AnaliticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100">
      <div className="container mx-auto p-4">
        <DashboardHeader />

        <div className="grid grid-cols-12 gap-6 ">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <DashboardSidebar />
          </div>
          <main className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-400">
                    Software Analitics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    Configure your dashboard analitics here.
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
