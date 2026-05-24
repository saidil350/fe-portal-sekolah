export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    ...options,
  }).format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    timeStyle: 'short',
  }).format(d);
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMins / 600);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 1) return 'Baru saja';
  if (diffInMins < 60) return `${diffInMins} menit yang lalu`;
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  if (diffInDays === 1) return 'Kemarin';
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
  
  return formatDate(d);
}
