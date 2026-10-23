"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CircleAlert,
  FileChartColumnIncreasing,
  Loader2,
  MapPinned,
  MessagesSquare,
  RefreshCcw,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoMark } from "@/components/logo";
import { Price } from "@/components/price";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { localePath, type Locale } from "@/lib/i18n";
import { DONE_FOR_YOU_PRICE } from "@/lib/pricing";

type Plan = "agency" | "done_for_you";

interface FormData {
  fullName: string;
  workEmail: string;
  companyName: string;
  websiteUrl: string;
  locationCount: string;
  message: string;
  companyWebsite: string;
}

interface ContactResponse {
  status?: string;
  message?: string;
}

const initialFormData: FormData = {
  fullName: "",
  workEmail: "",
  companyName: "",
  websiteUrl: "",
  locationCount: "",
  message: "",
  companyWebsite: "",
};

const COPY = {
  en: {
    homeAria: "GetInTheAnswer, back to home",
    back: "Back to home",
    confidential: "Confidential request",
    asideIcons: {
      agency: [
        "City-level visibility and competitor tracking",
        "White-label reports for your clients and teams",
        "A setup built around your portfolio",
      ],
      done_for_you: [
        "We implement your action plan ourselves",
        "Local FAQ page, structured data and listings fixed",
        "Re-scan after 30 days with a before/after score",
      ],
    },
    asideEyebrow: { agency: "Agency & multi-location", done_for_you: "Done-for-you fix" },
    asideTitle: {
      agency: "Make every location visible in AI answers.",
      done_for_you: "Get into the AI answer without lifting a finger.",
    },
    asideText: {
      agency: "Tell us what you manage. We’ll recommend the monitoring setup that fits your locations or client portfolio.",
      done_for_you: "Tell us about your business. We review your site and your report, then confirm the quote before you pay anything.",
    },
    formEyebrow: { agency: "Plan your rollout", done_for_you: "Request the fix" },
    formTitle: { agency: "Tell us about your portfolio.", done_for_you: "Tell us about your business." },
    formIntro: {
      agency: "Share the essentials and we’ll map the best way to monitor your locations.",
      done_for_you: "A few details are enough. If you already ran a free scan, mention it in the message.",
    },
    priceLabel: "one-time",
    fullName: "Your name",
    fullNamePlaceholder: "Jordan Lee",
    email: "Work email",
    emailPlaceholder: "jordan@business.com",
    company: { agency: "Company", done_for_you: "Business name" },
    companyPlaceholder: { agency: "Northstar Agency", done_for_you: "Lakeside Kitchen Co." },
    locations: "Locations managed",
    website: { agency: "Company website", done_for_you: "Business website" },
    websitePlaceholder: "yourbusiness.com",
    optional: "Optional",
    message: { agency: "Goals or context", done_for_you: "Anything we should know?" },
    messagePlaceholder: {
      agency: "Tell us about your locations, your clients, your reporting needs or your timeline…",
      done_for_you: "Your city, your main services, your free scan link, your deadline…",
    },
    honeypot: "Leave this field empty",
    errUrl: "Please check the website address, for example yourbusiness.com.",
    errUrlRequired: "Please enter your website so we can review it.",
    errLocations: "Enter a number of locations between 2 and 10,000.",
    errSend: "We couldn’t send your request right now.",
    errUnexpected: "Something went wrong. Please try again in a moment.",
    sending: "Sending your request…",
    submit: { agency: "Request an agency plan", done_for_you: "Request the done-for-you fix" },
    privacy: "We use these details only to review and respond to your request. We don’t sell your data.",
    privacyLink: "Privacy details",
    received: "Request received",
    thanks: { agency: "Thanks — your agency request is in.", done_for_you: "Thanks — your request is in." },
    reply: (email: string) => ["We’re reviewing it and will reply to", email, "with the next step."],
    scanCta: "Run a free scan",
    homeCta: "Back to home",
    switchPlan: { agency: "Looking for the done-for-you fix instead?", done_for_you: "Managing several locations? See the agency plan." },
  },
  fr: {
    homeAria: "GetInTheAnswer, retour à l’accueil",
    back: "Retour à l’accueil",
    confidential: "Demande confidentielle",
    asideIcons: {
      agency: [
        "Visibilité par ville et suivi des concurrents",
        "Rapports en marque blanche pour vos clients et vos équipes",
        "Un dispositif construit autour de votre portefeuille",
      ],
      done_for_you: [
        "Nous appliquons nous-mêmes votre plan d’action",
        "Page FAQ locale, données structurées et annuaires corrigés",
        "Nouvelle analyse après 30 jours, avec le score avant/après",
      ],
    },
    asideEyebrow: { agency: "Agence & multi-établissements", done_for_you: "On corrige pour vous" },
    asideTitle: {
      agency: "Rendez chaque établissement visible dans les réponses des IA.",
      done_for_you: "Entrez dans la réponse des IA sans y passer vos soirées.",
    },
    asideText: {
      agency: "Dites-nous ce que vous gérez. Nous vous recommanderons le dispositif de suivi adapté à vos établissements ou à votre portefeuille clients.",
      done_for_you: "Parlez-nous de votre entreprise. Nous étudions votre site et votre rapport, puis nous confirmons le devis avant tout paiement.",
    },
    formEyebrow: { agency: "Planifiez votre déploiement", done_for_you: "Demander la prise en charge" },
    formTitle: { agency: "Parlez-nous de votre portefeuille.", done_for_you: "Parlez-nous de votre entreprise." },
    formIntro: {
      agency: "Donnez-nous l’essentiel et nous vous proposerons la meilleure façon de suivre vos établissements.",
      done_for_you: "Quelques informations suffisent. Si vous avez déjà fait l’analyse gratuite, indiquez-le dans le message.",
    },
    priceLabel: "paiement unique",
    fullName: "Votre nom",
    fullNamePlaceholder: "Camille Martin",
    email: "Email professionnel",
    emailPlaceholder: "camille@entreprise.fr",
    company: { agency: "Société", done_for_you: "Nom de l’entreprise" },
    companyPlaceholder: { agency: "Agence Boréale", done_for_you: "Cuisines du Vieux-Port" },
    locations: "Établissements gérés",
    website: { agency: "Site de la société", done_for_you: "Site de l’entreprise" },
    websitePlaceholder: "mon-entreprise.fr",
    optional: "Facultatif",
    message: { agency: "Objectifs ou contexte", done_for_you: "Quelque chose à nous dire ?" },
    messagePlaceholder: {
      agency: "Parlez-nous de vos établissements, de vos clients, de vos besoins de reporting ou de votre calendrier…",
      done_for_you: "Votre ville, vos prestations principales, le lien de votre analyse gratuite, vos délais…",
    },
    honeypot: "Laissez ce champ vide",
    errUrl: "Vérifiez l’adresse du site, par exemple mon-entreprise.fr.",
    errUrlRequired: "Indiquez votre site pour que nous puissions l’étudier.",
    errLocations: "Indiquez un nombre d’établissements compris entre 2 et 10 000.",
    errSend: "Nous n’avons pas pu envoyer votre demande pour le moment.",
    errUnexpected: "Une erreur inattendue s’est produite. Merci de réessayer dans un instant.",
    sending: "Envoi de votre demande…",
    submit: { agency: "Demander une offre agence", done_for_you: "Demander la prise en charge" },
    privacy: "Nous utilisons ces informations uniquement pour étudier votre demande et y répondre. Nous ne vendons pas vos données.",
    privacyLink: "Détails de confidentialité",
    received: "Demande reçue",
    thanks: { agency: "Merci — votre demande agence est enregistrée.", done_for_you: "Merci — votre demande est enregistrée." },
    reply: (email: string) => ["Nous l’étudions et répondons à", email, "avec la prochaine étape."],
    scanCta: "Lancer une analyse gratuite",
    homeCta: "Retour à l’accueil",
    switchPlan: { agency: "Vous cherchez plutôt l’offre « on corrige pour vous » ?", done_for_you: "Plusieurs établissements ? Voir l’offre agence." },
  },
};

