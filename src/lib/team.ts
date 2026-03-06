import fs from "fs";
import path from "path";
import { parse } from "yaml";

export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio: string;
  yearsExperience: number;
}

interface TeamConfig {
  members: TeamMember[];
}

let cachedTeam: TeamMember[] | null = null;

export function getTeamMembers(): TeamMember[] {
  if (cachedTeam) {
    return cachedTeam;
  }

  const filePath = path.join(process.cwd(), "src", "data", "team.yml");
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = parse(raw) as TeamConfig;

  cachedTeam = parsed.members;
  return cachedTeam;
}

export function buildTeamJsonLd(members: TeamMember[]): object[] {
  return members.map((member) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    image: `https://vykoupim-nemovitost.cz${member.photo}`,
    worksFor: {
      "@type": "Organization",
      name: "Vykoupím Nemovitost",
      url: "https://vykoupim-nemovitost.cz",
    },
  }));
}
