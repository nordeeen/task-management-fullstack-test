import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from './BtnCustom';

type DeleteConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
};

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = 'Hapus Tugas',
  description = 'Apakah anda yakin ingin menghapus tugas ini secara permanen?',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#13131f] border border-white/8 rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-11 h-11 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            disabled={loading}
            variant="secondary"
            className="flex-1 cursor-pointer">
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            variant="danger"
            className="flex-1 cursor-pointer">
            {loading ? 'Menghapus...' : 'Ya, Hapus'}
          </Button>
        </div>
      </div>
    </div>
  );
};
