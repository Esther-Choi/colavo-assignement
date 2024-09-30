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
import { Discount, DiscountWithTargets } from '../@types/Discount';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Discounts({
  discounts,
  setSelectedDiscounts,
  selectedServices,
}: {
  discounts: { [key: string]: Discount };
  setSelectedDiscounts: React.Dispatch<
    React.SetStateAction<{ [key: string]: DiscountWithTargets }>
  >;
  selectedServices: { [key: string]: Partial<Service> };
}) {
  const [open, setOpen] = React.useState(false);
  const [checkedDiscounts, setCheckedDiscounts] = React.useState<string[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const newObj: { [key: string]: DiscountWithTargets } = {};
    checkedDiscounts.map((el: string) => {
      newObj[el] = { ...discounts[el], targets: Object.keys(selectedServices) };
    });
    setSelectedDiscounts({ ...newObj });
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
          bgcolor: '#FFF1F6',
          color: '#EC8AAE',
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
                  할인
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
        <Stack sx={{ p: 2, pb: 18 }} gap={1}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography variant="subtitle2" color="#b3b3b3">
              커트
            </Typography>
            <Typography variant="subtitle2" color="#b3b3b3">
              바버,헤어
            </Typography>
          </Stack>
          <Divider />
          <Stack gap={2}>
            {Object.keys(discounts)?.map((id: string) => (
              <DicountItem
                id={id}
                discount={discounts[id]}
                checkedDiscounts={checkedDiscounts}
                setCheckedDiscounts={setCheckedDiscounts}
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
            할인을 선택하세요(여러 개 선택가능)
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

function DicountItem({
  id,
  discount,
  setCheckedDiscounts,
  checkedDiscounts,
}: {
  id: string;
  discount: Discount;
  setCheckedDiscounts: React.Dispatch<React.SetStateAction<string[]>>;
  checkedDiscounts: string[];
}) {
  const [isCheck, setIsCheck] = React.useState<boolean>(
    checkedDiscounts.includes(id)
  );

  const handleCheck = () => {
    if (isCheck) {
      setCheckedDiscounts(checkedDiscounts.filter((str) => str !== id));
    } else {
      setCheckedDiscounts([...checkedDiscounts, id]);
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
        <Typography variant="subtitle2" color="#EC8AAE">
          {Math.round(discount.rate * 100)}%
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
