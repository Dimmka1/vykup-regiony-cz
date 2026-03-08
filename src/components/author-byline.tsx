import Link from "next/link";

interface AuthorBylineProps {
  name: string;
  slug: string;
}

export function AuthorByline({ name, slug }: AuthorBylineProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
        {name.charAt(0)}
      </div>
      <span>Autor:</span>
      <Link
        href={`/o-nas/${slug}`}
        className="font-medium text-emerald-600 hover:text-emerald-500"
      >
        {name}
      </Link>
    </div>
  );
}
