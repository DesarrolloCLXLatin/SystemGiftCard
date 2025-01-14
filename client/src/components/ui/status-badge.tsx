import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: 'active' | 'disabled';
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles = {
    active: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
    disabled: 'bg-rose-100 text-rose-800 hover:bg-rose-200'
  };

  return (
    <Badge variant="outline" className={`beneficiaries-status-badge ${styles[status]}`}>
      {status === 'active' ? 'Activo' : 'Deshabilitado'}
    </Badge>
  );
};

export default StatusBadge;
