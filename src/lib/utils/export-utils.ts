import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (data: any[], filename: string = 'Laporan_Pembayaran') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  // Create buffer and trigger download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = (
  headers: string[], 
  data: any[][], 
  title: string = 'Laporan Pembayaran SPP',
  filename: string = 'Laporan_Pembayaran'
) => {
  const doc = new jsPDF('landscape');
  
  // Add Title
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleString('id-ID')}`, 14, 28);

  // Add Table
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  doc.save(`${filename}.pdf`);
};

export const downloadReceipt = (payment: any) => {
  const doc = new jsPDF('portrait', 'mm', 'a5');
  
  doc.setFontSize(18);
  doc.text('KUITANSI PEMBAYARAN', 10, 20);
  
  doc.setFontSize(10);
  doc.text(`No. Order: ${payment.orderId || '-'}`, 10, 30);
  doc.text(`Tanggal: ${payment.paidAt ? new Date(payment.paidAt).toLocaleString('id-ID') : '-'}`, 10, 35);
  doc.text(`Status: ${payment.status || 'PENDING'}`, 10, 40);

  doc.line(10, 45, 138, 45);

  doc.text('Diterima Dari:', 10, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(payment.studentName || 'Siswa', 10, 60);
  doc.setFont('helvetica', 'normal');

  doc.text('Untuk Pembayaran:', 10, 75);
  doc.setFont('helvetica', 'bold');
  doc.text(`SPP Bulan ${payment.invoiceMonth || '-'} Tahun ${payment.invoiceYear || '-'}`, 10, 80);
  doc.setFont('helvetica', 'normal');

  doc.text('Metode Pembayaran:', 10, 95);
  doc.setFont('helvetica', 'bold');
  doc.text(payment.paymentMethod || '-', 10, 100);
  doc.setFont('helvetica', 'normal');

  doc.line(10, 110, 138, 110);

  doc.setFontSize(12);
  doc.text('TOTAL:', 10, 125);
  
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(formatter.format(payment.amount || 0), 10, 135);

  doc.save(`Kuitansi_${payment.orderId || 'SPP'}.pdf`);
};
