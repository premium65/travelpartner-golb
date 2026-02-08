/**
 * Sub Admin Logs Data Table Component
 * 
 * This component provides a tabbed interface to view:
 * 1. Admin Logs - Activity logs showing what actions the admin has performed
 * 2. Login History - Login attempts specific to the current admin
 * 
 * The component fetches data from /api/admin/admin-logs-data using the current admin's ID
 * from the Redux store. This ensures each admin only sees their own logs.
 * 
 * Features:
 * - Tabbed interface (Admin Logs / Login History)
 * - Pagination (10 records per page)
 * - Column sorting and filtering
 * - Real-time loading states
 * - Color-coded status indicators
 * 
 * @component
 */
'use client';

import { Center, Group, Text, TextInput, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

dayjs.extend(utc);
dayjs.extend(timezone);

const PAGE_SIZE = 10;

/**
 * Interface for Admin Log Record
 * Represents an administrative action performed by an admin
 */
interface AdminLogRecord {
  _id: string;
  taskType?: string;
  taskDescription?: string;
  adminEmail?: string;
  createdAt: string;
}

/**
 * Interface for Login History Record
 * Represents a login attempt by an admin
 */
interface LoginHistoryRecord {
  _id: string;
  countryName?: string;
  ipaddress?: string;
  browser?: string;
  status?: string;
  createdDate: string;
}

const renderDate = (date: string) => {
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) {
    return 'Invalid Date';
  }
  return parsedDate.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm');
};

