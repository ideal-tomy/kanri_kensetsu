# 業種別デモサイト戦略書 v1.0｜建設業界特化展開

> **このドキュメントの位置づけ**
> 既存の GENBA NOTE を基盤に、建設関連の複数業種向けデモサイトを2週間で構築し、営業ツールとして展開するための戦略・実装PLAN。
>
> **目的**
> 1. 建設関連業種（足場・電気工事・清掃・内装等）向けの**営業デモを2週間で完成**
> 2. 業種カスタマイズの**設定パターン**を確立
> 3. 商談で「**御社業種でもこう使えます**」を即座に見せられる状態を作る

---

## 0. 戦略サマリ

```
建設関連業種に特化した営業ツール展開

Week 1：業種設定の構造化 + 5業種のデータ準備
Week 2：デモサイト構築 + LP制作

完成物：
 business-demo.example.com
   /demo/general（建設一般）★既存
   /demo/scaffolding（足場）
   /demo/electrical（電気工事）
   /demo/cleaning（清掃）
   /demo/interior（内装）

ROI：
 開発工数 80h → 1案件300万 × 業種数の市場
```

---

## 1. ターゲット5業種の特性整理

### 1.1 各業種の業務フロー比較

| 業種 | 主な作業単位 | 1日あたり現場数 | 報告頻度 | 写真重要度 |
|------|------------|--------------|---------|----------|
| 建設一般 | 現場×日 | 1〜3 | 日報 | ★★★ |
| 足場 | 仮設・解体 | 2〜5（短期回転） | 開始/完了 | ★★★ |
| 電気工事 | 配線・配管 | 3〜10（巡回型） | 完了報告 | ★★ |
| 清掃 | 物件×日次 | 5〜15（多現場） | チェックリスト | ★★ |
| 内装 | 部屋・工程 | 1〜2（長期常駐） | 工程進捗 | ★★★ |

### 1.2 業種ごとの「カードに表示すべき情報」

| 業種 | 重要KPI | カードの主要項目 |
|------|---------|---------------|
| 建設一般 | 全体進捗% / 人員数 | 現場名・進捗・出勤者・天候 |
| 足場 | 設置完了/解体完了 | 物件名・段階（仮設中/完成/解体中）・人員 |
| 電気工事 | 完了件数/今日の予定 | 物件名・作業種別（配線/点検/設置）・所要時間 |
| 清掃 | 物件巡回完了率 | 物件名・予定時刻・チェックリスト達成度 |
| 内装 | 工程別進捗 | 部屋名・工程（下地/塗装/仕上）・%進捗 |

---

## 2. 業種設定の構造（Layer 1：JSONで定義）

ご提案の「カード項目を変更したり、表示する項目を増減」をJSONで実現します。

### 2.1 設定ファイルの構造

```typescript
// src/config/industries/types.ts
export type IndustryConfig = {
  id: string;
  name: string;
  description: string;
  
  // 用語のカスタマイズ
  terminology: {
    site: string;       // 「現場」or「物件」or「設置場所」
    project: string;    // 「案件」or「物件」or「巡回ルート」
    task: string;       // 「業務」or「作業」or「点検」
    worker: string;     // 「職人」or「作業員」or「スタッフ」
    progress: string;   // 「進捗」or「達成度」
  };
  
  // ダッシュボードのカード構成
  dashboard: {
    cards: CardConfig[];
    charts: ChartConfig[];
    layout: 'grid_4' | 'grid_3' | 'grid_2';
  };
  
  // 報告のカテゴリ
  reportCategories: {
    id: string;
    label: string;
    color: string;
    icon: string;
  }[];
  
  // タスクの単位
  taskUnits: {
    value: string;
    label: string;
    step: number;
  }[];
  
  // ステータスの定義
  statuses: {
    id: string;
    label: string;
    color: string;
  }[];
  
  // サンプルデータ
  sampleData: {
    sites: SampleSite[];
    workers: SampleWorker[];
    tasks: SampleTask[];
  };
};

export type CardConfig = {
  id: string;
  type: 'metric' | 'progress_ring' | 'list' | 'gauge';
  title: string;
  data_source: string;
  label_unit?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
};

export type ChartConfig = {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'horizontal_bar';
  title: string;
  data_source: string;
};
```

