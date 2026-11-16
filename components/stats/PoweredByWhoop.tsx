/* eslint-disable @next/next/no-img-element -- official WHOOP SVGs, shown unmodified */

// WHOOP attribution lockup, per the WHOOP Brand & Design Guidelines:
// "POWERED BY" + the WHOOP Puck, logo in pure black or white only, at its 30px minimum width,
// label set like a WHOOP headline (bold, uppercase, 10% letter spacing, Helvetica Neue fallback).
export default function PoweredByWhoop() {
  return (
    <a
      href="https://www.whoop.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Powered by WHOOP"
      className="inline-flex items-center gap-[10px] p-[8px] text-black dark:text-white"
    >
      <span
        className="text-[10px] uppercase leading-none"
        style={{
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          fontWeight: 700,
          letterSpacing: "0.1em",
        }}
      >
        Powered by
      </span>
      <img src="/brand/whoop-puck-black.svg" alt="" width={30} height={30} className="block dark:hidden" />
      <img src="/brand/whoop-puck-white.svg" alt="" width={30} height={30} className="hidden dark:block" />
    </a>
  );
}
