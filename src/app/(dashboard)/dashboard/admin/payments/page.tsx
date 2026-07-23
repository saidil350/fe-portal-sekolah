"use client";

import React, { useEffect, useState } from 'react';
import { KpiCards, KpiData } from './components/kpi-cards';
import { PaymentCharts, ChartData } from './components/payment-charts';
import { PaymentWidgets, WidgetData } from './components/payment-widgets';
import { apiClient } from '@/lib/api-client';

export default function AdminPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<KpiData>();
  const [chartData, setChartData] = useState<ChartData>();
  const [widgetData, setWidgetData] = useState<WidgetData>();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        // Fetch real data from backend API endpoints
        const [summaryRes, invoicesRes] = await Promise.all([
          apiClient.get<any>(`/admin/payments/summary`),
          apiClient.get<any>(`/admin/payments/invoices`)
        ]);

        if (summaryRes.success && summaryRes.data) {
          const { kpiData: apiKpi, chartData: apiChart, widgetData: apiWidget } = summaryRes.data;

          if (apiKpi) {
            setKpiData(apiKpi);
          }

          if (apiChart) {
            setChartData(apiChart);
          }

          const invoicesList = invoicesRes.success && Array.isArray(invoicesRes.data) ? invoicesRes.data : [];
          setWidgetData({
            recentInvoices: invoicesList,
            outstandingInvoices: apiWidget?.outstandingInvoices || [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch payment dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Pembayaran</h2>
          <p className="text-muted-foreground mt-1">
            Pantau arus kas SPP, performa metode pembayaran, dan tagihan aktif.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <KpiCards loading={loading} data={kpiData} />
        <PaymentCharts loading={loading} data={chartData} />
        <PaymentWidgets loading={loading} data={widgetData} />
      </div>
    </div>
  );
}

