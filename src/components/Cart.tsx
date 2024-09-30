import { Icon } from '@iconify/react';
import { Box, Divider, Paper, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import * as React from 'react';
import { Service } from '../@types/Service';
import Discounts from './Discounts';
import Services from './Services';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Cart() {
  const [open, setOpen] = React.useState(false);
  const [discounts, setDiscounts] = React.useState([]);
  const [services, setServices] = React.useState<{ [key: string]: Service }>(
    {}
  );
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `https://us-central1-colavolab.cloudfunctions.net/requestAssignmentCalculatorData`
      );
      setServices(data.items);
      setDiscounts(data.discounts);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Box sx={{ position: 'relative', boxShadow: 'none' }}>
          <Toolbar
            sx={{ bgcolor: 'white', justifyContent: 'center', bb: 'none' }}
          >
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
        </Box>
        <Stack sx={{ p: 2 }} gap={2}>
          <Stack direction={'row'} gap={1}>
            <Services
              services={services}
              setSelectedServices={setSelectedServices}
            />
            <Discounts />
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack gap={2}>
            {selectedServices.map((id) => (
              <ServiceItem id={id} service={services[id]} />
            ))}
          </Stack>
        </Stack>
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2 }}
          elevation={3}
        >
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography variant="body1" color="#b3b3b3">
              합계
            </Typography>
            <Typography variant="h5">0원</Typography>
          </Stack>
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{
              bgcolor: '#9A85ED',
              mt: 2,
            }}
          >
            다음
          </Button>
        </Paper>
      </Dialog>
    </React.Fragment>
  );
}

function ServiceItem({
  id,
  service,
}: // setCheckedServices,
// checkedServices,
{
  id: string;
  service: Service;
  // setCheckedServices: React.Dispatch<React.SetStateAction<string[]>>;
  // checkedServices: string[];
}) {
  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      key={id}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          sx={{
            maxWidth: '80%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {service.name}
        </Typography>
        <Typography variant="subtitle2" color="#b3b3b3">
          {service.price}원
        </Typography>
      </Box>
    </Stack>
  );
}
