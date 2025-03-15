import { MailApp } from '@/components/MailApp';
import React from 'react';

export default function MailAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MailApp>{children}</MailApp>;
}
