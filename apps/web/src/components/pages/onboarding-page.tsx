"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Loader2,
  LockKeyhole,
  ScanSearch,
  Sparkles,
} from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { localePath, type Locale } from "@/lib/i18n";

interface FormData {
  companyName: string;
  websiteUrl: string;
  email: string;
  city: string;
  industry: string;
  services: string;
}

interface OnboardingResponse {
  site_id?: string;
  message?: string;
  details?: { detail?: unknown } | null;
}

type ScanFailure = "limit" | "website" | "invalid" | "busy" | "unavailable";

/** Which failure an error response describes, so the visitor sees the real
 *  reason (and a code they can pass on) instead of a generic "try again". */
function classifyFailure(status: number): ScanFailure {
  if (status === 429) return "limit";
  if (status === 400) return "website";
  if (status === 422) return "invalid";
  if (status === 503) return "busy";
  return "unavailable";
}

const initialFormData: FormData = {
  companyName: "",
  websiteUrl: "",
  email: "",
  city: "",
  industry: "",
  services: "",
};

const COPY = {
  en: {
    homeAria: "GetInTheAnswer, back to home",
    eyebrow: "Your audit starts here",
    title: "See how AI engines rank your business.",
    intro: "A few details are enough to build a set of questions that fits your local market.",
    benefits: ["10 tailored customer questions", "Up to 40 checks across 4 AI engines", "Recommendations ranked by impact"],
    back: "Back to home",
    secure: "Secure connection",
    stepOf: (step: number) => `Step ${step} of 2`,
    scanningEyebrow: "Scan in progress",
    profileEyebrow: "Business profile",
    scanningTitle: "We’re asking the AI engines.",
    profileTitle: "Let’s calibrate your scan.",
    scanningIntro: "Keep this tab open while we test your market and audit your website.",
    profileIntro: "Tell us about your main market so every question is relevant.",
    runningTitle: "Your tailored scan is running",
    runningText: "Most reports are ready in one to two minutes.",
    runningSteps: ["Generating local customer questions", "Comparing answers across the available AI engines", "Auditing your website and ranking the actions"],
    companyName: "Business name",
    companyPlaceholder: "Lakeside Kitchen Co.",
    website: "Main website",
    websitePlaceholder: "yourbusiness.com",
    websiteHelp: "With or without https://",
    city: "Main city",
    cityPlaceholder: "Austin, TX",
    industry: "Trade or industry",
    industryPlaceholder: "Kitchen remodeling",
    services: "Main services",
    optional: "Optional",
    servicesPlaceholder: "Custom cabinets, full remodels, countertops…",
    email: "Work email",
    emailPlaceholder: "you@business.com",
    emailHelp: "Links this scan to your report, and to your payment if you upgrade to Pro.",
    errStep1: "Please enter your business name and website.",
    errStep2: "Please enter your city and your trade.",
    errUrl: "Please check your website address, for example yourbusiness.com.",
    errors: {
      limit: "You’ve reached the free scan limit (3 a day for the same connection, email or website). Please try again tomorrow.",
      website: "We can’t reach this website. Check the address, for example yourbusiness.com.",
      invalid: "Some of the information looks invalid. Please check each field and try again.",
      busy: "Our scanner is busy right now. Please try again in a minute.",
      unavailable: "The scan service is temporarily unavailable. Please try again in a few minutes.",
    } satisfies Record<ScanFailure, string>,
    errCode: (code: string) => `Error code: ${code}`,
    backButton: "Back",
    next: "Next step",
    submit: "Run my free scan",
    privacy: "We use this information to produce and keep your report. We don’t sell your data.",
    privacyLink: "Privacy details",
  },
  fr: {
    homeAria: "GetInTheAnswer, retour à l’accueil",
    eyebrow: "Votre audit commence ici",
    title: "Découvrez comment les moteurs IA situent votre entreprise.",
    intro: "Quelques informations suffisent pour construire un jeu de questions adapté à votre marché local.",
    benefits: ["10 questions clients sur mesure", "Jusqu’à 40 vérifications sur 4 moteurs IA", "Des recommandations classées par impact"],
    back: "Retour à l’accueil",
    secure: "Connexion sécurisée",
    stepOf: (step: number) => `Étape ${step} sur 2`,
    scanningEyebrow: "Analyse en cours",
    profileEyebrow: "Profil de l’entreprise",
    scanningTitle: "Nous interrogeons les IA.",
    profileTitle: "Calibrons votre analyse.",
    scanningIntro: "Gardez cet onglet ouvert pendant que nous testons votre marché et auditons votre site.",
    profileIntro: "Parlez-nous de votre marché principal pour que chaque question soit pertinente.",
    runningTitle: "Analyse personnalisée en cours",
    runningText: "La plupart des rapports sont prêts en une à deux minutes.",
    runningSteps: ["Génération des questions clients locales", "Comparaison des réponses sur les moteurs IA disponibles", "Audit de votre site et classement des actions"],
    companyName: "Nom de l’entreprise",
    companyPlaceholder: "Cuisines du Vieux-Port",
    website: "Site internet principal",
    websitePlaceholder: "mon-entreprise.fr",
    websiteHelp: "Avec ou sans https://",
    city: "Ville principale",
    cityPlaceholder: "Marseille",
    industry: "Métier",
    industryPlaceholder: "Rénovation de cuisine",
    services: "Prestations principales",
    optional: "Facultatif",
    servicesPlaceholder: "Cuisines sur mesure, rénovation complète, agencement…",
    email: "Email professionnel",
    emailPlaceholder: "vous@entreprise.fr",
    emailHelp: "Sert à rattacher cette analyse à votre rapport, et au paiement si vous passez au plan Pro.",
    errStep1: "Merci d’indiquer le nom de votre entreprise et votre site.",
    errStep2: "Merci d’indiquer votre ville et votre métier.",
    errUrl: "Vérifiez l’adresse de votre site, par exemple mon-entreprise.fr.",
    errors: {
      limit: "Vous avez atteint la limite d’analyses gratuites (3 par jour pour une même connexion, une même adresse email ou un même site). Réessayez demain.",
      website: "Nous n’arrivons pas à joindre ce site. Vérifiez l’adresse, par exemple mon-entreprise.fr.",
      invalid: "Certaines informations semblent invalides. Vérifiez chaque champ et réessayez.",
      busy: "Notre service d’analyse est très sollicité. Réessayez dans une minute.",
      unavailable: "Le service d’analyse est momentanément indisponible. Réessayez dans quelques minutes.",
    } satisfies Record<ScanFailure, string>,
    errCode: (code: string) => `Code d’erreur : ${code}`,
    backButton: "Retour",
    next: "Étape suivante",
    submit: "Lancer mon analyse gratuite",
    privacy: "Ces informations servent à produire et conserver votre rapport. Nous ne vendons pas vos données.",
    privacyLink: "Détails de confidentialité",
  },
} satisfies Record<Locale, Record<string, unknown>>;