### 2.2 業種設定の実例：足場業

```typescript
// src/config/industries/scaffolding.config.ts
export const scaffoldingConfig: IndustryConfig = {
  id: 'scaffolding',
  name: '足場業',
  description: '仮設足場の組立・解体業務に特化',
  
  terminology: {
    site: '現場',
    project: '物件',
    task: '作業',
    worker: '職人',
    progress: '完了率',
  },
  
  dashboard: {
    cards: [
      { id: 'setting_up', type: 'metric', title: '仮設中',
        data_source: 'sites.status.setting_up.count', label_unit: '件', color: '#E67E22' },
      { id: 'completed', type: 'metric', title: '完成',
        data_source: 'sites.status.completed.count', label_unit: '件', color: '#27AE60' },
      { id: 'dismantling', type: 'metric', title: '解体中',
        data_source: 'sites.status.dismantling.count', label_unit: '件', color: '#C0392B' },
      { id: 'today_workers', type: 'metric', title: '今日の出勤',
        data_source: 'workers.today.count', label_unit: '人' },
    ],
    charts: [
      { id: 'progress_by_site', type: 'horizontal_bar',
        title: '物件別 完了率', data_source: 'sites.progress' },
      { id: 'weekly_activity', type: 'line',
        title: '今週の作業実績', data_source: 'activity.weekly' },
    ],
    layout: 'grid_4',
  },
  
  reportCategories: [
    { id: 'before',    label: '着工前',   color: '#6A737D', icon: 'circle' },
    { id: 'setup',     label: '仮設中',   color: '#E67E22', icon: 'tool' },
    { id: 'complete',  label: '完成',     color: '#27AE60', icon: 'check' },
    { id: 'dismantle', label: '解体中',   color: '#C0392B', icon: 'minus' },
    { id: 'safety',    label: '安全確認', color: '#2980B9', icon: 'shield' },
  ],
  
  taskUnits: [
    { value: '段',  label: '段',  step: 1 },
    { value: 'm²', label: '㎡',  step: 1 },
    { value: '基',  label: '基',  step: 1 },
  ],
  
  statuses: [
    { id: 'planned',     label: '予定',   color: '#6A737D' },
    { id: 'setting_up',  label: '仮設中', color: '#E67E22' },
    { id: 'completed',   label: '完成',   color: '#27AE60' },
    { id: 'dismantling', label: '解体中', color: '#9B59B6' },
    { id: 'archived',    label: '完了',   color: '#95A5A6' },
  ],
  
  sampleData: {
    sites: [
      { name: '○○マンション南棟', status: 'setting_up', progress: 45 },
      { name: '△△ビル外壁工事',   status: 'completed',  progress: 100 },
      { name: '××邸新築',          status: 'planned',    progress: 0 },
    ],
    workers: [
      { name: '山田太郎', role: 'とび工', shift: 'day' },
    ],
    tasks: [
      { title: '南面 1段目組立', unit: '段', planned: 8, actual: 5 },
    ],
  },
};
```

### 2.3 業種設定の実例：電気工事

