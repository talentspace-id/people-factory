import type { RankedActionItem } from "@/lib/scoring/action-items";

export function ActionItemList({ items }: { items: RankedActionItem[] }) {
  if (items.length === 0) {
    return <p className="pf-empty-state">No action items — the content library has no template for this profile yet.</p>;
  }

  return (
    <ol className="pf-action-item-list">
      {items.map((item) => (
        <li key={`${item.dichotomy}-${item.pole}`} className="pf-action-item">
          <div className="pf-action-item-title">{item.title}</div>
          <p className="pf-action-item-guidance">{item.guidance}</p>
        </li>
      ))}
    </ol>
  );
}
