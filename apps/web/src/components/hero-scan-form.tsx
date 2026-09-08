"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroScanForm() {
  const router = useRouter();
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (industry.trim()) params.set("industry", industry.trim());
    if (city.trim()) params.set("city", city.trim());

    window.gtag?.("event", "hero_scan_intent", { city: city.trim(), industry: industry.trim() });

    const query = params.toString();
    router.push(query ? `/onboarding?${query}` : "/onboarding");
  };

  return (
    <form
      className="rounded-[1.5rem] border border-foreground/10 bg-white/85 p-3 shadow-lg shadow-primary/8 backdrop-blur sm:p-4"
      onSubmit={handleSubmit}
    >
      <p className="px-1 pb-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
        Check your market in 2 minutes
      </p>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="hero-industry">
            Your trade or industry
          </label>
          <Input
            id="hero-industry"
            name="industry"
            placeholder="Kitchen remodeling"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            className="h-12 rounded-xl border-foreground/10 bg-white px-4 shadow-sm focus-visible:border-primary"
          />
        </div>
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="hero-city">
            Your city
          </label>
          <Input
            id="hero-city"
            name="city"
            autoComplete="address-level2"
            placeholder="Austin"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="h-12 rounded-xl border-foreground/10 bg-white px-4 shadow-sm focus-visible:border-primary"
          />
        </div>
        <Button className="h-12 shrink-0 rounded-xl px-6 font-extrabold sm:rounded-full" type="submit">
          Check my visibility
          <ArrowRight className="ml-2 size-4" aria-hidden="true" />
        </Button>
      </div>
      <p className="px-1 pt-3 text-xs text-muted-foreground">
        Free scan · no credit card · your report is ready in 1–2 minutes.
      </p>
    </form>
  );
}
