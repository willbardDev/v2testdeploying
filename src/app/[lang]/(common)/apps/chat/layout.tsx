import { ChatApp } from '@/components/ChatApp';
import React from 'react';

export default function ChatAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatApp>{children}</ChatApp>;
}
