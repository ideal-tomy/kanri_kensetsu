export type ParsedReport = {
  personnel: { job: string; count: number }[];
  total: number;
  weather?: "sunny" | "cloudy" | "rain" | "snow";
  interrupted: boolean;
  interruption_reason?: string;
  safety_check: "done" | "partial" | "not_done";
  notes?: string;
  unrecognized: string[];
};

const JOB_PATTERNS = [
  { name: "鉄筋工", regex: /鉄筋(?:工|者)?\s*(\d+)/ },
  { name: "左官", regex: /左官(?:工|者)?\s*(\d+)/ },
  { name: "大工", regex: /大工\s*(\d+)/ },
  { name: "設備", regex: /設備(?:工)?\s*(\d+)/ },
  { name: "電気", regex: /電気(?:工)?\s*(\d+)/ },
  { name: "土工", regex: /土工\s*(\d+)/ },
  { name: "とび職", regex: /(?:とび|鳶)(?:工|職)?\s*(\d+)/ },
];

const WEATHER_PATTERNS = {
  sunny: /晴れ|快晴/,
  cloudy: /曇り|くもり/,
  rain: /雨|降雨|降ってきた/,
  snow: /雪|降雪/,
};

export function parseReport(text: string): ParsedReport {
  const result: ParsedReport = {
    personnel: [],
    total: 0,
    interrupted: false,
    safety_check: "not_done",
    unrecognized: [],
  };

  for (const { name, regex } of JOB_PATTERNS) {
    const match = text.match(regex);
    if (!match) continue;
    const count = Number.parseInt(match[1] ?? "0", 10);
    if (Number.isNaN(count) || count <= 0) continue;
    result.personnel.push({ job: name, count });
    result.total += count;
  }

  for (const [key, pattern] of Object.entries(WEATHER_PATTERNS)) {
    if (pattern.test(text)) {
      result.weather = key as ParsedReport["weather"];
      break;
    }
  }

  if (/中断|止めた|やめた/.test(text)) {
    result.interrupted = true;
    if (/雨/.test(text)) result.interruption_reason = "雨天";
    else if (/資材/.test(text)) result.interruption_reason = "資材待ち";
    else if (/事故|怪我/.test(text)) result.interruption_reason = "事故";
  }

  if (/安全確認.{0,10}(?:完了|済|オーケー|OK)/.test(text)) {
    result.safety_check = "done";
  } else if (/安全確認.{0,10}(?:一部|部分)/.test(text)) {
    result.safety_check = "partial";
  }

  return result;
}
