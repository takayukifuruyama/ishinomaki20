'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Ranking, Entry, QRApproval, Category } from '@/types';

interface AppState {
  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Rankings
  rankings: Ranking[];
  setRankings: (rankings: Ranking[]) => void;
  addRanking: (ranking: Ranking) => void;
  updateRanking: (id: string, updates: Partial<Ranking>) => void;
  deleteRanking: (id: string) => void;

  // Entries
  addEntry: (rankingId: string, entry: Entry) => void;
  updateEntry: (rankingId: string, entryId: string, updates: Partial<Entry>) => void;
  deleteEntry: (rankingId: string, entryId: string) => void;

  // QR Approvals
  addApproval: (rankingId: string, entryId: string, approval: QRApproval) => void;

  // Filters
  selectedArea: string | null;
  setSelectedArea: (area: string | null) => void;
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;

  // Users (for mock data)
  users: User[];
  addUser: (user: User) => void;
}

// 初期モックデータ
const initialUsers: User[] = [
  {
    id: 'user1',
    email: 'ramen@example.com',
    name: 'ラーメン太郎',
    avatarUrl: undefined,
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 'user2',
    email: 'master@example.com',
    name: '辛党マスター',
    avatarUrl: undefined,
    createdAt: '2025-07-01T00:00:00Z',
    updatedAt: '2025-07-01T00:00:00Z',
  },
  {
    id: 'user3',
    email: 'challenger@example.com',
    name: 'チャレンジャーK',
    avatarUrl: undefined,
    createdAt: '2025-08-01T00:00:00Z',
    updatedAt: '2025-08-01T00:00:00Z',
  },
  {
    id: 'user4',
    email: 'gekikara@example.com',
    name: '激辛女子',
    avatarUrl: undefined,
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'user5',
    email: 'cafe@example.com',
    name: 'カフェ巡りさん',
    avatarUrl: undefined,
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2025-10-01T00:00:00Z',
  },
];

