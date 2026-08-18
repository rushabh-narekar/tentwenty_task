interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-[#E5E5E5] bg-white py-16 text-center">
      <h3 className="text-base font-semibold text-[#1A1A1A]">{title}</h3>
      <p className="max-w-sm text-sm text-[#6B7280]">{description}</p>
      {action}
    </div>
  );
}
