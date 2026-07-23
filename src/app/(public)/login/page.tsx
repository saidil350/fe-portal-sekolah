'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { ROLE_DASHBOARD_PATH } from '@/lib/role-dashboard-path';
import { FormInput, FormSelect, Button, Card, CardHeader, CardContent, CardTitle, CardDescription, useToast } from '@/components/ui';
import { Role } from '@/types';

// Zod login schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  password: z.string().min(6, { message: 'Kata sandi minimal 6 karakter' }),
  role: z.custom<Role>(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'SISWA',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const sess = await login({
        email: data.email,
        password: data.password,
      });

      toast({
        title: 'Masuk Berhasil!',
        description: `Selamat datang kembali, ${sess.user.name}.`,
      });

      router.push(ROLE_DASHBOARD_PATH[sess.user.role]);
    } catch (e: any) {
      toast({
        title: 'Gagal Masuk',
        description: e.message || 'Periksa kembali email dan kata sandi Anda.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper pengisian demo cepat untuk testing
  const fillDemoAccount = (role: Role) => {
    const emailMap: Record<Role, string> = {
      SUPER_ADMIN: 'superadmin@portalsekolah.id',
      ADMIN_IT: 'admin.it@sekolah1.sch.id',
      KEPALA_SEKOLAH: 'kepsek@sekolah1.sch.id',
      GURU: 'guru.budi@sekolah1.sch.id',
      STAFF: 'staff.keuangan@sekolah1.sch.id',
      SISWA: 'siswa.putra@sekolah1.sch.id',
    };
    methods.setValue('email', emailMap[role]);
    methods.setValue('password', 'Password123');
    methods.setValue('role', role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        {/* Brand logo header */}
        <div className="flex flex-col items-center mb-8 select-none">
          <div className="p-3.5 bg-primary/10 rounded-2xl mb-3 border border-primary/20 shadow-inner">
            <GraduationCap className="h-10 w-10 text-primary animate-bounce" />
          </div>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            Portal Sekolah
          </h2>
          <p className="text-xs text-muted-foreground font-semibold tracking-wider uppercase mt-1">
            SaaS Multi-Tenant SaaS Platform
          </p>
        </div>

        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-bold">Selamat Datang</CardTitle>
            <CardDescription className="font-medium text-xs">
              Masukkan kredensial akun Anda untuk mengakses dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                  name="email"
                  label="Alamat Email"
                  placeholder="name@school.sch.id"
                  type="email"
                  required
                />
                
                <FormInput
                  name="password"
                  label="Kata Sandi"
                  placeholder="••••••••"
                  type="password"
                  required
                />

                <FormSelect
                  name="role"
                  label="Pilih Peran Akun"
                  options={[
                    { label: 'Siswa / Murid', value: 'SISWA' },
                    { label: 'Guru / Pengajar', value: 'GURU' },
                    { label: 'Staff Administrasi', value: 'STAFF' },
                    { label: 'Kepala Sekolah', value: 'KEPALA_SEKOLAH' },
                    { label: 'Admin IT Sekolah', value: 'ADMIN_IT' },
                    { label: 'Super Admin Platform', value: 'SUPER_ADMIN' },
                  ]}
                />

                <Button type="submit" className="w-full rounded-xl py-6 font-bold shadow-lg shadow-primary/25 mt-2" disabled={isLoading}>
                  {isLoading ? 'Menghubungkan...' : 'Masuk ke Sistem'}
                </Button>
              </form>
            </FormProvider>

            {/* DEMO ACCOUNTS QUICK FILL (Premium feature) */}
            <div className="mt-8 pt-6 border-t">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-3 text-center">
                Simulator Akun Demo (Uji Coba Cepat)
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                {(['SISWA', 'GURU', 'STAFF', 'KEPALA_SEKOLAH', 'ADMIN_IT', 'SUPER_ADMIN'] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => fillDemoAccount(r)}
                    className="py-2 px-1 border border-border/80 rounded-lg bg-background hover:bg-primary hover:text-white hover:border-primary transition-all font-semibold uppercase text-center truncate"
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
