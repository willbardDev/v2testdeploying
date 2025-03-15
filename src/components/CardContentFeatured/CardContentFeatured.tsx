import { Div } from '@jumbo/shared';
import { SxProps, Theme } from '@mui/material';

type DivWithBackgroundProps = {
  sx: SxProps<Theme>;
  header?: React.ReactNode;
  bgimage?: string;
  children: React.ReactNode;
};
function DivWithBackground({ sx, bgimage, children }: DivWithBackgroundProps) {
  return (
    <Div
      sx={{
        p: 0,
        ...(bgimage
          ? {
              background: `url(${bgimage}) no-repeat center`,
              backgroundSize: 'cover',
            }
          : {}),
        ...sx,
        position: 'relative',
      }}
    >
      {children}
    </Div>
  );
}

export { DivWithBackground };
