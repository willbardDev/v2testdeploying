'use client';

import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  Pagination,
  Card,
  LinearProgress,
  Tooltip,
  IconButton,
  Alert
} from '@mui/material';
import { AddOutlined, Search as SearchIcon } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import OrganizationListItem from './OrganizationListItem';
import organizationServices from '@/lib/services/organizationServices';
import Link from 'next/link';

const OrganizationsList = ({ initialData, initialParams, user }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [params, setParams] = useState({
    ...initialParams,
    token: user.accessToken, 
    limit: initialParams.limit || 10
  });
  
  const [data, setData] = useState({
    items: initialData?.data || [],
    total: initialData?.total || 0,
    currentPage: initialData?.current_page || 1,
    perPage: initialData?.per_page || 10
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrganizations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await organizationServices.getList(params);
      setData({
        items: result.data,
        total: result.total,
        currentPage: result.current_page,
        perPage: result.per_page,
      });
    } catch (error) {
      setError(error.message || 'Failed to load organizations');
    } finally {
      setLoading(false);
    }
  }, [params]);

  const handleSearchChange = debounce((e) => {
    const keyword = e.target.value;
  
    setParams(prev => ({
      ...prev,
      page: 1,
      keyword: keyword.trim(),
    }));
  
    const url = new URLSearchParams(searchParams.toString());
    url.set('keyword', keyword.trim());
    url.set('page', '1');
    router.push(`/organizations?${url.toString()}`);
  }, 500);

  const handlePageChange = (_, newPage) => {
    setParams(prev => ({ ...prev, page: newPage }));
    const url = new URLSearchParams(searchParams.toString());
    url.set('page', newPage.toString());
    router.push(`/organizations?${url.toString()}`);
  };

  useEffect(() => {
    if (params.page !== initialParams.page || params.keyword !== initialParams.keyword) {
      fetchOrganizations();
    }
  }, [params]);

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Organizations</Typography>
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: 2,
          gap: 2,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search...."
          defaultValue={params.keyword}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Tooltip title="Add Organization">
          <IconButton
            color="primary"
            onClick={() => {
              /* Add dialog open logic here */
            }}
            sx={{
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              },
            }}
          >
            <AddOutlined />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Message */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Loading State */}
      {loading && <LinearProgress sx={{ mb: 1 }} />}

      {/* Organizations List */}
      <Box sx={{ flex: 1 }}>
        {!loading && data.items.length === 0 ? (
          <Alert variant="outlined" severity="info" sx={{ width: '100%', my: 2 }}>
            <span>No ProsERP organizations for you. </span>
            <span>
              Join one from the{' '}
              <Link href="/invitations" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                invitations
              </Link>{' '}
              sent to your email
            </span>
          </Alert>
        ) : (
          <Box
            sx={{
              borderColor: 'divider',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {data.items.map((org) => (
              <OrganizationListItem key={org.id} organization={org} />
            ))}
          </Box>
        )}
      </Box>

      {/* Pagination */}
      {data.total > data.perPage && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 2,
          p: 1,
          bgcolor: 'background.paper'
        }}>
          <Typography variant="body2" color="textSecondary">
            Rows {data.perPage} {data.currentPage}-{Math.min(data.currentPage * data.perPage, data.total)} of {data.total}
          </Typography>
          <Pagination
            count={Math.ceil(data.total / data.perPage)}
            page={data.currentPage}
            onChange={handlePageChange}
            shape="rounded"
          />
        </Box>
      )}
    </Card>
  );
};

export default OrganizationsList;