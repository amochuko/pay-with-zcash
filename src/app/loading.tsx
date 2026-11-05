import { Skeleton } from "@/app/ui/skeleton";

export default function LoadingPage() {
  const width = `${Math.floor(Math.random() * 40) + 50}%`;

  return (
    <>
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />

      <Skeleton
        className="min-h-[50vh] max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </>
  );
}
