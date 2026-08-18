interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#6B7280]">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5E5E5] border-t-primary-600"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm">{message}</p>
    </div>
  );
}
