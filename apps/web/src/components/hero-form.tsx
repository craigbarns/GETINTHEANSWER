"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroForm() {
  const [company, setCompany] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company.trim()) {
      router.push(`/onboarding?companyName=${encodeURIComponent(company)}`);
    } else {
      router.push("/onboarding");
    }
  };

  return (
    <div className="mt-9 flex flex-col gap-3 lg:flex-row lg:flex-wrap">
      <form onSubmit={handleSubmit} className="flex flex-1 min-w-fit flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Enter your business name..."
          required
          className="h-14 w-full min-w-[200px] flex-1 rounded-full border-2 border-foreground/15 bg-white/80 px-6 text-base shadow-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
        />
        <Button type="submit" size="lg" className="h-14 shrink-0 rounded-full px-7 text-base shadow-lg shadow-primary/15">
          Start free analysis
          <ArrowRight className="ml-2 size-5" aria-hidden="true" />
        </Button>
      </form>
      <Button asChild size="lg" variant="outline" className="h-14 shrink-0 rounded-full border-foreground/15 bg-white/60 px-7 text-base hidden lg:flex">
        <Link
          href="#demo"
          data-analytics-event="select_content"
          data-analytics-label="hero_sample_report"
        >
          Explore a report
        </Link>
      </Button>
    </div>
  );
}
