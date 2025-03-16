import { keyframes, SxProps, Theme } from "@mui/material";

export const HeaderStyle: ( isExpanded: boolean) => SxProps<Theme> = ( isExpanded: boolean) => ({
  position: 'fixed',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  width: isExpanded ? '100%' : '1070px',
  height: '80px',
  bgcolor: isExpanded ? '#fff' : 'none',
  boxShadow:
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  animation: isExpanded ? `${slideDown} 0.2s ease-out` : 'none',
  '.header-main' :{
    position: 'fixed',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 69,
  
    display: 'block',
    width:  {lg: 1070, xl: 1200 },
    height: { xs: 80 },
    px: 3,
  
    bgcolor: 'white',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    border:  isExpanded ? 'none' : '1px solid #cccccc',
    '.header-logo': {
      position: 'relative',
      width: '145px',
      height: { xs: '60.5px' },
      borderRadius: 2,
      overflow: 'hidden',
      '& img': {
        objectFit: 'cover',
      },
    },
    '.user-avatar': {
      position: 'relative',
      minWidth: '30px',
      height: { xs: '30px' },
      borderRadius: '50%',
      overflow: 'hidden',
      '& img': {
        objectFit: 'cover',
      },
    },
  },
});

const slideDown = keyframes`
 from {
    transform: translate(-50%,-100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%,0);
    opacity: 1;
  }
`;