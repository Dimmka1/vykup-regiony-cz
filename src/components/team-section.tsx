import Image from "next/image";
import type { ReactElement } from "react";
import type { TeamMember } from "@/lib/team";

interface TeamSectionProps {
  members: TeamMember[];
}

export function TeamSection({ members }: TeamSectionProps): ReactElement {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          Náš tým
        </h2>
        <p className="mt-2 text-center text-slate-600">
          Profesionálové, kteří se postarají o bezproblémový průběh výkupu
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={member.photo}
                  alt={`${member.name} – ${member.role}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-[var(--theme-600)]">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {member.bio}
                </p>
                <p className="mt-3 text-xs font-medium text-slate-400">
                  {member.yearsExperience} let zkušeností
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
