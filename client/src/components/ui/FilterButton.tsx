import { LucideIcon } from 'lucide-react';

interface FilterButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function FilterButton({ icon: Icon, label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-4 rounded-lg transition-colors ${
        isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-6 w-6 mr-2" />
      <span>{label}</span>
    </button>
  );
}