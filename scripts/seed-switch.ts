/**
 * シナリオ別シードを切り替えるスクリプト。
 *
 * 使い方:
 *   npx tsx scripts/seed-switch.ts yamada
 *   npx tsx scripts/seed-switch.ts sato
 *   npx tsx scripts/seed-switch.ts safety
 *   npx tsx scripts/seed-switch.ts exec
 *
 * このスクリプトは [seed/<scenario>.json] を読み、`src/lib/seed-active.json` に
 * 上書きコピーする。`prototype-store` は起動時にこのファイルを読んで初期 state を構築する。
 *
 * NOTE: このプロトタイプ環境では prototype-store が直接初期データを定義しているため、
 * 切替の効果はサーバー再起動後に発生する。本番（Supabase）では SQL によるシード投入になる想定。
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();

async function main() {
  const scenario = process.argv[2];
  if (!scenario) {
    console.error("使い方: npx tsx scripts/seed-switch.ts <yamada|sato|safety|exec>");
    process.exit(1);
  }

  const sourcePath = path.join(root, "seed", `${scenario}.json`);
  const targetPath = path.join(root, "src", "lib", "seed-active.json");

  try {
    const data = await fs.readFile(sourcePath, "utf8");
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, data, "utf8");
    const parsed = JSON.parse(data) as { label: string };
    console.log(`✓ シード切替完了: ${parsed.label} (${scenario})`);
    console.log(`  → ${path.relative(root, targetPath)}`);
    console.log("  サーバー再起動 (npm run dev) で反映されます。");
  } catch (error) {
    console.error("シード切替に失敗しました", error);
    process.exit(1);
  }
}

void main();
