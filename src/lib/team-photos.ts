import t1 from "@/assets/team-1.jpg";
import t2 from "@/assets/team-2.jpg";
import t3 from "@/assets/team-3.jpg";
import t4 from "@/assets/team-4.jpg";

const map: Record<string, string> = {
  "team-1.jpg": t1,
  "team-2.jpg": t2,
  "team-3.jpg": t3,
  "team-4.jpg": t4,
};

export function resolveTeamPhoto(photoUrl: string | null | undefined): string {
  if (!photoUrl) return t1;
  // direct URL
  if (photoUrl.startsWith("http")) return photoUrl;
  const key = photoUrl.replace(/^\/?(src\/assets\/)?/, "");
  return map[key] ?? photoUrl;
}
