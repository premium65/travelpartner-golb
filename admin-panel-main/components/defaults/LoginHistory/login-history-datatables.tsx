'use client';

import { Center, Group, Text, TextInput, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const PAGE_SIZE = 10;

const renderDate = (date: string) => {
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) {
    return 'Invalid Date';
  }
  return parsedDate.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm');
};

const LoginHistoryDatatables = () => {
  const [loginHistoryData, setLoginHistoryData] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<any>>({
    columnAccessor: 'createdDate',
    direction: 'desc',
  });
  const [filters, setFilters] = useState({
    countryCode: '',
    countryName: '',
    regionName: '',
    ipaddress: '',
    browser: '',
    deviceType: '',
    os: '',
    status: '',
  });

  const fetchLoginHistoryData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/login-history`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        setTotalRecords(response.data.result.count || 0);
        setLoginHistoryData(response.data.result.data || []);
      } else {
        console.error('Failed to load login history data.');
      }
    } catch (error) {
      console.error('An error occurred while fetching login history data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginHistoryData();
  }, []);

  const filteredData = loginHistoryData.filter((record) => {
    return (
      (filters.countryCode === '' || record.countryCode?.toLowerCase().includes(filters.countryCode.toLowerCase())) &&
      (filters.countryName === '' || record.countryName?.toLowerCase().includes(filters.countryName.toLowerCase())) &&
      (filters.regionName === '' || record.regionName?.toLowerCase().includes(filters.regionName.toLowerCase())) &&
      (filters.ipaddress === '' || record.ipaddress?.toLowerCase().includes(filters.ipaddress.toLowerCase())) &&
      (filters.browser === '' || record.browser?.toLowerCase().includes(filters.browser.toLowerCase())) &&
      (filters.deviceType === '' || record.deviceType?.toLowerCase().includes(filters.deviceType.toLowerCase())) &&
      (filters.os === '' || record.os?.toLowerCase().includes(filters.os.toLowerCase())) &&
      (filters.status === '' || record.status?.toLowerCase().includes(filters.status.toLowerCase()))
    );
  });

  const handleSortStatusChange = (status: DataTableSortStatus<any>) => {
    setPage(1);
    setSortStatus(status);
  };

  const paginatedData = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const { columnAccessor, direction } = sortStatus;
      if (a[columnAccessor] < b[columnAccessor]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[columnAccessor] > b[columnAccessor]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return sortedData.slice(start, end);
  };

  const columns: DataTableProps<any>['columns'] = [
    {
      accessor: 'createdDate',
      title: 'Login Date',
      noWrap: true,
      sortable: true,
      render: (record) => renderDate(record.createdDate),
    },
    {
      accessor: 'countryCode',
      title: 'Country Code',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by country code"
          value={filters.countryCode}
          onChange={(e) => setFilters((prev) => ({ ...prev, countryCode: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'countryName',
      title: 'Country Name',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by country name"
          value={filters.countryName}
          onChange={(e) => setFilters((prev) => ({ ...prev, countryName: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'regionName',
      title: 'Region',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by region"
          value={filters.regionName}
          onChange={(e) => setFilters((prev) => ({ ...prev, regionName: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'ipaddress',
      title: 'IP Address',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by IP address"
          value={filters.ipaddress}
          onChange={(e) => setFilters((prev) => ({ ...prev, ipaddress: e.currentTarget?.value || '' }))}
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
          value={filters.browser}
          onChange={(e) => setFilters((prev) => ({ ...prev, browser: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'deviceType',
      title: 'Device Type',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by device type"
          value={filters.deviceType}
          onChange={(e) => setFilters((prev) => ({ ...prev, deviceType: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'os',
      title: 'OS',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by OS"
          value={filters.os}
          onChange={(e) => setFilters((prev) => ({ ...prev, os: e.currentTarget?.value || '' }))}
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
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.currentTarget?.value || '' }))}
        />
      ),
    },
  ];

  return (
    <>
      {loginHistoryData.length > 0 && (
        <Group mb="md" className="my-4">
          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                countryCode: '',
                countryName: '',
                regionName: '',
                ipaddress: '',
                browser: '',
                deviceType: '',
                os: '',
                status: '',
              })
            }
          >
            Clear Filters
          </Button>
        </Group>
      )}
      {loginHistoryData.length > 0 ? (
        <DataTable
          columns={columns}
          records={paginatedData()}
          totalRecords={filteredData.length}
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
          minHeight={filteredData.length === 0 ? 300 : 0}
        />
      ) : (
        <Center className="h-[300px] flex justify-center items-center">
          <Text>{loading ? 'Loading...' : 'No records found'}</Text>
        </Center>
      )}
    </>
  );
};

export default LoginHistoryDatatables;
