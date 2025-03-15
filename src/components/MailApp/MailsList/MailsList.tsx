'use client';
import { Card, Collapse, List } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import { mails } from '../data';
import { MailHeader } from '../MailHeader';
import { MailItem } from './MailItem';

const MailsList = () => {
  return (
    <Card
      sx={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MailHeader />
      <List component={'div'} disablePadding>
        <TransitionGroup>
          {mails.map((item, index) => (
            <Collapse key={index}>
              <MailItem mailItem={item} />
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
    </Card>
  );
};

export { MailsList };
