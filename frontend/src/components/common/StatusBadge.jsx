export default function StatusBadge({ status }) {
  const config = {
    pending:     { label: 'Pending',     classes: 'bg-orbit-yellow/10 text-orbit-yellow border border-orbit-yellow/20' },
    'in-progress': { label: 'In Progress', classes: 'bg-orbit-blue/10 text-orbit-blue border border-orbit-blue/20' },
    completed:   { label: 'Completed',   classes: 'bg-orbit-green/10 text-orbit-green border border-orbit-green/20' },
    active:      { label: 'Active',      classes: 'bg-orbit-green/10 text-orbit-green border border-orbit-green/20' },
    'on-hold':   { label: 'On Hold',     classes: 'bg-orbit-yellow/10 text-orbit-yellow border border-orbit-yellow/20' },
    archived:    { label: 'Archived',    classes: 'bg-orbit-muted/50 text-orbit-sub border border-orbit-border' },
  };
  const { label, classes } = config[status] || { label: status, classes: 'bg-orbit-muted text-orbit-sub' };
  return <span className={`orbit-badge ${classes}`}>{label}</span>;
}

export function PriorityBadge({ priority }) {
  const config = {
    low:    { label: 'Low',    classes: 'bg-orbit-green/10 text-orbit-green border border-orbit-green/20' },
    medium: { label: 'Med',    classes: 'bg-orbit-yellow/10 text-orbit-yellow border border-orbit-yellow/20' },
    high:   { label: 'High',   classes: 'bg-orbit-red/10 text-orbit-red border border-orbit-red/20' },
  };
  const { label, classes } = config[priority] || { label: priority, classes: '' };
  return <span className={`orbit-badge ${classes}`}>{label}</span>;
}