const initialRankings: Ranking[] = [
  {
    id: 'ranking1',
    title: '名古屋で一番辛いラーメン完食チャレンジ',
    description: '名古屋市内の激辛ラーメン店で完食タイムを競います',
    rules: '対象店舗の激辛ラーメンを完食するまでの時間を計測。ストップウォッチの画面と完食した丼の写真をエビデンスとして提出してください。',
    category: 'GOURMET',
    area: '名古屋市',
    prefecture: '愛知県',
    deadline: '2026-02-28T23:59:59Z',
    status: 'ACTIVE',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-01T00:00:00Z',
    creatorId: 'user1',
    creator: initialUsers[0],
    entries: [
      {
        id: 'entry1',
        score: '3分42秒',
        scoreValue: 222,
        evidenceUrl: '/mock/evidence1.jpg',
        comment: '辛かったけど美味しかった！',
        isVerified: true,
        rank: 1,
        medal: 'GOLD',
        createdAt: '2025-11-15T00:00:00Z',
        updatedAt: '2025-11-15T00:00:00Z',
        userId: 'user2',
        user: initialUsers[1],
        rankingId: 'ranking1',
        approvals: [
          { id: 'approval1', createdAt: '2025-11-16T00:00:00Z', entryId: 'entry1', approverId: 'user1', approver: initialUsers[0], recipientId: 'user2' },
          { id: 'approval2', createdAt: '2025-11-17T00:00:00Z', entryId: 'entry1', approverId: 'user3', approver: initialUsers[2], recipientId: 'user2' },
          { id: 'approval3', createdAt: '2025-11-18T00:00:00Z', entryId: 'entry1', approverId: 'user4', approver: initialUsers[3], recipientId: 'user2' },
        ],
      },
      {
        id: 'entry2',
        score: '4分15秒',
        scoreValue: 255,
        evidenceUrl: '/mock/evidence2.jpg',
        comment: '汗だくでした',
        isVerified: true,
        rank: 2,
        medal: 'SILVER',
        createdAt: '2025-11-20T00:00:00Z',
        updatedAt: '2025-11-20T00:00:00Z',
        userId: 'user3',
        user: initialUsers[2],
        rankingId: 'ranking1',
        approvals: [
          { id: 'approval4', createdAt: '2025-11-21T00:00:00Z', entryId: 'entry2', approverId: 'user1', approver: initialUsers[0], recipientId: 'user3' },
          { id: 'approval5', createdAt: '2025-11-22T00:00:00Z', entryId: 'entry2', approverId: 'user2', approver: initialUsers[1], recipientId: 'user3' },
          { id: 'approval6', createdAt: '2025-11-23T00:00:00Z', entryId: 'entry2', approverId: 'user4', approver: initialUsers[3], recipientId: 'user3' },
        ],
      },
      {
        id: 'entry3',
        score: '5分03秒',
        scoreValue: 303,
        evidenceUrl: '/mock/evidence3.jpg',
        comment: '初挑戦でしたが完食できました！',
        isVerified: false,
        rank: 3,
        medal: 'BRONZE',
        createdAt: '2025-11-25T00:00:00Z',
        updatedAt: '2025-11-25T00:00:00Z',
        userId: 'user4',
        user: initialUsers[3],
        rankingId: 'ranking1',
        approvals: [
          { id: 'approval7', createdAt: '2025-11-26T00:00:00Z', entryId: 'entry3', approverId: 'user1', approver: initialUsers[0], recipientId: 'user4' },
        ],
      },
    ],
  },
  {
    id: 'ranking2',
    title: '栄エリア隠れ家カフェ発掘ランキング',
    description: '栄エリアの隠れ家的なカフェを発掘しよう',
    rules: 'SNSでの「いいね」数で順位を決定。お店の雰囲気が分かる写真と、メニューの写真を投稿してください。',
    category: 'DISCOVERY',
    area: '名古屋市',
    prefecture: '愛知県',
    deadline: '2026-03-31T23:59:59Z',
    status: 'ACTIVE',
    createdAt: '2025-10-15T00:00:00Z',
    updatedAt: '2025-10-15T00:00:00Z',
    creatorId: 'user5',
    creator: initialUsers[4],
    entries: [
      {
        id: 'entry4',
        score: '256いいね',
        scoreValue: 256,
        evidenceUrl: '/mock/evidence4.jpg',
        comment: '路地裏の素敵なカフェを見つけました',
        isVerified: true,
        rank: 1,
        medal: 'GOLD',
        createdAt: '2025-10-20T00:00:00Z',
        updatedAt: '2025-10-20T00:00:00Z',
        userId: 'user1',
        user: initialUsers[0],
        rankingId: 'ranking2',
        approvals: [
          { id: 'approval8', createdAt: '2025-10-21T00:00:00Z', entryId: 'entry4', approverId: 'user5', approver: initialUsers[4], recipientId: 'user1' },
          { id: 'approval9', createdAt: '2025-10-22T00:00:00Z', entryId: 'entry4', approverId: 'user2', approver: initialUsers[1], recipientId: 'user1' },
          { id: 'approval10', createdAt: '2025-10-23T00:00:00Z', entryId: 'entry4', approverId: 'user3', approver: initialUsers[2], recipientId: 'user1' },
        ],
      },
      {
        id: 'entry5',
        score: '198いいね',
        scoreValue: 198,
        evidenceUrl: '/mock/evidence5.jpg',
        comment: '猫がいるカフェ発見！',
        isVerified: true,
        rank: 2,
        medal: 'SILVER',
        createdAt: '2025-10-25T00:00:00Z',
        updatedAt: '2025-10-25T00:00:00Z',
        userId: 'user3',
        user: initialUsers[2],
        rankingId: 'ranking2',
        approvals: [
          { id: 'approval11', createdAt: '2025-10-26T00:00:00Z', entryId: 'entry5', approverId: 'user5', approver: initialUsers[4], recipientId: 'user3' },
          { id: 'approval12', createdAt: '2025-10-27T00:00:00Z', entryId: 'entry5', approverId: 'user1', approver: initialUsers[0], recipientId: 'user3' },
          { id: 'approval13', createdAt: '2025-10-28T00:00:00Z', entryId: 'entry5', approverId: 'user4', approver: initialUsers[3], recipientId: 'user3' },
        ],
      },
    ],
  },
  {
    id: 'ranking3',
    title: '庄内緑地マラソンタイムトライアル',
    description: '庄内緑地公園の外周コース(約2.5km)のタイムを競います',
    rules: 'GPSアプリのスクリーンショットを提出してください。コースは外周1周(約2.5km)です。',
    category: 'SPORTS',
    area: '名古屋市',
    prefecture: '愛知県',
    deadline: '2026-04-30T23:59:59Z',
    status: 'ACTIVE',
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2025-12-01T00:00:00Z',
    creatorId: 'user3',
    creator: initialUsers[2],
    entries: [
      {
        id: 'entry6',
        score: '9分45秒',
        scoreValue: 585,
        evidenceUrl: '/mock/evidence6.jpg',
        comment: '天気が良くて気持ちよく走れました',
        isVerified: true,
        rank: 1,
        medal: 'GOLD',
        createdAt: '2025-12-10T00:00:00Z',
        updatedAt: '2025-12-10T00:00:00Z',
        userId: 'user2',
        user: initialUsers[1],
        rankingId: 'ranking3',
        approvals: [
          { id: 'approval14', createdAt: '2025-12-11T00:00:00Z', entryId: 'entry6', approverId: 'user3', approver: initialUsers[2], recipientId: 'user2' },
          { id: 'approval15', createdAt: '2025-12-12T00:00:00Z', entryId: 'entry6', approverId: 'user1', approver: initialUsers[0], recipientId: 'user2' },
          { id: 'approval16', createdAt: '2025-12-13T00:00:00Z', entryId: 'entry6', approverId: 'user4', approver: initialUsers[3], recipientId: 'user2' },
        ],
      },
    ],
  },
  {
    id: 'ranking4',
    title: '豊田市で見つけた絶景スポット',
    description: '豊田市内の絶景スポットを写真で競います',
    rules: '豊田市内で撮影した風景写真を投稿。「いいね」数で順位を決定します。',
    category: 'HOBBY',
    area: '豊田市',
    prefecture: '愛知県',
    deadline: '2026-05-31T23:59:59Z',
    status: 'ACTIVE',
    createdAt: '2025-12-15T00:00:00Z',
    updatedAt: '2025-12-15T00:00:00Z',
    creatorId: 'user4',
    creator: initialUsers[3],
    entries: [],
  },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      // Rankings
      rankings: initialRankings,
      setRankings: (rankings) => set({ rankings }),
      addRanking: (ranking) =>
        set((state) => ({ rankings: [...state.rankings, ranking] })),
      updateRanking: (id, updates) =>
        set((state) => ({
          rankings: state.rankings.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),
      deleteRanking: (id) =>
        set((state) => ({
          rankings: state.rankings.filter((r) => r.id !== id),
        })),

      // Entries
      addEntry: (rankingId, entry) =>
        set((state) => ({
          rankings: state.rankings.map((r) =>
            r.id === rankingId
              ? { ...r, entries: [...r.entries, entry] }
              : r
          ),
        })),
      updateEntry: (rankingId, entryId, updates) =>
        set((state) => ({
          rankings: state.rankings.map((r) =>
            r.id === rankingId
              ? {
                  ...r,
                  entries: r.entries.map((e) =>
                    e.id === entryId ? { ...e, ...updates } : e
                  ),
                }
              : r
          ),
        })),
      deleteEntry: (rankingId, entryId) =>
        set((state) => ({
          rankings: state.rankings.map((r) =>
            r.id === rankingId
              ? { ...r, entries: r.entries.filter((e) => e.id !== entryId) }
              : r
          ),
        })),

      // QR Approvals
      addApproval: (rankingId, entryId, approval) =>
        set((state) => ({
          rankings: state.rankings.map((r) =>
            r.id === rankingId
              ? {
                  ...r,
                  entries: r.entries.map((e) => {
                    if (e.id !== entryId) return e;
                    const newApprovals = [...e.approvals, approval];
                    const isVerified = newApprovals.length >= 3;
                    return {
                      ...e,
                      approvals: newApprovals,
                      isVerified,
                    };
                  }),
                }
              : r
          ),
        })),

      // Filters
      selectedArea: null,
      setSelectedArea: (area) => set({ selectedArea: area }),
      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      // Users
      users: initialUsers,
      addUser: (user) =>
        set((state) => ({ users: [...state.users, user] })),
    }),
    {
      name: 'dokodemo-ranking-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        rankings: state.rankings,
        users: state.users,
      }),
    }
  )
);