```typescript
// src/config/industries/electrical.config.ts
export const electricalConfig: IndustryConfig = {
  id: 'electrical',
  name: '電気工事業',
  description: '配線・配管・点検作業に特化',
  
  terminology: {
    site: '物件',
    project: '案件',
    task: '作業',
    worker: '電工',
    progress: '完了率',
  },
  
  dashboard: {
    cards: [
      { id: 'today_visits', type: 'metric', title: '本日訪問予定',
        data_source: 'visits.today.count', label_unit: '件' },
      { id: 'today_completed', type: 'metric', title: '完了',
        data_source: 'visits.today.completed', label_unit: '件', color: '#27AE60' },
      { id: 'avg_duration', type: 'metric', title: '平均所要時間',
        data_source: 'visits.avg_duration', label_unit: '分' },
      { id: 'monthly_count', type: 'metric', title: '今月の対応',
        data_source: 'visits.monthly.count', label_unit: '件' },
    ],
    charts: [
      { id: 'work_type_distribution', type: 'pie',
        title: '作業種別の内訳', data_source: 'visits.by_work_type' },
      { id: 'monthly_trend', type: 'line',
        title: '月次対応件数', data_source: 'visits.monthly_trend' },
    ],
    layout: 'grid_4',
  },
  
  reportCategories: [
    { id: 'wiring',     label: '配線', color: '#E67E22', icon: 'cable' },
    { id: 'piping',     label: '配管', color: '#3498DB', icon: 'pipe' },
    { id: 'inspection', label: '点検', color: '#27AE60', icon: 'search' },
    { id: 'repair',     label: '修理', color: '#C0392B', icon: 'wrench' },
    { id: 'install',    label: '設置', color: '#9B59B6', icon: 'plus' },
  ],
  
  taskUnits: [
    { value: '箇所', label: '箇所', step: 1 },
    { value: 'm',    label: 'm',    step: 0.5 },
    { value: '基',   label: '基',   step: 1 },
  ],
  
  statuses: [
    { id: 'scheduled',   label: '予定',     color: '#6A737D' },
    { id: 'on_route',    label: '移動中',   color: '#3498DB' },
    { id: 'in_progress', label: '作業中',   color: '#E67E22' },
    { id: 'completed',   label: '完了',     color: '#27AE60' },
    { id: 'follow_up',   label: '要再訪問', color: '#C0392B' },
  ],
  
  sampleData: {
    sites: [
      { name: '○○商事ビル',         status: 'in_progress', work_type: 'inspection' },
      { name: '△△マンション 301',   status: 'completed',   work_type: 'wiring' },
    ],
    workers: [],
    tasks: [],
  },
};
```

### 2.4 業種設定の実例：清掃業

```typescript
// src/config/industries/cleaning.config.ts
export const cleaningConfig: IndustryConfig = {
  id: 'cleaning',
  name: '清掃業',
  description: 'ビル清掃・定期巡回業務に特化',
  
  terminology: {
    site: '物件',
    project: '巡回ルート',
    task: '清掃項目',
    worker: 'スタッフ',
    progress: '達成率',
  },
  
  dashboard: {
    cards: [
      { id: 'today_routes', type: 'metric', title: '本日ルート',
        data_source: 'routes.today.count', label_unit: 'ルート' },
      { id: 'sites_visited', type: 'metric', title: '巡回完了',
        data_source: 'sites.today.visited', label_unit: '物件', color: '#27AE60' },
      { id: 'sites_pending', type: 'metric', title: '未完了',
        data_source: 'sites.today.pending', label_unit: '物件', color: '#E67E22' },
      { id: 'checklist_avg', type: 'gauge', title: 'チェック達成率',
        data_source: 'checklists.avg', label_unit: '%' },
    ],
    charts: [
      { id: 'sites_by_status', type: 'pie',
        title: '物件別ステータス', data_source: 'sites.by_status' },
    ],
    layout: 'grid_4',
  },
  
  reportCategories: [
    { id: 'before',      label: '清掃前',   color: '#6A737D', icon: 'circle' },
    { id: 'in_progress', label: '清掃中',   color: '#E67E22', icon: 'tool' },
    { id: 'after',       label: '清掃後',   color: '#27AE60', icon: 'check' },
    { id: 'issue',       label: '不具合',   color: '#C0392B', icon: 'alert' },
    { id: 'restock',     label: '備品補充', color: '#3498DB', icon: 'box' },
  ],
  
  taskUnits: [],
  statuses: [],
  sampleData: { sites: [], workers: [], tasks: [] },
};
```

### 2.5 業種設定の実例：内装業

