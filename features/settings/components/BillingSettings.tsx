"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Crown, Check, Calendar, Download, ArrowUpRight } from "lucide-react";

export function BillingSettings() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Current Plan */}
      <Card className="lg:col-span-1 rounded-2xl border-border bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Pro Plan</CardTitle>
                <CardDescription>Billed monthly</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="rounded-lg  text-primary border-0">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-3xl font-bold tracking-tight">
              $29<span className="text-lg font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">Next billing: March 15, 2026</p>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Forms</span>
                <span className="font-medium">12 / 50</span>
              </div>
              <Progress value={24} className="h-2 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Submissions</span>
                <span className="font-medium">2.4K / 10K</span>
              </div>
              <Progress value={24} className="h-2 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">1.2GB / 5GB</span>
              </div>
              <Progress value={24} className="h-2 rounded-full" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="rounded-xl flex-1">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
            <Button variant="outline" className="rounded-xl">
              <Calendar className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="lg:col-span-2 rounded-2xl border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Payment Methods</CardTitle>
                <CardDescription>Manage your payment options.</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">
              Add Card
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              type: "Visa",
              last4: "4242",
              expiry: "12/27",
              isDefault: true,
            },
            {
              type: "Mastercard",
              last4: "8888",
              expiry: "09/26",
              isDefault: false,
            },
          ].map((card, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {card.type}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">
                      {card.type} ending in {card.last4}
                    </p>
                    {card.isDefault && (
                      <Badge variant="secondary" className="rounded-lg text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Expires {card.expiry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!card.isDefault && (
                  <Button variant="ghost" size="sm" className="rounded-xl text-xs h-8">
                    Set Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/5"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="lg:col-span-3 rounded-2xl border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Billing History</CardTitle>
                <CardDescription>View and download your past invoices.</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_120px_120px_100px] gap-4 px-6 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <span>Invoice</span>
              <span className="text-center">Date</span>
              <span className="text-center">Amount</span>
              <span className="text-right">Action</span>
            </div>
            <Separator />
            {/* Table Rows */}
            {[
              { id: "INV-2026-002", date: "Feb 15, 2026", amount: "$29.00", status: "Paid" },
              { id: "INV-2026-001", date: "Jan 15, 2026", amount: "$29.00", status: "Paid" },
              { id: "INV-2025-012", date: "Dec 15, 2025", amount: "$29.00", status: "Paid" },
              { id: "INV-2025-011", date: "Nov 15, 2025", amount: "$29.00", status: "Paid" },
              { id: "INV-2025-010", date: "Oct 15, 2025", amount: "$29.00", status: "Paid" },
            ].map((invoice, index) => (
              <div key={invoice.id}>
                <div className="grid grid-cols-[1fr_120px_120px_100px] gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Check className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">{invoice.id}</span>
                  </div>
                  <span className="text-sm text-muted-foreground text-center">{invoice.date}</span>
                  <span className="text-sm font-medium text-center">{invoice.amount}</span>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" className="rounded-xl h-8 w-8 p-0">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {index < 4 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
