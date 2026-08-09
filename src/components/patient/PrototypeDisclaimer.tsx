type PrototypeDisclaimerProps = {
  className?: string;
};

export default function PrototypeDisclaimer({ className = "" }: PrototypeDisclaimerProps) {
  return (
    <p
      className={`rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 text-xs leading-relaxed text-slate-600 ${className}`}
    >
      AfyaNow is a care-navigation prototype, not a diagnostic tool.
      Recommendations are a starting point for finding care — a licensed
      clinician carries out the actual clinical assessment.
    </p>
  );
}
