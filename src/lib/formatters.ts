/**
 * Utility pemformat ID dan UUID untuk lapisan antarmuka pengguna (UI).
 * Bertujuan menyembunyikan UUID mentah database dari pengguna akhir.
 */

/**
 * Memeriksa apakah string merupakan format UUID v4 / 36 karakter (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
 */
export function isUuid(value?: string | null): boolean {
  if (!value) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value.trim());
}

/**
 * Memformat string ID/UUID menjadi kode referensi yang ramah pengguna.
 * Jika `rawId` adalah UUID, diambil 8 karakter pertama dengan huruf kapital.
 * Contoh: "550e8400-e29b-41d4-a716-446655440000" -> "INV-550E8400"
 */
export function formatDisplayId(rawId?: string | null, prefix = 'REF'): string {
  if (!rawId) return '-';
  
  const cleanId = rawId.trim();
  if (isUuid(cleanId)) {
    const shortHash = cleanId.split('-')[0].toUpperCase();
    return prefix ? `${prefix}-${shortHash}` : shortHash;
  }

  // Jika bukan UUID (misal sudah angka pendek / kode khusus), kembalikan langsung
  return cleanId;
}

/**
 * Mendapatkan Nomor Invoice / Kode Referensi Tagihan yang ramah pengguna.
 * Memprioritaskan `invoiceNumber` resmi, atau mengonversi UUID menjadi kode referensi resmi.
 */
export function getReadableInvoiceRef(item: { invoiceNumber?: string; id?: string; month?: string } | null | undefined): string {
  if (!item) return '-';
  if (item.invoiceNumber && item.invoiceNumber.trim() !== '') {
    return item.invoiceNumber;
  }
  if (item.id) {
    const monthPrefix = item.month ? item.month.toString().padStart(2, '0') : '';
    const shortRef = item.id.split('-')[0].toUpperCase();
    return monthPrefix ? `INV/${monthPrefix}/${shortRef}` : `INV-${shortRef}`;
  }
  return '-';
}
