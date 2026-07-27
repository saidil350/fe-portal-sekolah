'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { ROLE_DASHBOARD_PATH } from '@/lib/role-dashboard-path';
import { useToast } from '@/components/ui/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/components/card';
import { Button } from '@/components/ui/components/button';
import { Input } from '@/components/ui/components/input';
import { Label } from '@/components/ui/components/label';
import { Separator } from '@/components/ui/components/separator';
import { Role } from '@/types';

const loginSchema = z.object({
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  password: z.string().min(6, { message: 'Kata sandi minimal 6 karakter' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
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

  const fillDemoAccount = (role: Role) => {
    const emailMap: Record<Role, string> = {
      SUPER_ADMIN: 'superadmin@portalsekolah.id',
      ADMIN_IT: 'admin.it@sekolah1.sch.id',
      KEPALA_SEKOLAH: 'kepsek@sekolah1.sch.id',
      GURU: 'guru.budi@sekolah1.sch.id',
      STAFF: 'staff@sekolah1.sch.id',
      SISWA: 'siswa.putra@sekolah1.sch.id',
    };
    setValue('email', emailMap[role]);
    setValue('password', 'Password123');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-full bg-primary p-2.5 text-primary-foreground mb-3">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Portal Sekolah</h1>
          <p className="text-sm text-muted-foreground">SaaS Multi-Tenant Platform</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Selamat Datang</CardTitle>
            <CardDescription>
              Masukkan kredensial akun Anda untuk mengakses dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Alamat Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@school.sch.id"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Menghubungkan...' : 'Masuk ke Sistem'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Separator className="mb-4" />
            <p className="text-xs text-muted-foreground text-center mb-3">
              Simulator Akun Demo (Uji Coba Cepat)
            </p>
            <div className="grid grid-cols-2 gap-2 w-full">
              {(['SISWA', 'GURU', 'KEPALA_SEKOLAH', 'ADMIN_IT'] as Role[]).map((r) => (
                <Button
                  key={r}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => fillDemoAccount(r)}
                  className="font-medium"
                >
                  {r.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