const asideIconSets = {
  agency: [MapPinned, FileChartColumnIncreasing, MessagesSquare],
  done_for_you: [Wrench, ShieldCheck, RefreshCcw],
};

function normalizeOptionalWebsite(value: string) {
  if (!value.trim()) return null;
  const candidate = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function ContactPage({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const [plan, setPlan] = useState<Plan>("agency");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("plan") !== "done-for-you") return;
    let active = true;
    queueMicrotask(() => {
      if (active) setPlan("done_for_you");
    });
    return () => {
      active = false;
    };
  }, []);

  const switchPlan = () => {
    const next: Plan = plan === "agency" ? "done_for_you" : "agency";
    setPlan(next);
    setError(null);
    const url = new URL(window.location.href);
    if (next === "done_for_you") url.searchParams.set("plan", "done-for-you");
    else url.searchParams.delete("plan");
    window.history.replaceState(null, "", url);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.id as keyof FormData;
    setFormData((current) => ({ ...current, [field]: event.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalizedUrl = normalizeOptionalWebsite(formData.websiteUrl);
    if (normalizedUrl === undefined) {
      setError(copy.errUrl);
      return;
    }
    if (plan === "done_for_you" && normalizedUrl === null) {
      setError(copy.errUrlRequired);
      return;
    }

    const locationCount = plan === "done_for_you" ? 1 : Number(formData.locationCount);
    if (plan === "agency" && (!Number.isInteger(locationCount) || locationCount < 2 || locationCount > 10000)) {
      setError(copy.errLocations);
      return;
    }

    setLoading(true);
    window.gtag?.("event", plan === "agency" ? "agency_contact_submit" : "done_for_you_submit", { location_count: locationCount });

    try {
      const trimmedEmail = formData.workEmail.trim();
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fullName: formData.fullName.trim(),
          workEmail: trimmedEmail,
          companyName: formData.companyName.trim(),
          message: formData.message.trim() || null,
          websiteUrl: normalizedUrl,
          locationCount,
          inquiryType: plan,
        }),
      });
      const data = (await response.json()) as ContactResponse;

      if (!response.ok || data.status !== "received") {
        throw new Error(locale === "en" && data.message ? data.message : copy.errSend);
      }

      window.gtag?.("event", "generate_lead", { lead_source: plan === "agency" ? "agency_contact_form" : "done_for_you_form" });
      setSubmittedEmail(trimmedEmail);
      setFormData(initialFormData);
    } catch (submissionError) {
      window.gtag?.("event", "agency_contact_failed", { reason: "api_or_network" });
      setError(submissionError instanceof Error ? submissionError.message : copy.errUnexpected);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "h-12 rounded-xl border-foreground/10 bg-white px-4 shadow-sm focus-visible:border-primary";
  const icons = asideIconSets[plan];
  const reply = copy.reply(submittedEmail ?? "");

  return (
    <main id="main-content" className="min-h-screen bg-[#f8f8f3] lg:grid lg:grid-cols-[0.86fr_1.14fr]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#173b35] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="pointer-events-none absolute -left-44 top-10 size-[430px] rounded-full bg-lime-300/12 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-44 -right-24 size-[500px] rounded-full bg-emerald-300/10 blur-3xl" aria-hidden="true" />

        <div className="relative">
          <Link className="inline-flex items-center gap-2.5" href={localePath(locale, "/")} aria-label={copy.homeAria}>
            <LogoMark variant="on-dark" className="size-10" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>

          <div className="mt-16 max-w-lg xl:mt-20">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-lime-300">{copy.asideEyebrow[plan]}</p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.02] tracking-[-0.05em] xl:text-6xl">{copy.asideTitle[plan]}</h1>
            <p className="mt-7 text-lg leading-8 text-white/65">{copy.asideText[plan]}</p>
            {plan === "done_for_you" && (
              <p className="mt-6 flex items-end gap-2">
                <Price amounts={DONE_FOR_YOU_PRICE} className="text-5xl font-black tracking-[-0.06em] text-lime-300" />
                <span className="pb-1.5 text-sm font-semibold text-white/60">{copy.priceLabel}</span>
              </p>
            )}
          </div>
        </div>

        <div className="relative grid gap-3">
          {copy.asideIcons[plan].map((text, index) => {
            const Icon = icons[index];
            return (
              <div className="flex items-center gap-3 text-sm font-semibold text-white/80" key={text}>
                <span className="flex size-8 items-center justify-center rounded-full bg-lime-300 text-[#173b35]">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {text}
              </div>
            );
          })}
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
            <LanguageSwitcher locale={locale} path="/contact" />
            <span className="hidden items-center gap-2 text-xs font-bold text-muted-foreground sm:flex">
              <ShieldCheck className="size-3.5 text-emerald-700" aria-hidden="true" />
              {copy.confidential}
            </span>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="w-full max-w-2xl animate-fade-in">
            {submittedEmail ? (
              <div className="rounded-[1.75rem] border border-emerald-200 bg-white p-7 text-center shadow-sm sm:p-10" role="status" aria-live="polite">
                <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-lime-200 text-primary">
                  <CheckCircle2 className="size-8" aria-hidden="true" />
                </span>
                <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.14em] text-emerald-700">{copy.received}</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">{copy.thanks[plan]}</h2>
                <p className="mx-auto mt-4 max-w-lg leading-7 text-muted-foreground">
                  {reply[0]} <span className="font-bold text-foreground">{reply[1]}</span> {reply[2]}
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <Button asChild className="h-12 rounded-xl font-extrabold">
                    <Link href={localePath(locale, "/onboarding")}>{copy.scanCta} <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
                  </Button>
                  <Button asChild variant="outline" className="h-12 rounded-xl bg-white font-bold">
                    <Link href={localePath(locale, "/")}>{copy.homeCta}</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-lime-200 text-primary sm:flex">
                    {plan === "agency" ? <Building2 className="size-6" aria-hidden="true" /> : <Wrench className="size-6" aria-hidden="true" />}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-emerald-700">{copy.formEyebrow[plan]}</p>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">{copy.formTitle[plan]}</h2>
                    <p className="mt-2 text-base leading-7 text-muted-foreground">{copy.formIntro[plan]}</p>
                    {plan === "done_for_you" && (
                      <p className="mt-3 flex items-end gap-2 lg:hidden">
                        <Price amounts={DONE_FOR_YOU_PRICE} className="text-3xl font-black tracking-[-0.05em]" />
                        <span className="pb-1 text-xs font-semibold text-muted-foreground">{copy.priceLabel}</span>
                      </p>
                    )}
                  </div>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit} data-testid="agency-contact-form">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="min-w-0 space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-bold">{copy.fullName}</Label>
                      <Input id="fullName" autoComplete="name" placeholder={copy.fullNamePlaceholder} value={formData.fullName} onChange={handleChange} required minLength={2} maxLength={100} className={inputClass} />
                    </div>
                    <div className="min-w-0 space-y-2">
                      <Label htmlFor="workEmail" className="text-sm font-bold">{copy.email}</Label>
                      <Input id="workEmail" type="email" autoComplete="email" inputMode="email" placeholder={copy.emailPlaceholder} value={formData.workEmail} onChange={handleChange} required maxLength={200} className={inputClass} />
                    </div>
                  </div>

                  <div className={`grid gap-5 ${plan === "agency" ? "sm:grid-cols-2" : ""}`}>
                    <div className="min-w-0 space-y-2">
                      <Label htmlFor="companyName" className="text-sm font-bold">{copy.company[plan]}</Label>
                      <Input id="companyName" autoComplete="organization" placeholder={copy.companyPlaceholder[plan]} value={formData.companyName} onChange={handleChange} required minLength={2} maxLength={120} className={inputClass} />
                    </div>
                    {plan === "agency" && (
                      <div className="min-w-0 space-y-2">
                        <Label htmlFor="locationCount" className="text-sm font-bold">{copy.locations}</Label>
                        <Input id="locationCount" type="number" inputMode="numeric" min={2} max={10000} step={1} placeholder="25" value={formData.locationCount} onChange={handleChange} required className={inputClass} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <Label htmlFor="websiteUrl" className="text-sm font-bold">{copy.website[plan]}</Label>
                      {plan === "agency" && <span className="text-xs font-medium text-muted-foreground">{copy.optional}</span>}
                    </div>
                    <Input id="websiteUrl" autoComplete="url" inputMode="url" placeholder={copy.websitePlaceholder} value={formData.websiteUrl} onChange={handleChange} required={plan === "done_for_you"} maxLength={300} className={inputClass} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <Label htmlFor="message" className="text-sm font-bold">{copy.message[plan]}</Label>
                      <span className="text-xs font-medium text-muted-foreground">{copy.optional}</span>
                    </div>
                    <Textarea id="message" placeholder={copy.messagePlaceholder[plan]} value={formData.message} onChange={handleChange} maxLength={2000} className="min-h-28 resize-y rounded-xl border-foreground/10 bg-white px-4 py-3 shadow-sm focus-visible:border-primary" />
                  </div>

                  <div className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">
                    <Label htmlFor="companyWebsite">{copy.honeypot}</Label>
                    <Input id="companyWebsite" tabIndex={-1} autoComplete="off" value={formData.companyWebsite} onChange={handleChange} />
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert" aria-live="polite">
                      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      {error}
                    </div>
                  )}

                  <Button className="h-14 w-full rounded-xl text-base font-extrabold shadow-lg shadow-primary/12" type="submit" disabled={loading}>
                    {loading ? (
                      <><Loader2 className="mr-2 size-5 animate-spin" aria-hidden="true" /> {copy.sending}</>
                    ) : (
                      <>{copy.submit[plan]} <ArrowRight className="ml-2 size-5" aria-hidden="true" /></>
                    )}
                  </Button>

                  <div className="flex items-start justify-center gap-2 text-center text-xs leading-5 text-muted-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-700" aria-hidden="true" />
                    <span>
                      {copy.privacy}{" "}
                      <Link className="font-bold text-emerald-700 underline" href="/privacy">{copy.privacyLink}</Link>
                    </span>
                  </div>

                  <p className="text-center text-sm">
                    <button className="font-bold text-emerald-700 underline-offset-4 hover:underline" type="button" onClick={switchPlan}>
                      {copy.switchPlan[plan]}
                    </button>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
