// Types for どこでもランキング

export type Category =
  | 'GOURMET'    // グルメ
  | 'SPORTS'     // スポーツ
  | 'HOBBY'      // 趣味
  | 'DISCOVERY'  // 発掘
  | 'CHALLENGE'  // チャレンジ
  | 'OTHER';     // その他

export type RankingStatus =
  | 'ACTIVE'     // 開催中
  | 'CLOSED'     // 終了
  | 'SUSPENDED'  // 停止中
  | 'DELETED';   // 削除済み

export type Medal = 'GOLD' | 'SILVER' | 'BRONZE' | null;

export type ReportReason =
  | 'INAPPROPRIATE'  // 不適切な内容
  | 'SPAM'           // スパム
  | 'FAKE'           // 虚偽
  | 'HARASSMENT'     // 誹謗中傷
  | 'OTHER';         // その他

export type ReportStatus =
  | 'PENDING'    // 審査待ち
  | 'REVIEWING'  // 審査中
  | 'RESOLVED'   // 解決済み
  | 'DISMISSED'; // 却下

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ranking {
  id: string;
  title: string;
  description?: string;
  rules: string;
  category: Category;
  area: string;          // 市区町村名
  prefecture: string;    // 都道府県名
  deadline?: string;
  status: RankingStatus;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator: User;
  entries: Entry[];
}

export interface Entry {
  id: string;
  score: string;         // スコア（形式はランキングによる）
  scoreValue?: number;   // ソート用の数値変換値
  evidenceUrl: string;   // エビデンス画像/動画URL
  comment?: string;
  isVerified: boolean;
  rank?: number;
  medal: Medal;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: User;
  rankingId: string;
  approvals: QRApproval[];
}

export interface QRApproval {
  id: string;
  createdAt: string;
  entryId: string;
  approverId: string;
  approver: User;
  recipientId: string;
}

export interface Report {
  id: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
  reporterId: string;
  rankingId: string;
}

// カテゴリ表示名
export const CategoryLabels: Record<Category, string> = {
  GOURMET: 'グルメ',
  SPORTS: 'スポーツ',
  HOBBY: '趣味',
  DISCOVERY: '発掘',
  CHALLENGE: 'チャレンジ',
  OTHER: 'その他',
};

// カテゴリアイコン
export const CategoryIcons: Record<Category, string> = {
  GOURMET: '🍜',
  SPORTS: '⚽',
  HOBBY: '🎨',
  DISCOVERY: '🔍',
  CHALLENGE: '🏆',
  OTHER: '📌',
};
