import { Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    jumboComponents: {
      JumboNavbar: {
        nav: {
          action: {
            active: string;
            hover: string;
          };
          background: {
            active: string;
            hover: string;
          };
          tick: {
            active: string;
            hover: string;
          };
        };
      };
      // Add JumboSearch to the theme type
      JumboSearch: {
        background: string;
      };
    };
  }
  
  // If you also need to modify ThemeOptions
  interface ThemeOptions {
    jumboComponents?: {
      JumboNavbar?: {
        nav?: {
          action?: {
            active?: string;
            hover?: string;
          };
          background?: {
            active?: string;
            hover?: string;
          };
          tick?: {
            active?: string;
            hover?: string;
          };
        };
      };
      JumboSearch?: {
        background?: string;
      };
    };
  }
}