const SubAdminLogsDatatables = () => {
  const [adminLogsData, setAdminLogsData] = useState<AdminLogRecord[]>([]);
  const [loginHistoryData, setLoginHistoryData] = useState<LoginHistoryRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'logs' | 'loginHistory'>('logs');
  const { data: adminProfileData } = useSelector((state: IRootState) => state.adminProfile);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<any>>({
    columnAccessor: 'createdAt',
    direction: 'desc',
  });
  const [filters, setFilters] = useState({
    taskType: '',
    taskDescription: '',
    adminEmail: '',
  });
  const [loginFilters, setLoginFilters] = useState({
    countryName: '',
    ipaddress: '',
    browser: '',
    status: '',
  });

  useEffect(() => {
    const fetchAdminLogsData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const adminId = adminProfileData?._id;
        
        if (!adminId) {
          console.error('Admin ID not found');
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/admin-logs-data?adminId=${adminId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.status === 200 && response.data.success) {
          setAdminLogsData(response.data.result.logData || []);
          setLoginHistoryData(response.data.result.loginData || []);
          setTotalRecords((response.data.result.logData?.length || 0) + (response.data.result.loginData?.length || 0));
        } else {
          console.error('Failed to load admin logs data.');
        }
      } catch (error) {
        console.error('An error occurred while fetching admin logs data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (adminProfileData?._id) {
      fetchAdminLogsData();
    }
  }, [adminProfileData]);

  const filteredLogsData = adminLogsData.filter((record) => {
    return (
      (filters.taskType === '' || record.taskType?.toLowerCase().includes(filters.taskType.toLowerCase())) &&
      (filters.taskDescription === '' || record.taskDescription?.toLowerCase().includes(filters.taskDescription.toLowerCase())) &&
      (filters.adminEmail === '' || record.adminEmail?.toLowerCase().includes(filters.adminEmail.toLowerCase()))
    );
  });

  const filteredLoginHistoryData = loginHistoryData.filter((record) => {
    return (
      (loginFilters.countryName === '' || record.countryName?.toLowerCase().includes(loginFilters.countryName.toLowerCase())) &&
      (loginFilters.ipaddress === '' || record.ipaddress?.toLowerCase().includes(loginFilters.ipaddress.toLowerCase())) &&
      (loginFilters.browser === '' || record.browser?.toLowerCase().includes(loginFilters.browser.toLowerCase())) &&
      (loginFilters.status === '' || record.status?.toLowerCase().includes(loginFilters.status.toLowerCase()))
    );
  });

  const handleSortStatusChange = (status: DataTableSortStatus<any>) => {
    setPage(1);
    setSortStatus(status);
  };

  const paginatedData = () => {
    const dataToUse = activeTab === 'logs' ? filteredLogsData : filteredLoginHistoryData;
    const sortedData = [...dataToUse].sort((a, b) => {
      const { columnAccessor, direction } = sortStatus;
      const aValue = a[columnAccessor as keyof (AdminLogRecord | LoginHistoryRecord)];
      const bValue = b[columnAccessor as keyof (AdminLogRecord | LoginHistoryRecord)];
      
      if (!aValue || !bValue) return 0;
      
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return sortedData.slice(start, end);
  };

  const logsColumns: DataTableProps<AdminLogRecord>['columns'] = [
    {
      accessor: 'createdAt',
      title: 'Date',
      noWrap: true,
      sortable: true,
      render: (record) => renderDate(record.createdAt),
    },
    {
      accessor: 'taskType',
      title: 'Task Type',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by task type"
          value={filters.taskType}
          onChange={(e) => setFilters((prev) => ({ ...prev, taskType: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'taskDescription',
      title: 'Task Description',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by description"
          value={filters.taskDescription}
          onChange={(e) => setFilters((prev) => ({ ...prev, taskDescription: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'adminEmail',
      title: 'Admin Email',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by admin email"
          value={filters.adminEmail}
          onChange={(e) => setFilters((prev) => ({ ...prev, adminEmail: e.currentTarget?.value || '' }))}
        />
      ),
    },
  ];

  const loginHistoryColumns: DataTableProps<LoginHistoryRecord>['columns'] = [
    {
      accessor: 'createdDate',
      title: 'Login Date',
      noWrap: true,
      sortable: true,
      render: (record) => renderDate(record.createdDate),
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
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by IP"
          value={loginFilters.ipaddress}
          onChange={(e) => setLoginFilters((prev) => ({ ...prev, ipaddress: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'browser',
      title: 'Browser',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by browser"
          value={loginFilters.browser}
          onChange={(e) => setLoginFilters((prev) => ({ ...prev, browser: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'status',
      title: 'Status',
      sortable: true,
      render: (record) => (
        <div className="flex justify-center items-center">
          {record.status === 'success' ? (
            <Button variant="filled" color="green" className="text-xs cursor-auto">
              Success
            </Button>
          ) : (
            <Button variant="filled" color="red" className="text-xs cursor-auto">
              Failed
            </Button>
          )}
        </div>
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
    <>
      <div className="mb-4">
        <Group gap="sm">
          <Button
            variant={activeTab === 'logs' ? 'filled' : 'outline'}
            onClick={() => {
              setActiveTab('logs');
              setPage(1);
            }}
          >
            Admin Logs
          </Button>
          <Button
            variant={activeTab === 'loginHistory' ? 'filled' : 'outline'}
            onClick={() => {
              setActiveTab('loginHistory');
              setPage(1);
            }}
          >
            Login History
          </Button>
        </Group>
      </div>

      {(activeTab === 'logs' ? adminLogsData : loginHistoryData).length > 0 && (
        <Group mb="md" className="my-4">
          <Button
            variant="outline"
            onClick={() => {
              if (activeTab === 'logs') {
                setFilters({
                  taskType: '',
                  taskDescription: '',
                  adminEmail: '',
                });
              } else {
                setLoginFilters({
                  countryName: '',
                  ipaddress: '',
                  browser: '',
                  status: '',
                });
              }
            }}
          >
            Clear Filters
          </Button>
        </Group>
      )}

      {(activeTab === 'logs' ? adminLogsData : loginHistoryData).length > 0 ? (
        <>
          {activeTab === 'logs' ? (
            <DataTable
              columns={logsColumns}
              records={paginatedData() as AdminLogRecord[]}
              totalRecords={filteredLogsData.length}
              fetching={loading}
              page={page}
              onPageChange={setPage}
              recordsPerPage={PAGE_SIZE}
              sortStatus={sortStatus}
              onSortStatusChange={handleSortStatusChange}
              withTableBorder
              withColumnBorders
              withRowBorders
              borderRadius="sm"
              shadow="sm"
              minHeight={filteredLogsData.length === 0 ? 300 : 0}
            />
          ) : (
            <DataTable
              columns={loginHistoryColumns}
              records={paginatedData() as LoginHistoryRecord[]}
              totalRecords={filteredLoginHistoryData.length}
              fetching={loading}
              page={page}
              onPageChange={setPage}
              recordsPerPage={PAGE_SIZE}
              sortStatus={sortStatus}
              onSortStatusChange={handleSortStatusChange}
              withTableBorder
              withColumnBorders
              withRowBorders
              borderRadius="sm"
              shadow="sm"
              minHeight={filteredLoginHistoryData.length === 0 ? 300 : 0}
            />
          )}
        </>
      ) : (
        <Center className="h-[300px] flex justify-center items-center">
          <Text>{loading ? 'Loading...' : 'No records found'}</Text>
        </Center>
      )}
    </>
  );
};

export default SubAdminLogsDatatables;
