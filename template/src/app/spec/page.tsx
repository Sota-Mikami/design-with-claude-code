"use client";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "components", title: "Components" },
  { id: "interactions", title: "Interactions" },
  { id: "tokens", title: "Design Tokens" },
  { id: "responsive", title: "Responsive" },
  { id: "edge-cases", title: "Edge Cases" },
  { id: "impl-notes", title: "Implementation Notes" },
] as const;

function SectionNav() {
  return (
    <nav className="flex flex-wrap gap-2 mb-8 text-sm">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="px-3 py-1 rounded-full border border-border text-text-sub hover:bg-bg-surface transition-colors"
        >
          {s.title}
        </a>
      ))}
    </nav>
  );
}

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <h2 id={id} className="text-lg font-bold mt-12 mb-4 scroll-mt-20">
      <a href={`#${id}`} className="hover:text-primary transition-colors">
        {title}
      </a>
    </h2>
  );
}

function Placeholder({ hint }: { hint: string }) {
  return (
    <div className="border border-dashed border-border rounded-lg p-6 text-text-hint text-sm">
      {hint}
    </div>
  );
}

function TokenSwatch({
  name,
  value,
  textColor,
}: {
  name: string;
  value: string;
  textColor?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-md border border-border shrink-0"
        style={{ backgroundColor: value }}
      />
      <div>
        <span className="text-sm font-mono" style={{ color: textColor }}>
          {name}
        </span>
        <span className="text-xs text-text-hint ml-2">{value}</span>
      </div>
    </div>
  );
}

export default function SpecPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Spec</h1>
      <p className="text-text-sub text-sm mb-6">
        Implementation specification for this prototype.
      </p>

      <SectionNav />

      <SectionHeading id="overview" title="Overview" />
      <Placeholder hint="Describe the purpose and user story. e.g. 'As a user, I want to see my learning progress at a glance.'" />

      <SectionHeading id="components" title="Components" />
      <Placeholder hint="List components used. You can import prototype components and render them inline." />

      <SectionHeading id="interactions" title="Interactions" />
      <div className="space-y-4">
        <Placeholder hint="Describe state transitions: default / hover / active / disabled / loading" />
        <div className="text-sm text-text-sub">
          <p className="font-medium text-text mb-2">Example format:</p>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4">Element</th>
                <th className="py-2 pr-4">Trigger</th>
                <th className="py-2 pr-4">Change</th>
                <th className="py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border text-text-hint">
                <td className="py-2 pr-4">CTA Button</td>
                <td className="py-2 pr-4">hover</td>
                <td className="py-2 pr-4">bg: primary -> primary-hover</td>
                <td className="py-2">150ms ease</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <SectionHeading id="tokens" title="Design Tokens" />
      <p className="text-sm text-text-sub mb-4">
        Tokens used in this screen:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TokenSwatch name="--color-primary" value="#3B82F6" />
        <TokenSwatch name="--color-bg" value="#FFFFFF" />
        <TokenSwatch name="--color-bg-surface" value="#F5F5F5" />
        <TokenSwatch name="--color-text" value="#1F2937" />
        <TokenSwatch name="--color-text-sub" value="#6B7280" />
        <TokenSwatch name="--color-border" value="#E5E7EB" />
      </div>
      <p className="text-xs text-text-hint mt-3">
        Replace with your actual tokens.
      </p>

      <SectionHeading id="responsive" title="Responsive" />
      <Placeholder hint="Describe breakpoint behavior. e.g. sm(640px) / md(768px) / lg(1024px)" />

      <SectionHeading id="edge-cases" title="Edge Cases" />
      <div className="space-y-3">
        {["Error state", "Empty state", "Loading", "Overflow / limit exceeded"].map(
          (label) => (
            <div
              key={label}
              className="border border-dashed border-border rounded-lg p-4 text-sm text-text-hint"
            >
              {label}: describe behavior here
            </div>
          )
        )}
      </div>

      <SectionHeading id="impl-notes" title="Implementation Notes" />
      <Placeholder hint="API endpoints, data types, references to existing components, etc." />
    </main>
  );
}
