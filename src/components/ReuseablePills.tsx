
import { motion } from 'framer-motion';

interface IPillItem<T> {
  label: string;
  value: T;
}

interface IPillsProps<T> {
  pillsItems: IPillItem<T>[];
  activePill: T;
  onSelectPill: (value: T) => void;
}

export default function ReusablePills<T extends string | number>({
  pillsItems,
  activePill,
  onSelectPill,
}: IPillsProps<T>) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
      {pillsItems.map((pill, i) => {
        const isActive = pill.value === activePill;
        return (
          <motion.button
            key={String(pill.value)}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25, ease: 'easeOut' }}
            onClick={() => onSelectPill(pill.value)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm border border-green-400 whitespace-nowrap select-none
              ${
                isActive
                  ? 'text-white border-transparent font-medium'
                  : 'bg-transparent text-slate-500 border-slate-200 hover:border-[#3B6D11]/30'
              }`}
            style={isActive ? { backgroundColor: '#3B6D11' } : undefined}
          >
            {pill.label}
          </motion.button>
        );
      })}
    </div>
  );
}