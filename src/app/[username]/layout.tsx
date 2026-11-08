import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getPublicProfile } from '@/lib/seo/public-profile';

// Validate before this segment's loading boundary can stream an HTTP 200 shell.
export default async function PublicProfileLayout({children, params}: {
  children: ReactNode; params: Promise<{username: string}>;
}) {
  const {username} = await params;
  const profile = await getPublicProfile(username);
  if ((!profile && username.toLowerCase() !== 'massami') || profile?.ativo === false) notFound();
  return <>{children}</>;
}
