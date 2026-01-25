export function buildArchive(posts: any[]) {
  const archiveMap = new Map<string, Set<string>>();
  for (const p of posts) {
    const d = p.data.pubDate;
    const y = String(d.getFullYear());
    const m = String(d.getMonth() + 1).padStart(2, "0");
    if (!archiveMap.has(y)) archiveMap.set(y, new Set());
    archiveMap.get(y)!.add(m);
  }

  const years = [...archiveMap.keys()].sort((a, b) => Number(b) - Number(a));
  return years.map((y) => ({
    year: y,
    months: [...archiveMap.get(y)!].sort((a, b) => Number(b) - Number(a)),
  }));
}
