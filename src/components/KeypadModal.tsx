import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Delete, Check } from 'lucide-react';

interface KeypadModalProps {
  title: string;
  initialValue: number;
  unit: string;
  min?: number;
  max?: number;
  allowDecimal?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (val: number) => void;
}

export const KeypadModal: React.FC<KeypadModalProps> = ({
  title,
  initialValue,
  unit,
  min = 1,
  max = 350,
  allowDecimal = true,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [valueStr, setValueStr] = useState<string>(initialValue.toString());

  // Re-sync with the current value each time the keypad opens (the component stays mounted)
  useEffect(() => {
    if (isOpen) setValueStr(initialValue.toString());
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (valueStr.length >= 5) return;
    if (digit === '.') {
      if (!allowDecimal || valueStr.includes('.')) return;
      setValueStr((prev) => (prev === '' ? '0.' : prev + '.'));
    } else {
      if (valueStr === '0') {
        setValueStr(digit);
      } else {
        setValueStr((prev) => prev + digit);
      }
    }
  };

  const handleBackspace = () => {
    setValueStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : ''));
  };

  const handleClear = () => {
    setValueStr('');
  };

  const handleConfirm = () => {
    const parsed = parseFloat(valueStr);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onConfirm(clamped);
    }
    onClose();
  };

  // Portal to <body>: the sticky header's backdrop-filter would otherwise become the
  // containing block for this fixed overlay, clipping it to the header's height.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wider text-slate-300 uppercase">{title}</span>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg active:bg-slate-800 touch-target flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display */}
        <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-3 flex items-baseline justify-end gap-2 shadow-inner">
          <span className="text-3xl font-mono font-bold text-cyan-400">
            {valueStr || '0'}
          </span>
          <span className="text-sm font-semibold text-slate-400">{unit}</span>
        </div>

        {/* Keypad Grid (Touch targets >= 52px) */}
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
            <button
              key={key}
              onClick={() => handleDigit(key)}
              className="h-14 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 active:text-white text-slate-100 font-mono text-2xl font-bold rounded-xl border border-slate-700/60 shadow transition-colors flex items-center justify-center select-none"
            >
              {key}
            </button>
          ))}

          {/* Bottom row */}
          <button
            onClick={() => handleDigit('.')}
            disabled={!allowDecimal}
            className={`h-14 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-slate-100 font-mono text-2xl font-bold rounded-xl border border-slate-700/60 shadow flex items-center justify-center ${
              !allowDecimal ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            .
          </button>

          <button
            onClick={() => handleDigit('0')}
            className="h-14 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 active:text-white text-slate-100 font-mono text-2xl font-bold rounded-xl border border-slate-700/60 shadow flex items-center justify-center select-none"
          >
            0
          </button>

          <button
            onClick={handleBackspace}
            className="h-14 bg-slate-800/80 hover:bg-slate-700 active:bg-red-600 text-slate-300 active:text-white rounded-xl border border-slate-700/60 shadow flex items-center justify-center"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {/* Action row */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={handleClear}
            className="h-12 bg-slate-800 text-slate-400 hover:text-white font-semibold rounded-xl border border-slate-700 flex items-center justify-center"
          >
            Clear
          </button>
          <button
            onClick={handleConfirm}
            className="h-12 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-bold rounded-xl shadow-glow-cyan flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            Set
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