function normalizeWebsiteUrl(value: string) {
  const candidate = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;

  try {
    return new URL(candidate).toString();
  } catch {
    return null;
  }
}

export function OnboardingPage({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Prefill from the links that lead here: the hero form passes the business
  // name, the industry and city pages pass the trade and the city.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefill: Partial<FormData> = {};
    for (const field of ["companyName", "city", "industry"] as const) {
      const value = params.get(field)?.trim();
      if (value) prefill[field] = value.slice(0, 120);
    }
    if (!Object.keys(prefill).length) return;
    let active = true;
    queueMicrotask(() => {
      if (active) setFormData((current) => ({ ...current, ...prefill }));
    });
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.id as keyof FormData;
    setFormData((current) => ({ ...current, [field]: event.target.value }));
    if (error) setError(null);
  };

  const handleNext = () => {
    if (step === 1 && (!formData.companyName || !formData.websiteUrl)) {
      setError(copy.errStep1);
      return;
    }
    if (step === 2 && (!formData.city || !formData.industry)) {
      setError(copy.errStep2);
      return;
    }
    setError(null);
    setStep((current) => current + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((current) => Math.max(1, current - 1));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }

    setError(null);
    setErrorCode(null);

    const normalizedUrl = normalizeWebsiteUrl(formData.websiteUrl);
    if (!normalizedUrl) {
      window.gtag?.("event", "scan_validation_error", { field: "website_url" });
      setError(copy.errUrl);
      return;
    }

    window.scrollTo({ top: 0 });
    setLoading(true);
    window.gtag?.("event", "scan_started", { city: formData.city, industry: formData.industry, language: locale });

    let response: Response;
    try {
      response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, websiteUrl: normalizedUrl, locale }),
      });
    } catch {
      window.gtag?.("event", "scan_failed", { reason: "network" });
      setError(copy.errors.unavailable);
      setErrorCode("network");
      setLoading(false);
      return;
    }

    // A proxy timeout or crash returns an HTML page, not JSON.
    const data = (await response.json().catch(() => null)) as OnboardingResponse | null;

    if (!response.ok || !data?.site_id) {
      const failure = response.ok ? "unavailable" : classifyFailure(response.status);
      const detail = typeof data?.details?.detail === "string" ? data.details.detail : null;
      if (detail) console.warn("Scan failed:", response.status, detail);
      window.gtag?.("event", "scan_failed", { reason: failure, status_code: response.status });
      setError(copy.errors[failure]);
      setErrorCode(String(response.status));
      setLoading(false);
      return;
    }

    window.gtag?.("event", "generate_lead", { lead_source: "free_ai_visibility_scan" });
    window.gtag?.("event", "scan_completed", { site_id: data.site_id });
    router.push(localePath(locale, `/dashboard?site_id=${encodeURIComponent(data.site_id)}`));
  };

  const inputClass = "h-12 rounded-xl border-foreground/10 bg-white px-4 shadow-sm focus-visible:border-primary";

  return (
    <main id="main-content" className="min-h-screen bg-[#f8f8f3] lg:grid lg:grid-cols-[0.84fr_1.16fr]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#173b35] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="pointer-events-none absolute -left-40 top-16 size-[430px] rounded-full bg-lime-300/12 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-44 -right-24 size-[500px] rounded-full bg-emerald-300/10 blur-3xl" aria-hidden="true" />

        <div className="relative">
          <Link className="inline-flex items-center gap-2.5" href={localePath(locale, "/")} aria-label={copy.homeAria}>
            <LogoMark variant="on-dark" className="size-10" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>

          <div className="mt-20 max-w-lg">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-lime-300">{copy.eyebrow}</p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.02] tracking-[-0.05em] xl:text-6xl">{copy.title}</h1>
            <p className="mt-7 text-lg leading-8 text-white/65">{copy.intro}</p>
          </div>
        </div>

        <div className="relative grid gap-3">
          {copy.benefits.map((benefit) => (
            <div className="flex items-center gap-3 text-sm font-semibold text-white/80" key={benefit}>
              <span className="flex size-6 items-center justify-center rounded-full bg-lime-300 text-[#173b35]">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              {benefit}
            </div>
          ))}
        </div>
      </aside>

      <section className="flex min-h-screen min-w-0 flex-col">
        <header className="flex h-[72px] items-center gap-3 border-b border-foreground/8 px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2 font-extrabold lg:hidden" href={localePath(locale, "/")}>
            <LogoMark className="size-9" />
            <span className="hidden min-[400px]:inline">GetInTheAnswer</span>
          </Link>
          <Link className="hidden items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground lg:flex" href={localePath(locale, "/")}>
            <ArrowLeft className="size-4" aria-hidden="true" /> {copy.back}
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher locale={locale} path="/onboarding" />
            <span className="hidden items-center gap-2 text-xs font-bold text-muted-foreground sm:flex">
              <LockKeyhole className="size-3.5 text-emerald-700" aria-hidden="true" />
              {copy.secure}
            </span>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="w-full max-w-2xl animate-fade-in">
            <div className="mb-8 flex items-center gap-3" aria-label={copy.stepOf(loading ? 2 : 1)}>
              <span className="h-1.5 flex-1 rounded-full bg-primary" />
              <span className={`h-1.5 flex-1 rounded-full ${loading ? "bg-primary" : "bg-foreground/10"}`} />
              <span className="ml-2 text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">{loading ? "2 / 2" : "1 / 2"}</span>
            </div>

            <div className="flex items-start gap-4">
              <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-lime-200 text-primary sm:flex">
                {loading ? <Loader2 className="size-6 animate-spin" aria-hidden="true" /> : <ScanSearch className="size-6" aria-hidden="true" />}
              </span>
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-emerald-700">{loading ? copy.scanningEyebrow : copy.profileEyebrow}</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">{loading ? copy.scanningTitle : copy.profileTitle}</h2>
                <p className="mt-2 text-base leading-7 text-muted-foreground">{loading ? copy.scanningIntro : copy.profileIntro}</p>
              </div>
            </div>

            {loading ? (
              <div className="mt-8 rounded-[1.5rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-8" role="status" aria-live="polite">
                <div className="flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Loader2 className="size-6 animate-spin" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-extrabold">{copy.runningTitle}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy.runningText}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 text-sm font-semibold text-muted-foreground">
                  {copy.runningSteps.map((item) => (
                    <span className="flex items-center gap-3 rounded-xl bg-[#f8f8f3] px-4 py-3" key={item}>
                      <Sparkles className="size-4 shrink-0 text-emerald-700" aria-hidden="true" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                {step === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-sm font-bold">{copy.companyName}</Label>
                      <Input id="companyName" autoComplete="organization" placeholder={copy.companyPlaceholder} value={formData.companyName} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl" className="text-sm font-bold">{copy.website}</Label>
                      <Input id="websiteUrl" autoComplete="url" inputMode="url" placeholder={copy.websitePlaceholder} value={formData.websiteUrl} onChange={handleChange} required aria-describedby="website-help" className={inputClass} />
                      <p id="website-help" className="text-xs text-muted-foreground">{copy.websiteHelp}</p>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="min-w-0 space-y-2">
                        <Label htmlFor="city" className="text-sm font-bold">{copy.city}</Label>
                        <Input id="city" autoComplete="address-level2" placeholder={copy.cityPlaceholder} value={formData.city} onChange={handleChange} required className={inputClass} />
                      </div>
                      <div className="min-w-0 space-y-2">
                        <Label htmlFor="industry" className="text-sm font-bold">{copy.industry}</Label>
                        <Input id="industry" placeholder={copy.industryPlaceholder} value={formData.industry} onChange={handleChange} required className={inputClass} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between gap-3">
                        <Label htmlFor="services" className="text-sm font-bold">{copy.services}</Label>
                        <span className="text-xs font-medium text-muted-foreground">{copy.optional}</span>
                      </div>
                      <Textarea id="services" placeholder={copy.servicesPlaceholder} value={formData.services} onChange={handleChange} className="min-h-24 resize-none rounded-xl border-foreground/10 bg-white px-4 py-3 shadow-sm focus-visible:border-primary" />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-bold">{copy.email}</Label>
                    <Input id="email" type="email" autoComplete="email" inputMode="email" placeholder={copy.emailPlaceholder} value={formData.email} onChange={handleChange} required aria-describedby="email-help" className={inputClass} />
                    <p id="email-help" className="text-xs text-muted-foreground">{copy.emailHelp}</p>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert" aria-live="polite">
                    <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>
                      {error}
                      {errorCode && <span className="mt-1 block text-xs font-medium text-red-800/70">{copy.errCode(errorCode)}</span>}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {step > 1 && (
                    <Button type="button" variant="outline" className="h-14 rounded-xl border-foreground/10 px-6" onClick={handleBack}>
                      {copy.backButton}
                    </Button>
                  )}
                  <Button className="h-14 flex-1 rounded-xl text-base font-extrabold shadow-lg shadow-primary/12" type="submit">
                    {step < 3 ? copy.next : copy.submit} <ArrowRight className="ml-2 size-5" aria-hidden="true" />
                  </Button>
                </div>

                <p className="flex items-center justify-center gap-2 text-center text-xs leading-5 text-muted-foreground">
                  <Sparkles className="size-3.5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span>
                    {copy.privacy}{" "}
                    <Link className="font-bold text-emerald-700 underline" href="/privacy">{copy.privacyLink}</Link>
                  </span>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
