'use client';

import { Button, Center, Group, Text, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DataTable, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const PAGE_SIZE = 10;

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
  reason: string;
  createdDate: string;
}

const renderDate = (date: string) => {
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) return 'Invalid Date';
  return parsedDate.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm');
};

const LoginHistoryDatatables = () => {
  const router = useRouter();
  const [data, setData] = useState<LoginHistoryRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<any>>({
    columnAccessor: 'createdDate',
    direction: 'desc',
  });
  const [filters, setFilters] = useState({
    countryCode: '',
    countryName: '',
    regionName: '',
    ipaddress: '',
    broswername: '',
    ismobile: '',
    os: '',
    status: '',
    createdDate: '',
  });
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/login-history?page=1&limit=10000&fillter=%7B%7D&sortObj=%7B%7D`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        setData(response.data.result.data);
        setTotalRecords(response.data.result.count);
      } else {
        console.error('Failed to load login history data.');
      }
    } catch (error) {
      console.error('An error occurred while fetching login history data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const filteredData = data.filter((record) => {
    const createdAt = dayjs(record.createdDate).tz('Asia/Kolkata');
    const from = fromDate ? dayjs(fromDate) : null;
    const to = toDate ? dayjs(toDate) : null;

    const isInDateRange =
      (!from || createdAt.isSame(from, 'day') || createdAt.isAfter(from, 'day')) &&
      (!to || createdAt.isSame(to, 'day') || createdAt.isBefore(to, 'day'));

    return (
      isInDateRange &&
      (filters.createdDate === '' || dayjs(record.createdDate).format('YYYY-MM-DD').includes(filters.createdDate)) &&
      (filters.countryCode === '' || (record.countryCode || '').toLowerCase().includes(filters.countryCode.toLowerCase())) &&
      (filters.countryName === '' || (record.countryName || '').toLowerCase().includes(filters.countryName.toLowerCase())) &&
      (filters.regionName === '' || (record.regionName || '').toLowerCase().includes(filters.regionName.toLowerCase())) &&
      (filters.ipaddress === '' || (record.ipaddress || '').toLowerCase().includes(filters.ipaddress.toLowerCase())) &&
      (filters.broswername === '' || (record.broswername || '').toLowerCase().includes(filters.broswername.toLowerCase())) &&
      (filters.ismobile === '' || (record.ismobile || '').toLowerCase().includes(filters.ismobile.toLowerCase())) &&
      (filters.os === '' || (record.os || '').toLowerCase().includes(filters.os.toLowerCase())) &&
      (filters.status === '' || (record.status || '').toLowerCase().includes(filters.status.toLowerCase()))
    );
  });

  const handleSortStatusChange = (status: DataTableSortStatus<any>) => {
    setPage(1);
    setSortStatus(status);
    const sortedData = [...filteredData].sort((a: any, b: any) => {
      const { columnAccessor, direction } = status;
      if (a[columnAccessor] < b[columnAccessor]) return direction === 'asc' ? -1 : 1;
      if (a[columnAccessor] > b[columnAccessor]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  const paginatedData = () => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredData ? filteredData.slice(start, end) : data.slice(start, end);
  };

  const columns: DataTableProps<any>['columns'] = [
    {
      accessor: 'createdDate',
      title: 'Login Date',
      noWrap: true,
      sortable: true,
      render: (record: any) => renderDate(record.createdDate),
      filter: (
        <TextInput
          placeholder="Filter by date"
          value={filters.createdDate}
          onChange={(e) => setFilters((prev) => ({ ...prev, createdDate: e.currentTarget?.value || '' }))}
        />
      ),
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
          placeholder="Filter by country"
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
      filter: (
        <TextInput
          placeholder="Filter by IP"
          value={filters.ipaddress}
          onChange={(e) => setFilters((prev) => ({ ...prev, ipaddress: e.currentTarget?.value || '' }))}
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
          value={filters.broswername}
          onChange={(e) => setFilters((prev) => ({ ...prev, broswername: e.currentTarget?.value || '' }))}
        />
      ),
    },
    {
      accessor: 'ismobile',
      title: 'Device Type',
      sortable: true,
      filter: (
        <TextInput
          placeholder="Filter by device"
          value={filters.ismobile}
          onChange={(e) => setFilters((prev) => ({ ...prev, ismobile: e.currentTarget?.value || '' }))}
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
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.currentTarget?.value || '' }))}
        />
      ),
    },
  ];

  return (
    <>
      {data.length > 0 && (
        <Group mb="md" className="my-4">
          <div className="flex flex-row items-center gap-2">
            <label className="text-gray-700 mt-1 text-sm font-semibold">From Date</label>
            <TextInput
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <label className="text-gray-700 mt-1 text-sm font-semibold">To Date</label>
            <TextInput
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.currentTarget.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setFromDate('');
              setToDate('');
              setFilters({
                countryCode: '',
                countryName: '',
                regionName: '',
                ipaddress: '',
                broswername: '',
                ismobile: '',
                os: '',
                status: '',
                createdDate: '',
              });
            }}
          >
            Clear Filters
          </Button>
        </Group>
      )}
      {data.length > 0 ? (
        <DataTable
          columns={columns}
          records={paginatedData()}
          totalRecords={totalRecords}
          fetching={false}
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
          <Text>No records found</Text>
        </Center>
      )}
    </>
  );
};

export default LoginHistoryDatatables;
