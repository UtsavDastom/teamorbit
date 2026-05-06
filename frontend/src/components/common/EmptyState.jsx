export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-orbit-muted flex items-center justify-center text-orbit-sub mb-4">
        {icon}
      </div>
      <h3 className="text-orbit-text font-semibold mb-1">{title}</h3>
      <p className="text-orbit-sub text-sm mb-4 max-w-xs">{description}</p>
      {action}
    </div>
  );
}