```typescript
// src/config/industries/interior.config.ts
export const interiorConfig: IndustryConfig = {
  id: 'interior',
  name: '内装業',
  description: '内装仕上げ工事・リフォーム業務に特化',
  
  terminology: {
    site: '現場',
    project: '案件',
    task: '工程',
    worker: '職人',
    progress: '工程進捗',
  },
  
  dashboard: {
    cards: [
      { id: 'phase_in_progress', type: 'metric', title: '進行中工程',
        data_source: 'phases.in_progress.count', label_unit: '件' },
      { id: 'phase_completed_today', type: 'metric', title: '本日完了',
        data_source: 'phases.completed_today.count', label_unit: '工程', color: '#27AE60' },
      { id: 'avg_progress', type: 'gauge', title: '全体平均進捗',
        data_source: 'sites.avg_progress', label_unit: '%' },
      { id: 'today_workers', type: 'metric', title: '今日の入場者',
        data_source: 'workers.today.count', label_unit: '人' },
    ],
    charts: [
      { id: 'progress_by_phase', type: 'horizontal_bar',
        title: '工程別 進捗率', data_source: 'phases.progress' },
    ],
    layout: 'grid_4',
  },
  
  reportCategories: [
    { id: 'demo',    label: '解体',     color: '#C0392B', icon: 'minus' },
    { id: 'frame',   label: '下地',     color: '#E67E22', icon: 'square' },
    { id: 'finish',  label: '仕上げ',   color: '#27AE60', icon: 'star' },
    { id: 'cleanup', label: '清掃',     color: '#3498DB', icon: 'broom' },
    { id: 'final',   label: '最終確認', color: '#9B59B6', icon: 'check' },
  ],
  
  taskUnits: [],
  statuses: [],
  sampleData: { sites: [], workers: [], tasks: [] },
};
```

---

## 3. デモサイトの実装方針

### 3.1 URL構造

```
business-demo.example.com/
  /                        ランディングページ
  /demo/general            建設一般デモ（既存ベース）
  /demo/scaffolding        足場業デモ
  /demo/electrical         電気工事デモ
  /demo/cleaning           清掃業デモ
  /demo/interior           内装業デモ
  /admin/_demo_switch      業種切替（管理者用）
```

### 3.2 業種切替の仕組み

```typescript
// src/middleware.ts
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  const demoMatch = path.match(/^\/demo\/([^\/]+)/);
  if (demoMatch) {
    const industryId = demoMatch[1];
    const response = NextResponse.next();
    response.cookies.set('demo_industry', industryId, {
      maxAge: 60 * 60 * 24,
    });
    return response;
  }
  
  return NextResponse.next();
}
```

```typescript
// src/lib/industry/context.ts
import { cookies } from 'next/headers';
import { allIndustryConfigs } from '@/config/industries';

export async function getCurrentIndustry(): Promise<IndustryConfig> {
  const cookieStore = await cookies();
  const industryId = cookieStore.get('demo_industry')?.value ?? 'general';
  return allIndustryConfigs[industryId] ?? allIndustryConfigs.general;
}
```

### 3.3 ダッシュボードのカード描画

```typescript
// src/app/demo/[industry]/page.tsx
import { getCurrentIndustry } from '@/lib/industry/context';
import { CardRenderer } from '@/components/dashboard/CardRenderer';
import { ChartRenderer } from '@/components/dashboard/ChartRenderer';

export default async function DemoIndustryDashboard() {
  const industry = await getCurrentIndustry();
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">
          {industry.name} ダッシュボード
        </h1>
        <p className="text-zinc-600">{industry.description}</p>
      </header>
      
      <div className={`grid gap-4 ${
        industry.dashboard.layout === 'grid_4' ? 'grid-cols-2 md:grid-cols-4' :
        industry.dashboard.layout === 'grid_3' ? 'grid-cols-3' :
        'grid-cols-2'
      }`}>
        {industry.dashboard.cards.map(card => (
          <CardRenderer key={card.id} config={card} industry={industry} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {industry.dashboard.charts.map(chart => (
          <ChartRenderer key={chart.id} config={chart} industry={industry} />
        ))}
      </div>
    </div>
  );
}
```

### 3.4 サンプルデータの動的生成

