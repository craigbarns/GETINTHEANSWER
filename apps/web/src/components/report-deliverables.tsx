import { LockKeyhole } from "lucide-react";
import { CopyReadyContent } from "@/components/copy-ready-content";
import { Price } from "@/components/price";
import { UnlockButton } from "@/components/unlock-button";
import type { Locale } from "@/lib/i18n";
import { PRICES } from "@/lib/pricing";
import { buildReportDeliverables } from "@/lib/report-deliverables";
import type { DashboardData } from "@/lib/seenbyai";

export function ReportDeliverables({ data, locale }: { data: DashboardData; locale: Locale }) {
  if (data.mode !== "live") return null;
  const fr = locale === "fr";
  const assets = buildReportDeliverables(data, locale);
  const cards = [
    { title: fr ? "Votre page FAQ rédigée" : "Your written FAQ page", description: fr ? "Des réponses adaptées aux intentions des questions de votre analyse." : "Answers based on the intent of the questions in your scan.", text: assets?.faqHtml ?? "", filename: "faq.html", copy: fr ? "Copier la page FAQ" : "Copy FAQ page" },
    { title: fr ? "Vos données structurées LocalBusiness" : "Your LocalBusiness structured data", description: fr ? "Le nom, le site et la ville renseignés dans votre profil, prêts à intégrer." : "Your supplied business name, website and city, ready to add to your site.", text: assets?.schemaCode ?? "", filename: "localbusiness.html", copy: fr ? "Copier le code" : "Copy code" },
    { title: fr ? "Votre description de fiche Google" : "Your Google Business description", description: fr ? "Une présentation de votre activité, sans lien ni promesse commerciale inventée." : "A description of your business without links or invented marketing claims.", text: assets?.googleDescription ?? "", filename: "google-business.txt", copy: fr ? "Copier la description" : "Copy description" },
  ];
  return <section className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7" aria-labelledby="deliverables-heading">
    <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">{fr ? "Passez à l’action" : "Put the findings to work"}</p>
    <h2 id="deliverables-heading" className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">{fr ? "Vos corrections, prêtes à copier." : "Your fixes, ready to copy."}</h2>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">{fr ? "Ces contenus utilisent les informations de votre profil et les questions de votre relevé. Relisez-les avant de les publier." : "These drafts use your profile information and the questions in your scan. Review them before publishing."}</p>
    <div className="mt-6 grid gap-4 lg:grid-cols-3">{cards.map((card) => <article key={card.filename} className="min-w-0 rounded-2xl border border-foreground/10 bg-[#f8f8f3] p-5">
      <h3 className="text-lg font-extrabold">{card.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{card.description}</p>
      {assets ? <CopyReadyContent text={card.text} filename={card.filename} label={card.copy} locale={locale} />
        : <div className="mt-5"><UnlockButton siteId={data.site_id} placement={`asset_${card.filename}`} locale={locale} variant="outline" size="sm" className="rounded-full"><LockKeyhole className="mr-1.5 size-4" />{fr ? "Débloquer — " : "Unlock — "}<Price amounts={PRICES.pro} />{fr ? " / mois" : " / month"}</UnlockButton></div>}
    </article>)}</div>
    {assets && <details className="mt-5 text-sm"><summary className="cursor-pointer font-bold">{fr ? "Questions du relevé utilisées" : "Scan questions used"}</summary><ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">{assets.sourceQuestions.map((question) => <li key={question}>{question}</li>)}</ul></details>}
  </section>;
}
