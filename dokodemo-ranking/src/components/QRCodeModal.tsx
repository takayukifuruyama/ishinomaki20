'use client';

import { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';
import QRCode from 'qrcode';
import type { Entry } from '@/types';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: Entry;
}

export function QRCodeModal({ isOpen, onClose, entry }: QRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && entry) {
      // QRコードに含めるURL（実際の実装ではJWTトークンを使用）
      const qrData = `${typeof window !== 'undefined' ? window.location.origin : ''}/qr/approve/${entry.id}`;
      QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      }).then(setQrDataUrl);
    }
  }, [isOpen, entry]);

  if (!isOpen) return null;

  const approvalCount = entry.approvals.length;
  const progressPercent = Math.min((approvalCount / 3) * 100, 100);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold">QR承認</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 text-center">
          {entry.isVerified ? (
            <div className="py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={40} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-2">認証完了!</h3>
              <p className="text-gray-600">このエントリーは認証済みです</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 inline-block rounded-xl shadow-lg mb-4">
                {qrDataUrl && (
                  <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
                )}
              </div>

              <p className="text-gray-600 mb-6">
                このQRを知り合いに見せて
                <br />
                スキャンしてもらいましょう
              </p>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>承認状況</span>
                  <span>{approvalCount}/3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {entry.approvals.map((approval) => (
                  <div
                    key={approval.id}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check size={16} className="text-green-600" />
                    <span>{approval.approver.name}（承認済み）</span>
                  </div>
                ))}
                {Array.from({ length: 3 - approvalCount }).map((_, i) => (
                  <div
                    key={`pending-${i}`}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    <span>未承認</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-blue-600 mt-4">
                あと{3 - approvalCount}名の承認で認証済みに！
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
