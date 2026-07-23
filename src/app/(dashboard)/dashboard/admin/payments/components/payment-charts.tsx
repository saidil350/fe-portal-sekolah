"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

export interface ChartData {
  pendapatanBulanan: any[];
  statusPembayaran: any[];
  metodePembayaran: any[];
  pembayaranKelas: any[];
}

interface PaymentChartsProps {
  loading: boolean;
  data?: ChartData;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const METHOD_COLORS = ['#6366f1', '#06b6d4', '#ec4899', '#8b5cf6'];

export function PaymentCharts({ loading, data }: PaymentChartsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-sm text-sm">
          <p className="font-semibold mb-1">{label || payload[0].name}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">
                {formatter ? formatter(entry.value) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Pendapatan Bulanan</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Skeleton className="w-full h-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <Skeleton className="w-full h-full rounded-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <Skeleton className="w-full h-full rounded-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Pendapatan Bulanan */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Tren Pendapatan Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.pendapatanBulanan} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tickLine={false} axisLine={false} />
                <YAxis 
                  tickFormatter={(value) => `Rp${value / 1000000}M`} 
                  className="text-xs" 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip content={<CustomTooltip formatter={(val: number) => formatCurrency(val)} />} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  name="Pendapatan"
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pembayaran per Kelas */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Tingkat Lunas per Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.pembayaranKelas} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis dataKey="grade" className="text-xs" tickLine={false} axisLine={false} />
                <YAxis className="text-xs" tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip formatter={(val: number) => `${val}%`} />} />
                <Bar dataKey="rate" name="Tingkat Lunas" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Pembayaran */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusPembayaran}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.statusPembayaran.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Metode Pembayaran */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Metode Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.metodePembayaran}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.metodePembayaran.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={METHOD_COLORS[index % METHOD_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
