// Build-time fetch of the schedule from the Indico instance that hosts the CFP
// (events.canonical.com). The speaker line-up is no longer fetched here - it is
// generated into src/content/lineup.yaml by scripts/fetch_speakers.py. Fails
// soft: any network/parse error → empty, so the build never breaks and the
// schedule page falls back to its "published later" state.

const INDICO_BASE = 'https://events.canonical.com';

export interface IndicoSession {
  id: string;
  title: string;
  speakers: string[]; // display names
  track?: string;
  room?: string;
  start: Date;
  end: Date;
}

export interface IndicoData {
  sessions: IndicoSession[];
}

const EMPTY: IndicoData = { sessions: [] };

// One fetch per event id per build, shared by the schedule + overview pages.
const cache = new Map<number, Promise<IndicoData>>();

type IndicoDateTime = { date?: string; time?: string; tz?: string };

function toDate(d?: IndicoDateTime): Date | null {
  if (!d?.date || !d?.time) return null;
  // Indico exports times in UTC (tz:"UTC"); a named tz falls back to IST since
  // every edition is held in India.
  const suffix = !d.tz || d.tz === 'UTC' ? 'Z' : '+05:30';
  const dt = new Date(`${d.date}T${d.time}${suffix}`);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function speakerName(s: any): string {
  return [s.first_name, s.last_name].filter(Boolean).join(' ').trim() || s.fullName || '';
}

async function load(eventId: number): Promise<IndicoData> {
  const res = await fetch(`${INDICO_BASE}/export/event/${eventId}.json?detail=contributions`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const contribs: any[] = json?.results?.[0]?.contributions ?? [];

  const sessions: IndicoSession[] = [];

  for (const c of contribs) {
    const speakerList: any[] = Array.isArray(c.speakers) ? c.speakers : [];
    const start = toDate(c.startDate);
    const end = toDate(c.endDate);
    if (!start || !end) continue;
    sessions.push({
      id: String(c.id),
      title: c.title,
      speakers: speakerList.map(speakerName).filter(Boolean),
      track: c.track || undefined,
      room: c.roomFullname || c.room || undefined,
      start,
      end,
    });
  }

  sessions.sort((a, b) => a.start.getTime() - b.start.getTime());
  return { sessions };
}

export function getIndico(eventId?: number | null): Promise<IndicoData> {
  if (!eventId) return Promise.resolve(EMPTY);
  if (!cache.has(eventId)) {
    // Cache successes only. On failure, evict so the next request retries
    // instead of serving a poisoned EMPTY for the rest of the process.
    const p = load(eventId).catch((err: Error) => {
      cache.delete(eventId);
      console.warn(`[indico] event ${eventId}: ${err.message} - using empty fallback`);
      return EMPTY;
    });
    cache.set(eventId, p);
  }
  return cache.get(eventId)!;
}
