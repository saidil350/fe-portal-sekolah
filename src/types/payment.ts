import { BaseEntity } from './entities';

export type PaymentStatus = 'UNPAID' | 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';

export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  description: string;
}

export interface Payment extends BaseEntity {
  invoiceId: string;
  amount: number;
  paymentMethod: 'QRIS' | 'BANK_TRANSFER';
  paidAt: string;
  referenceNumber: string;
}

export interface QrisData {
  qrCodeString: string;
  invoiceId: string;
  amount: number;
  expiresAt: string;
}
