interface UpdatedBadgeProps {
  datePublished: string;
  dateModified: string;
}

export function UpdatedBadge({
  datePublished,
  dateModified,
}: UpdatedBadgeProps): React.ReactElement | null {
  if (!dateModified || dateModified === datePublished) return null;

  const publishedDate = new Date(datePublished).toISOString().slice(0, 10);
  const modifiedDate = new Date(dateModified).toISOString().slice(0, 10);

  if (publishedDate === modifiedDate) return null;

  const formatted = new Date(dateModified).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
      Aktualizováno: {formatted}
    </span>
  );
}
