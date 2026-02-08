import Breadcrumb from '@/components/Breadcrumb';
import LoginHistoryDatatables from '@/components/defaults/LoginHistory/login-history-datatables';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Login History Admin',
};
const breadcrumbItems = [
    { title: "Home", href: '/dashboard' },
    { title: 'Login History', href: '/loginHistory' },
  ];
const LoginHistory = () => {
    return (
        <div>
        <Breadcrumb items={breadcrumbItems} />
        <LoginHistoryDatatables />
        </div>);
};

export default LoginHistory;
