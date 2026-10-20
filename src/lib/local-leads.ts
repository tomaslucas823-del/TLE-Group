export type LocalLead = {
  name: string;
  email: string;
  phone: string;
  areaM2: number;
  style: string;
  complexity: string;
  message: string;
};

const KEY = "tle-leads";

export function readLocalLeads(): LocalLead[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 10).flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const row = item as Partial<LocalLead>;
      if (!row.name || !row.email || !row.phone) return [];
      return [
        {
          name: String(row.name),
          email: String(row.email),
          phone: String(row.phone),
          areaM2: Number(row.areaM2) || 180,
          style: String(row.style || "pedra"),
          complexity: String(row.complexity || "estudo"),
          message: String(row.message || ""),
        },
      ];
    });
  } catch {
    return [];
  }
}

export function pushLocalLead(lead: LocalLead) {
  const next = [lead, ...readLocalLeads()].slice(0, 10);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearLocalLeads() {
  localStorage.removeItem(KEY);
}
