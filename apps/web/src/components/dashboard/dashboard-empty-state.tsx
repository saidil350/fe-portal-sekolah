import { SearchX } from 'lucide-react';
import { Card, CardContent } from '@portal-sekolah/ui';

export function DashboardEmptyState({
  title = 'Tidak ada data',
  description = 'Coba ubah kata kunci pencarian atau filter yang aktif.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex min-h-40 flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="rounded-lg border bg-background p-3 text-muted-foreground">
          <SearchX className="size-5" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
