import { OnboardingForm } from "./onboarding-form";

function firstValue(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim().slice(0, 80) ?? "";
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <OnboardingForm initialCity={firstValue(params.city)} initialIndustry={firstValue(params.industry)} />
  );
}
