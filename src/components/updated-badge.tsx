interface UpdatedBadgeProps {
  date: string;
}

export function UpdatedBadge({ date }: UpdatedBadgeProps) {
  const formatted = new Date(date).toLocaleDateString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
      Aktualizováno {formatted}
    </span>
  );
}