```typescript
// src/lib/industry/data-resolver.ts
export function resolveDataSource(
  source: string,
  industry: IndustryConfig
): any {
  const data = industry.sampleData;
  
  switch (source) {
    case 'sites.status.setting_up.count':
      return data.sites.filter(s => s.status === 'setting_up').length;
    
    case 'sites.status.completed.count':
      return data.sites.filter(s => s.status === 'completed').length;
    
    case 'workers.today.count':
      return data.workers.length;
    
    case 'sites.progress':
      return data.sites.map(s => ({
        label: s.name,
        value: s.progress,
      }));
    
    default:
      return null;
  }
}
```

---

## 4. ランディングページの設計

### 4.1 LP の構成

```
ヒーロー
  建設業のあらゆる現場を、シンプルに管理。
  GENBA NOTE
  [無料デモを見る]

業種別デモ
  あなたの業種を選んでください
  [足場] [電気] [清掃] [内装] [建設一般]

共通機能
  ・現場の進捗が一目でわかる
  ・職人さんがスマホで簡単投稿
  ・写真と日報が自動で整理
  ・AIで報告書も半自動

こんなお悩みを解決
  「LINEと電話で連絡が混乱」
  「写真がどこにあるかわからない」
  「現場ポケットは多機能すぎて使いこなせない」

料金
  Basic    100〜150万円
  Standard 200〜350万円
  Enterprise 500万円〜
  + 月額 5万円（運用伴走）

導入事例
  山田建設様（仮）の導入で・・

お問い合わせ
  [無料相談する]
```

### 4.2 業種選択カード

```typescript
const industries = [
  {
    id: 'scaffolding',
    name: '足場業',
    description: '仮設・解体の現場管理に',
    icon: '🏗',
    href: '/demo/scaffolding',
    points: ['仮設状況の見える化', '解体スケジュール管理', '安全確認の徹底'],
  },
  {
    id: 'electrical',
    name: '電気工事業',
    description: '巡回・点検業務の効率化に',
    icon: '⚡',
    href: '/demo/electrical',
    points: ['訪問先の管理', '作業種別の集計', '完了報告の自動化'],
  },
  {
    id: 'cleaning',
    name: '清掃業',
    description: 'ビル清掃の品質管理に',
    icon: '🧹',
    href: '/demo/cleaning',
    points: ['チェックリスト管理', 'ルート別進捗', '不具合の早期発見'],
  },
  {
    id: 'interior',
    name: '内装業',
    description: '工程管理と職人さんの調整に',
    icon: '🔨',
    href: '/demo/interior',
    points: ['工程別進捗', '職人さんの配置', '現場別の状況把握'],
  },
  {
    id: 'general',
    name: '建設一般',
    description: 'すべての建設業務に対応',
    icon: '🏠',
    href: '/demo/general',
    points: ['総合的な管理', '柔軟なカスタマイズ', '幅広い対応範囲'],
  },
];
```

---

## 5. 実装スケジュール（2週間）

### Week 1：業種設定の構造化 + データ準備

#### Day 1-2：基盤構築

- [ ] `src/config/industries/` ディレクトリ作成
- [ ] `IndustryConfig` 型定義
- [ ] `general.config.ts` 既存のデフォルト設定を移行
- [ ] `getCurrentIndustry()` 関数実装
- [ ] middleware で業種cookie制御

#### Day 3-4：4業種の設定ファイル作成

- [ ] `scaffolding.config.ts`（足場）
- [ ] `electrical.config.ts`（電気工事）
- [ ] `cleaning.config.ts`（清掃）
- [ ] `interior.config.ts`（内装）

各業種について：
- 用語のカスタマイズ
- カード4枚
- グラフ2個
- レポートカテゴリ5個
- サンプルデータ（現場5件、作業員5人、タスク10件）

#### Day 5：レンダリング層

- [ ] `CardRenderer` コンポーネント
- [ ] `ChartRenderer` コンポーネント
- [ ] `data-resolver.ts` 実装
- [ ] 既存のダッシュボードを設定駆動に変更

### Week 2：デモサイト構築 + LP

#### Day 6-7：業種別デモページ

- [ ] `/demo/[industry]/` ルーティング
- [ ] 各業種のダッシュボード動作確認
- [ ] 各業種でワーカー画面・監督画面も切替
- [ ] 業種切替UI（ヘッダーに「業種を変える」ボタン）

