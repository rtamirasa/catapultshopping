"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function ConsumerHome() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border border-border">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              AI
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              AisleIQ
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Consumer</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Web</Badge>
          <Badge>UI kit</Badge>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Storefront shell</CardTitle>
          <CardDescription>
            shadcn/ui components live under{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
              components/ui
            </code>
            . Extend these or add more with{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
              npx shadcn add …
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Separator />
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="demo-email">Email</Label>
              <Input
                id="demo-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-store">Preferred store</Label>
              <Input id="demo-store" placeholder="ZIP or store name" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3">
          <Button type="button">Primary action</Button>
          <Button type="button" variant="outline">
            Secondary
          </Button>
          <Button type="button" variant="ghost">
            Tertiary
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
