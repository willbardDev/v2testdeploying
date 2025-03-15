import { ContactApp } from '@/components/ContactApp';
import React from 'react';

const ContactAppLayout = ({ children }: { children: React.ReactNode }) => {
  return <ContactApp>{children}</ContactApp>;
};
export default ContactAppLayout;