#### Day 8-9：ランディングページ

- [ ] `/`（トップページ）デザイン・実装
- [ ] ヒーローセクション
- [ ] 業種選択カード
- [ ] 機能紹介セクション
- [ ] 料金セクション
- [ ] お問い合わせフォーム

#### Day 10：仕上げ

- [ ] レスポンシブ対応確認
- [ ] OGP画像作成（業種別5枚）
- [ ] 導入事例ページ
- [ ] デモ動画埋込（既存の4本を活用）
- [ ] 独自ドメイン設定
- [ ] Google Analytics 設定
- [ ] お問い合わせフォームのメール通知接続

---

## 6. 既存コードの分離戦略

### 6.1 「実データ運用」と「デモ展示」を共存させる

```
src/app/
├── (app)/                    実データ運用（パイロット企業向け）
│   ├── /m/worker/*
│   ├── /m/supervisor/*
│   └── /admin/*
│
├── (demo)/                   デモ展示（営業ツール）
│   ├── /demo/[industry]/*
│   └── /(landing)/*           LP
│
└── api/                      共通API
```

### 6.2 デモモードの判定

```typescript
// src/lib/mode.ts
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_APP_MODE === 'demo' ||
         (typeof window !== 'undefined' && 
          window.location.pathname.startsWith('/demo/'));
}
```

### 6.3 デプロイ方針

**選択肢A：1つの Vercel プロジェクトで両方ホスト**
- メリット：管理が楽、コード共有が完璧
- デメリット：本番URLとデモURLが同じドメイン

**選択肢B：2つの Vercel プロジェクトで分離**
- メリット：独立性が高い、ドメイン管理が綺麗
- デメリット：デプロイ作業が2倍

**推奨：選択肢A** + サブドメインで分離
- `app.example.com` → 実運用
- `demo.example.com` → デモサイト
- middleware でドメインを判別して分岐

---

## 7. 営業利用の流れ

### 7.1 商談での使い方

```
1. 商談前
   - 相手の業種を聞く（足場 / 電気工事 等）
   - 該当する /demo/{industry}/ のURLを準備

2. 商談中
   - 「御社の業種だとこんな画面になります」
   - スマホで実際の操作を見せる
   - 業種を切り替えて「他の業種でも対応可能」をアピール

3. 商談後
   - LPのURLとデモURLをメール
   - 1週間以内にフォロー
```

### 7.2 想定される質問と回答

| 質問 | 回答 |
|------|------|
| 「うちの業種は対応してますか？」 | 「はい、御社は○○業種なので /demo/○○ でご確認ください。さらに細かい調整は可能です」 |
| 「カードや項目を変えられますか？」 | 「はい、業種設定を変えるだけで全画面が連動して変わります。デモ画面でお見せします」 |
| 「料金は？」 | 「Basic 100〜150万円、Standard 200〜350万円。御社の規模感ですと△△が向いています」 |
| 「現場ポケットとどう違うの？」 | 「現場ポケットは1社向けの汎用パッケージ。弊社は御社業種に特化した設計＋運用伴走付きです」 |

### 7.3 LPからの問合せ獲得

```
LP訪問 → デモ閲覧 → 問合せ
  ↓
自動メール（24時間以内に返信）
  ↓
Zoom 30分（ヒアリング）
  ↓
個別カスタマイズ提案
  ↓
契約
```

---

## 8. 拡張ロードマップ

### Phase 1（今）：C案 = 業種別デモサイト
- 設定JSONで業種切替
- 5業種のデモを公開
- 営業ツールとして活用

### Phase 2（3〜6ヶ月後）：B案 = ノーコードカスタマイズ
契約獲得が増えてきたら：
- 顧客が自分で業種設定を編集できる管理画面
- カードの追加・削除をGUIで
- タグ・色・項目をブラウザで編集

### Phase 3（半年〜1年後）：A案 = OSSテンプレ
- GitHub テンプレートとして公開
- スターを集めてブランド構築
- カスタマイズ案件を受注する入口に

---

## 9. リスクと対策

