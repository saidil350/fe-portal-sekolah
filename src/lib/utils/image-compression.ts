/**
 * Utility untuk memproses foto profil: kompresi gambar berbasis canvas
 * dan pemuat inisial nama secara dinamis.
 */

export async function compressImage(
  file: File,
  maxWidth = 500,
  maxHeight = 500,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = (err) => reject(err);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Gagal menginisialisasi konteks 2D canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to Data URL (JPEG format)
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Mendapatkan 1 atau 2 huruf inisial dari nama pengguna.
 * Contoh: "Rian Hidayat" -> "RH", "Budi" -> "BU", "Ahmad Nur Fauzi" -> "AN"
 */
export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return 'US';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'US';
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
