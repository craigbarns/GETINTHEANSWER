import { CURRENCIES, formatPrice, type Currency } from "@/lib/pricing";

/** Renders every currency variant at once and lets CSS reveal the selected one.
 *  Both amounts ship in the HTML, so the page stays server-rendered and the
 *  toggle costs no hydration and no layout flash. */
export function Price({
  amounts,
  className,
  suffix,
}: {
  amounts: Record<Currency, number>;
  className?: string;
  suffix?: string;
}) {
  return (
    <>
      {CURRENCIES.map((currency) => (
        <span className={className} data-price-currency={currency} key={currency}>
          {formatPrice(amounts[currency], currency)}
          {suffix}
        </span>
      ))}
    </>
  );
}
