import { Icon } from '@iconify/react';
import { Box, Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Discounts() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        startIcon={<Icon icon={'gridicons:add'} />}
        fullWidth
        size="large"
        sx={{
          bgcolor: '#FDF1F5',
          color: '#ED8EB0',
          boxShadow: 'none',
          py: 1.5,
          borderRadius: '12px',
        }}
      >
        할인
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', boxShadow: 'none' }}>
          <Toolbar sx={{ bgcolor: 'white', justifyContent: 'center' }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{
                position: 'absolute',
                left: 20,
              }}
            >
              <Icon icon={'mingcute:close-fill'} color="#b3b3b3" />
            </IconButton>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="black">
                곽지우
              </Typography>
              <Typography variant="body2" color="#b3b3b3">
                2019.6.17 오후 5:30
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Stack>
          <Button>시술</Button>
          <Button>할인</Button>
        </Stack>
      </Dialog>
    </React.Fragment>
  );
}
