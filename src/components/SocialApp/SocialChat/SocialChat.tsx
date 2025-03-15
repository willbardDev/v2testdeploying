import { ASSET_AVATARS, ASSET_IMAGES } from '@/utilities/constants/paths';
import { getAssetPath } from '@/utilities/helpers';
import { Div } from '@jumbo/shared';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  ImageList,
  ImageListItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Image from 'next/image';

const SocialChat = () => {
  const { theme } = useJumboTheme();
  return (
    <Div sx={{ px: 2 }}>
      <Card sx={{ mb: 3.75 }}>
        <CardContent>
          <Div
            sx={{
              display: 'flex',
              minWidth: 0,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Avatar
              sx={{ height: 50, width: 50 }}
              alt='Remy Sharp'
              src={getAssetPath(`${ASSET_AVATARS}/avatar3.jpg`, '50x50')}
            />
            <Div sx={{ flex: 1 }}>
              <TextField
                id='your-mind'
                multiline
                fullWidth
                rows={2}
                variant={'outlined'}
                placeholder='What is in your mind?'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: theme.type === 'dark' ? `transparent` : '',
                    '& > fieldset': {
                      border: 'none',
                    },
                  },
                }}
              />
            </Div>
          </Div>
        </CardContent>
      </Card>
      <Card sx={{ mb: 3.5 }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ height: 50, width: 50 }}
              alt='Remy Sharp'
              src={getAssetPath(`${ASSET_AVATARS}/avatar3.jpg`, '50x50')}
            />
          }
          title={
            <Typography variant={'h6'} mb={0.25}>
              Kenery Thomson
            </Typography>
          }
          subheader={
            <Typography
              variant={'body1'}
              color={'text.secondary'}
              fontSize={'12px'}
            >
              22 Jul, 2018
            </Typography>
          }
        />
        <CardContent sx={{ pt: 0 }}>
          <ImageList sx={{ m: '0 0 12px' }} cols={2} gap={16}>
            <ImageListItem
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <Image
                width={640}
                height={420}
                src={`${ASSET_IMAGES}/wall/yarenci-hdz.jpg`}
                alt='Title 103'
                loading='lazy'
                className='MuiImageListItem-img'
              />
            </ImageListItem>
            <ImageListItem
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <Image
                src={`${ASSET_IMAGES}/wall/severin-candrian.jpg`}
                width={640}
                height={420}
                alt='Title 102'
                loading='lazy'
                className='MuiImageListItem-img'
              />
            </ImageListItem>
          </ImageList>
          <Stack
            direction={'row'}
            spacing={2}
            sx={{
              color: 'text.secondary',
              fontSize: '12px',
              mb: 3,

              '& > span': {
                cursor: 'pointer',
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1rem',
                mt: '-2px',
                verticalAlign: 'middle',
              },
            }}
          >
            <span>
              <VisibilityIcon /> 350 views
            </span>
            <span>
              <FavoriteBorderIcon /> 150 Likes
            </span>
            <span>
              <ChatBubbleOutlineIcon /> 1 Comments
            </span>
            <span style={{ marginLeft: 'auto' }}>
              <VisibilityIcon /> 124 Shares
            </span>
          </Stack>
          <Div sx={{ display: 'flex' }}>
            <Avatar
              sx={{ mr: 2 }}
              alt='Remy Sharp'
              src={getAssetPath(`${ASSET_AVATARS}/avatar3.jpg`, '40x40')}
            />
            <Div>
              <Typography variant={'h6'} mb={0.25}>
                Kenery Thomson
              </Typography>
              <Typography
                variant={'body1'}
                color={'text.secondary'}
                fontSize={'12px'}
                mb={2}
              >
                22 Jul, 2018
              </Typography>
              <Typography
                variant={'body1'}
                color={'text.secondary'}
                fontSize={'12px'}
                mb={2}
              >
                Wow! Excellent, these images are so beautiful.
              </Typography>
            </Div>
          </Div>
          <Div sx={{ display: 'flex', minWidth: 0 }}>
            <Avatar
              sx={{ mr: 2 }}
              alt='Remy Sharp'
              src={getAssetPath(`${ASSET_AVATARS}/avatar3.jpg`, '40x40')}
            />
            <Div sx={{ flex: 1 }}>
              <TextField
                id='comment'
                multiline
                fullWidth
                rows={2}
                variant={'outlined'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    py: 1,
                    '& > fieldset': {
                      borderRadius: 0,
                    },
                  },
                }}
              />
            </Div>
          </Div>
        </CardContent>
      </Card>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ height: 50, width: 50 }}
              alt='Remy Sharp'
              src={getAssetPath(`${ASSET_AVATARS}/avatar3.jpg`, '50x50')}
            />
          }
          title={
            <Typography variant={'h6'} mb={0.25}>
              Kenery Thomson
            </Typography>
          }
          subheader={
            <Typography
              variant={'body1'}
              color={'text.secondary'}
              fontSize={'12px'}
            >
              22 Jul, 2018
            </Typography>
          }
        />
        <CardContent sx={{ pt: 0 }}>
          <ImageList sx={{ m: '0 0 12px' }} cols={1} gap={16}>
            <ImageListItem
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <Image
                src={`${ASSET_IMAGES}/wall/agitalizr-unsplash.jpg`}
                width={640}
                height={420}
                alt='Title 101'
                loading='lazy'
                className='MuiImageListItem-img'
              />
            </ImageListItem>
          </ImageList>
          <Stack
            direction={'row'}
            spacing={2}
            sx={{
              color: 'text.secondary',
              fontSize: '12px',
              mb: 3,

              '& > span': {
                cursor: 'pointer',
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1rem',
                mt: '-2px',
                verticalAlign: 'middle',
              },
            }}
          >
            <span>
              <VisibilityIcon /> 350 views
            </span>
            <span>
              <FavoriteBorderIcon /> 150 Likes
            </span>
            <span>
              <ChatBubbleOutlineIcon /> 1 Comments
            </span>
            <span style={{ marginLeft: 'auto' }}>
              <VisibilityIcon /> 124 Shares
            </span>
          </Stack>
          <Div sx={{ display: 'flex' }}>
            <Avatar
              sx={{ mr: 2 }}
              alt='Remy Sharp'
              src={getAssetPath(`${ASSET_AVATARS}/avatar3.jpg`, '40x40')}
            />
            <Div>
              <Typography variant={'h6'} mb={0.25}>
                Kenery Thomson
              </Typography>
              <Typography
                variant={'body1'}
                color={'text.secondary'}
                fontSize={'12px'}
                mb={2}
              >
                22 Jul, 2018
              </Typography>
              <Typography
                variant={'body1'}
                color={'text.secondary'}
                fontSize={'12px'}
                mb={2}
              >
                Wow! Excellent, these images are so beautiful.
              </Typography>
            </Div>
          </Div>
          <Div sx={{ display: 'flex', minWidth: 0 }}>
            <Avatar
              sx={{ mr: 2 }}
              alt='Remy Sharp'
              src={getAssetPath(`${ASSET_AVATARS}/avatar3.jpg`, '40x40')}
            />
            <Div sx={{ flex: 1 }}>
              <TextField
                id='comment'
                multiline
                fullWidth
                rows={2}
                variant={'outlined'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    py: 1,
                    '& > fieldset': {
                      borderRadius: 0,
                    },
                  },
                }}
              />
            </Div>
          </Div>
        </CardContent>
      </Card>
      <Button
        sx={{
          mb: 2,
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'text.primary',
          },
        }}
        size={'large'}
        variant={'outlined'}
        color={'inherit'}
        fullWidth
      >
        Load more
      </Button>
    </Div>
  );
};

export { SocialChat };