| リスク | 対策 |
|--------|------|
| 業種ごとに細かい違いが多すぎる | 「80%対応」を目指す。残20%は商談で「カスタマイズ可能」と訴求 |
| デモが嘘っぽく見える | サンプルデータをリアルに作り込む（実在しそうな現場名・人名） |
| 個別案件のカスタマイズで時間が取られる | 業種設定JSONの編集だけで対応できる範囲に絞る |
| 競合がパクってくる | 「運用伴走」「業種別ノウハウ」で差別化 |

---

## 10. 成功指標（KPI）

### 短期（1ヶ月後）

- [ ] 業種別デモサイト 5ページ完成・公開
- [ ] LP の月間PV 100以上
- [ ] 問合せ 月3件以上

### 中期（3ヶ月後）

- [ ] 商談数 月5件以上
- [ ] 受注 月1件以上
- [ ] 業種ごとの導入実績 各1社以上

### 長期（1年後）

- [ ] 累計受注 12社以上
- [ ] 月額売上 60万円以上（5万円 × 12社）
- [ ] パッケージ販売 5件以上

---

## 11. Cursor への実装指示テンプレ

### Week 1 着手時

```
@業種別デモサイト戦略書_v1.0.md §2-§5 を読み込んで、
業種設定の構造化から実装開始してください。

順序：
1. src/config/industries/types.ts（型定義）
2. src/config/industries/general.config.ts（既存を移行）
3. src/lib/industry/context.ts（業種取得）
4. middleware の業種cookie制御
5. CardRenderer / ChartRenderer 実装
6. 既存ダッシュボードを設定駆動に変更

完了基準：既存の建設一般デモが、業種設定経由で表示される。
```

### Week 1 後半

```
4業種の設定ファイルを作成してください：

- src/config/industries/scaffolding.config.ts
- src/config/industries/electrical.config.ts
- src/config/industries/cleaning.config.ts
- src/config/industries/interior.config.ts

各業種について §2.2〜§2.5 を参考に、
- 用語
- カード4枚
- グラフ2個
- レポートカテゴリ5個
- サンプルデータ

を必ず含めてください。サンプルデータはリアル感を重視し、
実在しそうな会社名・現場名・人名を使ってください。
```

### Week 2 着手時

```
@業種別デモサイト戦略書_v1.0.md §3-§4 に従って、
業種別デモページとLPを実装してください。

優先順位：
1. /demo/[industry]/* のルーティング
2. ランディングページ（/）
3. 業種選択カード
4. お問い合わせフォーム
5. レスポンシブ対応
6. OGP画像（業種別5枚）

完了基準：
- LPから5業種のデモが切替可能
- 各業種のダッシュボードが正しく表示される
- 問合せフォームから自分のメールに通知が届く
```

---

## 12. 完成後の運用イメージ

### 営業フロー

```
業界紙・ウェビナー・SNSで認知獲得
       ↓
LP訪問 → 業種別デモを見る
       ↓
問合せフォーム送信
       ↓
こちらから24時間以内にメール返信
       ↓
Zoom 30分（業種ごとのヒアリング）
       ↓
個別の業種設定をカスタマイズして再提案
       ↓
契約 → 開発 → 運用伴走
```

### 業種拡張の判断基準

- 問合せが業種ごとに月2件以上来たら、その業種を追加
- 既存5業種で50%以上の市場をカバーできるか定期的に確認
- 反応が悪い業種は撤退（リソースを集中）

---

## 13. ドキュメント体系での位置づけ

```
1.  要件定義書 v1.0.docx
2.  機能仕様書 v2.0.md
3.  Cursor指示書 v1.0.md
4.  Claude_Code指示書 v1.0.md
5.  Claude_Code指示書 v2.0.md
6.  実装PLAN v3.0.md
7.  運用準備マスタードキュメント v1.0.md
8.  事業戦略書 v1.0.md
9.  開発スコープ合意書 v1.0.md
10. Cursor実装指示書 v4.0.md
11. 業種別デモサイト戦略書 v1.0.md ← 今ここ
```

事業戦略書（#8）が「**現契約の戦略**」を扱うのに対し、本書は「**事業拡大の戦略**」を扱います。

---

以上