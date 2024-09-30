import { Icon } from '@iconify/react';
import {
  AppBar,
  Box,
  Divider,
  Menu,
  MenuItem,
  Paper,
  Stack,
} from '@mui/material';
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
import QuantityInput from './QuantityInput';
import comma from '../utils/comma';
import { Discount, DiscountWithTargets } from '../@types/Discount';

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
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [discounts, setDiscounts] = React.useState<{ [key: string]: Discount }>(
    {}
  );
  const [services, setServices] = React.useState<{ [key: string]: Service }>(
    {}
  );
  const [selectedServices, setSelectedServices] = React.useState<{
    [key: string]: Service;
  }>({});
  const [selectedDiscounts, setSelectedDiscounts] = React.useState<{
    [key: string]: DiscountWithTargets;
  }>({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangeCount = (id: string, count: number) => {
    const obj = selectedServices;
    obj[id]['count'] = count;
    setSelectedServices({ ...obj });
  };

  const onChangeDiscountTarget = (discountId: string, targets: string[]) => {
    const obj = selectedDiscounts;
    obj[discountId]['targets'] = targets;
    setSelectedDiscounts({ ...obj });
  };

  React.useEffect(() => {
    getData();
  }, []);

  React.useMemo(() => {
    let price = 0;
    let discountPrice = 0;
    Object.keys(selectedServices).map((id) => {
      price += services[id].price * (selectedServices[id].count ?? 0);
    });

    Object.keys(selectedDiscounts).forEach((discountId) => {
      selectedDiscounts[discountId].targets.forEach((serviceId) => {
        if (selectedServices[serviceId]) {
          discountPrice +=
            services[serviceId].price *
            selectedServices[serviceId].count *
            selectedDiscounts[discountId].rate;
        }
      });
    });

    if (price - discountPrice < 0) {
      setTotalPrice(0);
    } else {
      setTotalPrice(price - discountPrice);
    }
  }, [selectedServices, selectedDiscounts]);

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `https://us-central1-colavolab.cloudfunctions.net/requestAssignmentCalculatorData`
      );
      console.log(data);
      setServices(data.items);
      setDiscounts(data.discounts);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{ color: '#AE9EF0', borderColor: '#AE9EF0' }}
      >
        결제입력
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
                2019.6.8 오후 5:30
              </Typography>
            </Box>
          </Toolbar>
        </Box>
        <Stack sx={{ p: 2 }}>
          <Stack direction={'row'} gap={1} sx={{ mb: 2 }}>
            <Services
              services={services}
              setSelectedServices={setSelectedServices}
              selectedServices={selectedServices}
            />
            <Discounts
              discounts={discounts}
              setSelectedDiscounts={setSelectedDiscounts}
              selectedServices={selectedServices}
            />
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Box overflow={'auto'} height={'395px'}>
            <Stack gap={2} sx={{ py: 2 }}>
              {Object.keys(selectedServices).map((id) => (
                <ServiceItem
                  key={id}
                  id={id}
                  service={selectedServices[id]}
                  onChangeCount={onChangeCount}
                />
              ))}
              {Object.keys(selectedDiscounts).map((id) => (
                <DiscountItem
                  key={id}
                  id={id}
                  discount={selectedDiscounts[id]}
                  selectedServices={selectedServices}
                  onChangeDiscountTarget={onChangeDiscountTarget}
                />
              ))}
            </Stack>
          </Box>
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
            <Typography variant="h5">{comma(totalPrice)}원</Typography>
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
  onChangeCount,
}: {
  id: string;
  service: Service;
  onChangeCount: (id: string, count: number) => void;
}) {
  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
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
          {comma(service.price * service.count)}원
        </Typography>
      </Box>
      <QuantityInput onChangeCount={onChangeCount} id={id} />
    </Stack>
  );
}

