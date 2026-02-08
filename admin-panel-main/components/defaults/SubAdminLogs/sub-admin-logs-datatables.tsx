'use client';

import { Button, Center, Group, Text, TextInput, Tabs } from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DataTable, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

dayjs.extend(utc);
dayjs.extend(timezone);

const PAGE_SIZE = 10;

interface AdminLogRecord {
  _id: string;
  taskType: string;
  taskDescription: string;
  adminEmail: string;
  createdAt: string;
}

interface LoginHistoryRecord {
  _id: string;
  countryCode: string;
  countryName: string;
  regionName: string;
  ipaddress: string;
  broswername: string;
  ismobile: string;
  os: string;
  status: string;
  createdDate: string;
}

const renderDate = (date: string) => {
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) return 'Invalid Date';
  return parsedDate.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm');
};

const SubAdminLogsDatatables = () => {
  const router = useRouter();
  const { data: adminProfileData } = useSelector((state: IRootState) => state.adminProfile);

  // Admin Logs state
  const [logData, setLogData] = useState<AdminLogRecord[]>([]);
  const [logTotalRecords, setLogTotalRecords] = useState(0);
  const [logPage, setLogPage] = useState(1);
  const [logSortStatus, setLogSortStatus] = useState<DataTableSortStatus<any>>({
    columnAccessor: 'createdAt',
    direction: 'desc',
  });
  const [logFilters, setLogFilters] = useState({
    createdAt: '',
    taskType: '',
    taskDescription: '',
    adminEmail: '',
  });

  // Login History state
  const [loginData, setLoginData] = useState<LoginHistoryRecord[]>([]);
  const [loginTotalRecords, setLoginTotalRecords] = useState(0);
  const [loginPage, setLoginPage] = useState(1);
  const [loginSortStatus, setLoginSortStatus] = useState<DataTableSortStatus<any>>({
    columnAccessor: 'createdDate',
    direction: 'desc',
  });
  const [loginFilters, setLoginFilters] = useState({
    createdDate: '',
    countryName: '',
    ipaddress: '',
    broswername: '',
    status: '',
  });

  // Date range filters
  const [logFromDate, setLogFromDate] = useState('');
  const [logToDate, setLogToDate] = useState('');
  const [loginFromDate, setLoginFromDate] = useState('');
  const [loginToDate, setLoginToDate] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!adminProfileData?._id) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/admin-logs-data?adminId=${adminProfileData._id}&page=1&limit=10000&sortObj=%7B%7D`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const result = response.data.result;
        if (result.logData) {
          setLogData(result.logData);
          setLogTotalRecords(result.logData.length);
        }
        if (result.loginData) {
          setLoginData(result.loginData);
          setLoginTotalRecords(result.loginData.length);
        }
      } else {
        console.error('Failed to load admin logs data.');
      }
    } catch (error) {
      console.error('An error occurred while fetching admin logs data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [router, adminProfileData]);

  // Admin Logs filtering
  const filteredLogData = logData.filter((record) => {
    const createdAt = dayjs(record.createdAt).tz('Asia/Kolkata');
    const from = logFromDate ? dayjs(logFromDate) : null;
    const to = logToDate ? dayjs(logToDate) : null;

    const isInDateRange =
      (!from || createdAt.isSame(from, 'day') || createdAt.isAfter(from, 'day')) &&
      (!to || createdAt.isSame(to, 'day') || createdAt.isBefore(to, 'day'));

    return (
      isInDateRange &&
      (logFilters.createdAt === '' || dayjs(record.createdAt).format('YYYY-MM-DD').includes(logFilters.createdAt)) &&
      (logFilters.taskType === '' || (record.taskType || '').toLowerCase().includes(logFilters.taskType.toLowerCase())) &&
      (logFilters.taskDescription === '' || (record.taskDescription || '').toLowerCase().includes(logFilters.taskDescription.toLowerCase())) &&
      (logFilters.adminEmail === '' || (record.adminEmail || '').toLowerCase().includes(logFilters.adminEmail.toLowerCase()))
    );
  });

  // Login History filtering
  const filteredLoginData = loginData.filter((record) => {
    const createdAt = dayjs(record.createdDate).tz('Asia/Kolkata');
    const from = loginFromDate ? dayjs(loginFromDate) : null;
    const to = loginToDate ? dayjs(loginToDate) : null;

    const isInDateRange =
      (!from || createdAt.isSame(from, 'day') || createdAt.isAfter(from, 'day')) &&
      (!to || createdAt.isSame(to, 'day') || createdAt.isBefore(to, 'day'));

    return (
      isInDateRange &&
      (loginFilters.createdDate === '' || dayjs(record.createdDate).format('YYYY-MM-DD').includes(loginFilters.createdDate)) &&
      (loginFilters.countryName === '' || (record.countryName || '').toLowerCase().includes(loginFilters.countryName.toLowerCase())) &&
      (loginFilters.ipaddress === '' || (record.ipaddress || '').toLowerCase().includes(loginFilters.ipaddress.toLowerCase())) &&
      (loginFilters.broswername === '' || (record.broswername || '').toLowerCase().includes(loginFilters.broswername.toLowerCase())) &&
      (loginFilters.status === '' || (record.status || '').toLowerCase().includes(loginFilters.status.toLowerCase()))
    );
  });

  const handleLogSortChange = (status: DataTableSortStatus<any>) => {
    setLogPage(1);
    setLogSortStatus(status);
    const sortedData = [...filteredLogData].sort((a: any, b: any) => {
      const { columnAccessor, direction } = status;
      if (a[columnAccessor] < b[columnAccessor]) return direction === 'asc' ? -1 : 1;
      if (a[columnAccessor] > b[columnAccessor]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setLogData(sortedData);
  };

  const handleLoginSortChange = (status: DataTableSortStatus<any>) => {
    setLoginPage(1);
    setLoginSortStatus(status);
    const sortedData = [...filteredLoginData].sort((a: any, b: any) => {
      const { columnAccessor, direction } = status;
      if (a[columnAccessor] < b[columnAccessor]) return direction === 'asc' ? -1 : 1;
      if (a[columnAccessor] > b[columnAccessor]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setLoginData(sortedData);
  };

  const paginatedLogData = () => {
    const start = (logPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredLogData ? filteredLogData.slice(start, end) : logData.slice(start, end);
  };

  const paginatedLoginData = () => {
    const start = (loginPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredLoginData ? filteredLoginData.slice(start, end) : loginData.slice(start, end);
  };

  const logColumns: DataTableProps<any>['columns'] = [
    {
      accessor: 'createdAt',
      title: 'Date',
      noWrap: true,
      sortable: true,
      render: (record: any) => renderDate(record.createdAt),
      filter: (
        <TextInput
          placeholder="Filter by date"
          value={logFilters.createdAt}
          onChange={(e) => setLogFilters((prev) => ({ ...prev, createdAt: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'taskType',
      title: 'Task Type',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by task type"
          value={logFilters.taskType}
          onChange={(e) => setLogFilters((prev) => ({ ...prev, taskType: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'taskDescription',
      title: 'Task Description',
      filter: (
        <TextInput
          placeholder="Filter by description"
          value={logFilters.taskDescription}
          onChange={(e) => setLogFilters((prev) => ({ ...prev, taskDescription: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'adminEmail',
      title: 'Admin Email',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by email"
          value={logFilters.adminEmail}
          onChange={(e) => setLogFilters((prev) => ({ ...prev, adminEmail: e.currentTarget?.value || '' }))}
        />
      ),
    },
  ];

  const loginColumns: DataTableProps<any>['columns'] = [
    {
      accessor: 'createdDate',
      title: 'Date',
      noWrap: true,
      sortable: true,
      render: (record: any) => renderDate(record.createdDate),
      filter: (
        <TextInput
          placeholder="Filter by date"
          value={loginFilters.createdDate}
          onChange={(e) => setLoginFilters((prev) => ({ ...prev, createdDate: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'countryName',
      title: 'Country',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by country"
          value={loginFilters.countryName}
          onChange={(e) => setLoginFilters((prev) => ({ ...prev, countryName: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'ipaddress',
      title: 'IP Address',
      filter: (
        <TextInput
          placeholder="Filter by IP"
          value={loginFilters.ipaddress}
          onChange={(e) => setLoginFilters((prev) => ({ ...prev, ipaddress: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'broswername',
      title: 'Browser',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by browser"
          value={loginFilters.broswername}
          onChange={(e) => setLoginFilters((prev) => ({ ...prev, broswername: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'status',
      title: 'Status',
      sortable: true,
      render: (record: any) => (
        <Button
          variant="filled"
          color={record.status === 'Success' ? 'green' : 'red'}
          className="text-xs cursor-auto"
          size="xs"
        >
          {record.status || 'Unknown'}
        </Button>
      ),
      filter: (
        <TextInput
          placeholder="Filter by status"
          value={loginFilters.status}
          onChange={(e) => setLoginFilters((prev) => ({ ...prev, status: e.currentTarget?.value || '' }))}
        />
      ),
    },
  ];

  return (
    <Tabs defaultValue="admin-logs">
      <Tabs.List>
        <Tabs.Tab value="admin-logs">Admin Logs</Tabs.Tab>
        <Tabs.Tab value="login-history">Login History</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="admin-logs" pt="md">
        {logData.length > 0 && (
          <Group mb="md" className="my-4">
            <div className="flex flex-row items-center gap-2">
              <label className="text-gray-700 mt-1 text-sm font-semibold">From Date</label>
              <TextInput
                type="date"
                value={logFromDate}
                onChange={(e) => setLogFromDate(e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <label className="text-gray-700 mt-1 text-sm font-semibold">To Date</label>
              <TextInput
                type="date"
                value={logToDate}
                onChange={(e) => setLogToDate(e.currentTarget.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setLogFromDate('');
                setLogToDate('');
                setLogFilters({
                  createdAt: '',
                  taskType: '',
                  taskDescription: '',
                  adminEmail: '',
                });
              }}
            >
              Clear Filters
            </Button>
          </Group>
        )}
        {logData.length > 0 ? (
          <DataTable
            columns={logColumns}
            records={paginatedLogData()}
            totalRecords={logTotalRecords}
            fetching={false}
            page={logPage}
            onPageChange={setLogPage}
            recordsPerPage={PAGE_SIZE}
            sortStatus={logSortStatus}
            onSortStatusChange={handleLogSortChange}
            withTableBorder
            withColumnBorders
            withRowBorders
            borderRadius="sm"
            shadow="sm"
            minHeight={filteredLogData.length === 0 ? 300 : 0}
          />
        ) : (
          <Center className="h-[300px] flex justify-center items-center">
            <Text>No admin logs found</Text>
          </Center>
        )}
      </Tabs.Panel>

      <Tabs.Panel value="login-history" pt="md">
        {loginData.length > 0 && (
          <Group mb="md" className="my-4">
            <div className="flex flex-row items-center gap-2">
              <label className="text-gray-700 mt-1 text-sm font-semibold">From Date</label>
              <TextInput
                type="date"
                value={loginFromDate}
                onChange={(e) => setLoginFromDate(e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <label className="text-gray-700 mt-1 text-sm font-semibold">To Date</label>
              <TextInput
                type="date"
                value={loginToDate}
                onChange={(e) => setLoginToDate(e.currentTarget.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setLoginFromDate('');
                setLoginToDate('');
                setLoginFilters({
                  createdDate: '',
                  countryName: '',
                  ipaddress: '',
                  broswername: '',
                  status: '',
                });
              }}
            >
              Clear Filters
            </Button>
          </Group>
        )}
        {loginData.length > 0 ? (
          <DataTable
            columns={loginColumns}
            records={paginatedLoginData()}
            totalRecords={loginTotalRecords}
            fetching={false}
            page={loginPage}
            onPageChange={setLoginPage}
            recordsPerPage={PAGE_SIZE}
            sortStatus={loginSortStatus}
            onSortStatusChange={handleLoginSortChange}
            withTableBorder
            withColumnBorders
            withRowBorders
            borderRadius="sm"
            shadow="sm"
            minHeight={filteredLoginData.length === 0 ? 300 : 0}
          />
        ) : (
          <Center className="h-[300px] flex justify-center items-center">
            <Text>No login history found</Text>
          </Center>
        )}
      </Tabs.Panel>
    </Tabs>
  );
};

export default SubAdminLogsDatatables;
