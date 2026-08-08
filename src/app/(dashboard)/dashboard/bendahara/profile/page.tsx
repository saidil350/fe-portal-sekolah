'use client';

import * as React from 'react';
import { User, Phone, MapPin, Award, ShieldCheck, Edit3, Camera, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/components/card';
import { Button } from '@/components/ui/components/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar';
import { Badge } from '@/components/ui/components/badge';
import { useAuthStore } from '@/stores/auth-store';
import { getInitials } from '@/lib/utils/image-compression';

export default function BendaharaProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Profil Bendahara Sekolah</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Informasi akun dan hak akses pengelolaan keuangan sekolah.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-primary/20 shadow-md">
              <AvatarImage src={user?.avatarUrl || ''} alt={user?.name || 'Bendahara'} />
              <AvatarFallback className="text-xl sm:text-2xl font-bold bg-primary/10 text-primary">
                {getInitials(user?.name || 'Bendahara Sekolah')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-2 w-full">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">{user?.name || 'Bendahara Sekolah'}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{user?.email}</p>
                </div>
                <Badge variant="outline" className="w-fit">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Bendahara Sekolah
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