function DiscountItem({
  id,
  discount,
  selectedServices,
  onChangeDiscountTarget,
}: {
  id: string;
  discount: DiscountWithTargets;
  selectedServices: { [key: string]: Service };
  onChangeDiscountTarget: (discountId: string, targets: string[]) => void;
}) {
  const [discountPrice, setDiscountPrice] = React.useState(0);
  const [discountItems, setDiscountItems] = React.useState<string[]>(
    discount.targets
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheckDiscountItem = (id: string, check: boolean) => {
    if (check) {
      setDiscountItems([...discountItems, id]);
    } else {
      setDiscountItems([...discountItems.filter((item) => item !== id)]);
    }
  };

  const handleSaveDiscountItem = () => {
    onChangeDiscountTarget(id, discountItems);
    handleClose();
  };

  React.useEffect(() => {
    let price = 0;
    discount.targets.map((targetId) => {
      if (selectedServices[targetId]) {
        price +=
          selectedServices[targetId].price *
          selectedServices[targetId].count *
          discount.rate;
      }
    });
    setDiscountPrice(Math.round(price));
  }, [discount.targets, selectedServices]);

  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
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
          {discount.name}
        </Typography>
        <Typography variant="body2" color="#b3b3b3">
          {discount.targets
            .map(
              (id, idx) =>
                selectedServices[id] &&
                `${
                  selectedServices[id]?.name.length > 10
                    ? `${selectedServices[id]?.name.substring(0, 3)}...`
                    : selectedServices[id]?.name
                }${
                  selectedServices[id]?.count > 1
                    ? `x${selectedServices[id]?.count}`
                    : ''
                }`
            )
            .join(',')}
        </Typography>
        <Typography variant="subtitle2" color="#EC8AAE">
          -{comma(discountPrice)}원({Math.round(discount.rate * 100)}%)
        </Typography>
      </Box>
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          variant="contained"
          sx={{
            bgcolor: '#F7F7F7',
            color: '#B8BFC9',
            boxShadow: 'none',
            borderRadius: '999px',
            minWidth: '10px',
          }}
        >
          수정
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          slotProps={{
            paper: {
              style: {
                maxHeight: '90vh',
              },
            },
          }}
          sx={{
            '& >.MuiPaper-root': {
              width: '100vw',
            },
            '& ul': {
              p: 0,
            },
          }}
        >
          <Stack sx={{ p: 2 }} gap={1}>
            <Typography variant="subtitle1">{discount.name}</Typography>
            <Divider />
            <Stack>
              {Object.keys(selectedServices).map((id) => (
                <MenuServiceItem
                  id={id}
                  service={selectedServices[id]}
                  check={discount.targets.includes(id)}
                  handleCheckDiscountItem={handleCheckDiscountItem}
                />
              ))}
            </Stack>
          </Stack>
          <Paper>
            <Stack direction={'row'} sx={{ width: '100%' }}>
              <Button
                fullWidth
                sx={{ py: 1.5, color: '#EC8AAE' }}
                onClick={handleClose}
              >
                삭제
              </Button>
              <Button
                fullWidth
                sx={{ py: 1.5, color: '#b3b3b3' }}
                onClick={handleSaveDiscountItem}
              >
                확인
              </Button>
            </Stack>
          </Paper>
        </Menu>
      </div>
    </Stack>
  );
}

function MenuServiceItem({
  id,
  service,
  check,
  handleCheckDiscountItem,
}: {
  id: string;
  service: Service;
  check: boolean;
  handleCheckDiscountItem: (id: string, check: boolean) => void;
}) {
  const [isCheck, setIsCheck] = React.useState<boolean>(check);

  const handleCheck = () => {
    handleCheckDiscountItem(id, !isCheck);
    setIsCheck(!isCheck);
  };
  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      key={id}
      onClick={handleCheck}
      sx={{
        width: '100%',
      }}
    >
      <Box sx={{ flexGrow: 1, maxWidth: '80%' }}>
        <Typography variant="subtitle2">
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '80%',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              verticalAlign: 'middle',
            }}
          >
            {service.name}
          </span>
          {service.count > 1 ? `x${service.count}` : ''}
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
