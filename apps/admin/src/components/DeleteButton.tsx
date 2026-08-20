"use client";

export function DeleteButton({ action, confirmMessage }: { action: () => Promise<void>; confirmMessage: string }) {
  return (
    <button
      onClick={() => {
        if (confirm(confirmMessage)) action();
      }}
      className="text-xs text-red-600 hover:text-red-800"
    >
      Delete
    </button>
  );
}
