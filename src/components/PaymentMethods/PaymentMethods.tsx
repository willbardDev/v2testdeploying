import { maskCardNumber } from '@/utilities/helpers';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { RiDeleteBin3Fill } from 'react-icons/ri';
import { PaymentCardProps } from './data';

const PaymentMethods = ({ data }: { data: PaymentCardProps[] }) => {
  return (
    <List
      sx={{
        '& .MuiListItem-root': {
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          p: (theme) => theme.spacing(1, 2, 2),
          mb: 3,
          '&:last-child': {
            mb: 0,
          },
        },
        '& .MuiListItemAvatar-root': {
          mr: 2,
        },
      }}
    >
      {data?.map((item: PaymentCardProps, index: number) => (
        <ListItem key={index} alignItems='flex-start'>
          <ListItemAvatar>
            <Image
              width={91}
              height={60}
              src={item?.cardImage}
              alt=''
              style={{ verticalAlign: 'middle' }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant='h5' mb={0.5} mt={0.5}>
                {`${item.cardName} ${maskCardNumber(item?.cardNumber)}`}
              </Typography>
            }
            secondary={
              <React.Fragment>
                <Typography
                  variant='body1'
                  color={'text.secondary'}
                  component={'span'}
                >
                  Add Payment Method
                </Typography>
                <Stack
                  direction='row'
                  spacing={1}
                  flexShrink={0}
                  alignItems={'center'}
                  mt={1}
                  sx={{ display: { sm: 'none' } }}
                  component={'span'}
                >
                  <Button variant='contained' size='small' disableElevation>
                    Primary
                  </Button>
                  <IconButton aria-label='delete'>
                    <RiDeleteBin3Fill />
                  </IconButton>
                </Stack>
              </React.Fragment>
            }
          />
          <Stack
            direction='row'
            spacing={1}
            flexShrink={0}
            alignItems={'center'}
            ml={2}
            mt={1}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            {item?.primary ? (
              <Button variant='contained' size='small' disableElevation>
                Primary
              </Button>
            ) : (
              <Button
                size='small'
                sx={{ textTransform: 'none', letterSpacing: 0 }}
              >
                Set as Primary
              </Button>
            )}
            <IconButton aria-label='delete'>
              <RiDeleteBin3Fill />
            </IconButton>
          </Stack>
        </ListItem>
      ))}
    </List>
  );
};
export { PaymentMethods };
