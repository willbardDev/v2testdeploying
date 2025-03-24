'use client';
import { ThemeOptions, alpha } from '@mui/material';

export const sidebarTheme: ThemeOptions = {
  // type: 'light',
  palette: {
    primary: {
      main: '#2113AD',
      light: '#2113AD',
      dark: '#5E3BB7',
      contrastText: '#FFF'
  },
  secondary: {
      main: '#E44A77',
      light: '#FF7EA6',
      dark: '#DF295E',
      contrastText: '#FFF'
  },
    error: {
      main: '#E73145',
      light: '#FF6A70',
      dark: '#AD001E',
      contrastText: '#FFF',
    },
    warning: {
      main: '#F39711',
      light: '#FFC84C',
      dark: '#BB6900',
      contrastText: '#FFF',
    },
    info: {
      main: '#2EB5C9',
      light: '#6FE7FC',
      dark: '#008598',
      contrastText: '#FFF',
    },
    success: {
      main: '#3BD2A2',
      light: '#78FFD3',
      dark: '#00A073',
      contrastText: '#FFF',
    },
    text: {
      primary: '#475259',
      secondary: '#8595A6',
      disabled: '#A2B2C3',
    },
    divider: '#DEE2E6',
    background: {
      paper: '#FFFFFF',
      default: '#F5F7FA',
    },
    action: {
      active: '#2113AD',
      hover: '#2113AD',
  },
  },
  jumboComponents: {
    JumboNavbar: {
      nav: {
        action: {
          active: '#7352C7',
          hover: '#7352C7',
        },
        background: {
          active: alpha('#7352C7', 0.15),
          hover: '#E9ECEF',
        },
        tick: {
          active: '#7352C7',
          hover: '#ADB5BD',
        },
      },
    },
  },
};
