import { Icon } from '@iconify/react';
import { AppBar, Box, Divider, Paper, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Service } from '../@types/Service';
import comma from '../utils/comma';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Services({
  services,
  setSelectedServices,
  selectedServices,
}: {
  services: { [key: string]: Service };
  setSelectedServices: React.Dispatch<
    React.SetStateAction<{ [key: string]: Service }>
  >;
  selectedServices: { [key: string]: Service };
}) {
  const [open, setOpen] = React.useState(false);
  const [checkedServices, setCheckedServices] = React.useState<string[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const newObj: { [key: string]: Service } = {};
    checkedServices.map((el: string) => {
      newObj[el] = { ...services[el], count: selectedServices[el]?.count ?? 1 };
    });

    setSelectedServices({ ...newObj });
    handleClose();
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
          bgcolor: '#F7F7F7',
          color: '#B8BFC9',
          boxShadow: 'none',
          py: 1.5,
          borderRadius: '12px',
        }}
      >
        시술
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Box sx={{ position: 'relative', boxShadow: 'none' }}>
          <AppBar
            sx={{
              boxShadow: 'none',
              bgcolor: 'white',
            }}
          >
            <Toolbar
              sx={{
                bgcolor: 'white',
                justifyContent: 'space-between',
                bb: 'none',
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <Icon icon={'mingcute:close-fill'} color="#b3b3b3" />
              </IconButton>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="black">
                  시술메뉴
                </Typography>
              </Box>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <Icon icon={'mingcute:add-fill'} color="#b3b3b3" />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>
        <Stack sx={{ p: 2, pb: 18, pt: 8 }} gap={1}>
          <Stack gap={2}>
            {Object.keys(services)?.map((id: string) => (
              <ServiceItem
                id={id}
                service={services[id]}
                checkedServices={checkedServices}
                setCheckedServices={setCheckedServices}
              />
            ))}
          </Stack>
        </Stack>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: '#9A85ED',
            textAlign: 'center',
          }}
          elevation={3}
        >
          <Typography variant="body2" color="white">
            서비스를 선택하세요(여러 개 선택가능)
          </Typography>
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{
              bgcolor: '#AE9EF0',
              mt: 2,
              py: 1.5,
            }}
            onClick={handleSubmit}
          >
            완료
          </Button>
        </Paper>
      </Dialog>
    </React.Fragment>
  );
}

function ServiceItem({
  id,
  service,
  setCheckedServices,
  checkedServices,
}: {
  id: string;
  service: Service;
  setCheckedServices: React.Dispatch<React.SetStateAction<string[]>>;
  checkedServices: string[];
}) {
  const [isCheck, setIsCheck] = React.useState<boolean>(
    checkedServices.includes(id)
  );

  const handleCheck = () => {
    if (isCheck) {
      setCheckedServices(checkedServices.filter((str) => str !== id));
    } else {
      setCheckedServices([...checkedServices, id]);
    }
    setIsCheck(!isCheck);
  };
  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      key={id}
      onClick={handleCheck}
    >
      <Box sx={{ flexGrow: 1, maxWidth: '80%' }}>
        <Typography
          variant="h6"
          sx={{
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
          {comma(service.price)}원
        </Typography>
      </Box>
      {isCheck && (
        <Icon
          icon={'fontisto:check'}
          color={'#9A85ED'}
          style={{ minWidth: '22px' }}
        />
      )}
    </Stack>
  );
}
