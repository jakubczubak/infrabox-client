import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './css/OrderItem.module.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { orderItemValidationSchema } from './service/validationSchema/orderItemValidationSchema';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import {
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Breadcrumbs,
  Button,
  Typography,
  TextareaAutosize,
  IconButton,
  Tooltip,
  InputAdornment
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { cartManager } from '../cart/service/cartManager';
import { useState, useEffect } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import dayjs from 'dayjs';
import { supplierManager } from '../supplier/service/supplierManager';

export const OrderItem = () => {
  const { state } = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const items = cartManager.getItems();
      try {
        const supplierList = await supplierManager.getSupplierList();
        setSuppliers(supplierList);
        setCartItems(items);
      } catch (error) {
        console.error('Error while fetching the list of suppliers.', error);
      }
    };

    fetchData();
  }, []);

  const { handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      orderName: state ? state.orderName : '',
      selectedDate: state ? dayjs(state.selectedDate, 'DD/MM/YYYY') : dayjs(new Date()),
      status: state ? state.status : 'pending',
      supplier_email: state ? state.supplier_email : '',
      supplier_message: state ? state.supplier_message : ''
    },
    resolver: yupResolver(orderItemValidationSchema),
    mode: 'onChange'
  });

  const handleSubmitForm = (data) => {
    console.log(data);
  };

  const handleIncrease = (itemList) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.name === itemList.name) {
          return {
            ...item,
            quantity: item.quantity + 1
          };
        }
        return item;
      });
    });
  };

  const handleDecrease = (itemList) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.name === itemList.name && item.quantity > 1) {
          return {
            ...item,
            quantity: item.quantity - 1
          };
        }
        return item;
      });
    });
  };

  const handleRemove = (itemList) => {
    setCartItems((prevItems) => {
      return prevItems.filter((item) => item.name !== itemList.name);
    });
  };

  const handleAutoMessage = () => {
    reset({
      supplier_message:
        'Dzień dobry, \n\n Proszę o ofertę na następujące pozycje: \n\n' +
        cartItems
          .map((item, index) => `${index + 1}. ${item.name} - ${item.quantity} szt. \n`)
          .join('') +
        '\nPozdrawiam, \n\n'
    });
  };
  const handleGenerateEmail = () => {
    const email = watch('supplier_email');
    const subject = `Zapytanie ofertowe - ${watch('orderName')}`;
    const body = watch('supplier_message');

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<Typography color="text.primary">/</Typography>}>
        <Typography color="text.primary">...</Typography>
        <Link color="inherit" to="/orders" className={styles.link}>
          <Typography color="text.primary">Orders</Typography>
        </Link>
        {state ? (
          <Typography color="text.primary">Edit order</Typography>
        ) : (
          <Typography color="text.primary">New order</Typography>
        )}
      </Breadcrumbs>
      <div className={styles.header}>
        {state ? (
          <Typography variant="h5" component="div">
            Edit order
          </Typography>
        ) : (
          <Typography variant="h5" component="div">
            Create order
          </Typography>
        )}
      </div>
      <form onSubmit={handleSubmit(handleSubmitForm)} className={styles.order_container}>
        <div className={styles.order_general_info}>
          <Controller
            name="orderName"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <TextField
                id="outlined-basic"
                label="Order name"
                variant="outlined"
                error={!!error}
                onBlur={onBlur}
                value={value}
                onChange={onChange}
                helperText={error ? error.message : null}
                mb={16}
              />
            )}
          />
          <Controller
            name="selectedDate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker value={value} onChange={onChange} />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <>
                <InputLabel id="select-label">Status:</InputLabel>
                <Select
                  labelId="select-label"
                  onBlur={onBlur}
                  value={value}
                  onChange={onChange}
                  error={!!error}>
                  <MenuItem value={'pending'}>Pending</MenuItem>
                  <MenuItem value={'sent_inquiry'}>Sent inquiry</MenuItem>
                  <MenuItem value={'on_the_way'}>On the way</MenuItem>
                  <MenuItem value={'delivered'}>Delivered</MenuItem>
                </Select>
              </>
            )}
          />
        </div>
        <div className={styles.line} />
        <div>
          <h3 className={styles.order_header}>Item list</h3>

          <div className={styles.list}>
            {cartItems &&
              cartItems.map((item, index) => (
                <div key={index} className={styles.list_item}>
                  <Tooltip title={item.name} placement="top">
                    <span className={styles.item_name}>
                      {index + 1}. {item.name}
                    </span>
                  </Tooltip>
                  <span className={styles.item_quantity}>
                    <Tooltip title="Increase quantity" placement="top">
                      <IconButton onClick={() => handleIncrease(item)}>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                    ({item.quantity})
                    <Tooltip title="Decrease quantity" placement="top">
                      <IconButton onClick={() => handleDecrease(item)}>
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                  </span>
                  {item.item.pricePerKg && (
                    <>
                      <Tooltip title="Price per kg" placement="top">
                        <span className={styles.item_price}>
                          {item.item.pricePerKg.toFixed(2)} PLN/kg
                        </span>
                      </Tooltip>
                      <Tooltip title="Price" placement="top">
                        <span className={styles.item_price}>
                          {(item.item.price * item.quantity).toFixed(2)} PLN
                        </span>
                      </Tooltip>
                      <Tooltip title="New price per kg (if changed)" placement="top">
                        <TextField
                          placeholder="No change"
                          size="small"
                          sx={{ width: '180px' }}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">PLN/kg</InputAdornment>
                          }}
                        />
                      </Tooltip>
                    </>
                  )}

                  <Tooltip title="Remove item" placement="top">
                    <IconButton onClick={() => handleRemove(item)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              ))}
          </div>
        </div>
        <div className={styles.line} />
        <div>
          <h3 className={styles.order_header}>Supplier</h3>
          <Controller
            name="supplier_email"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <>
                <Select
                  labelId="select-label"
                  onBlur={onBlur}
                  value={value}
                  placeholder="Select supplier"
                  sx={{ width: 250 }}
                  onChange={onChange}
                  error={!!error}>
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.email}>
                      {supplier.email}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          />
        </div>
        <div className={styles.line} />

        <div>
          <h3 className={styles.order_header}>
            Message to supplier{' '}
            <Tooltip title="Generate auto message" placement="top">
              <IconButton onClick={handleAutoMessage}>
                <AutoAwesomeIcon />
              </IconButton>
            </Tooltip>
          </h3>
          <Controller
            name="supplier_message"
            control={control}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <TextareaAutosize
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                placeholder="Hi, I would like to order..."
                minRows={10}
                maxRows={12}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  resize: 'none',
                  outline: 'none',
                  backgroundColor: 'inherit'
                }}
                error={error}
              />
            )}
          />
          <div className={styles.send_icon}>
            <Tooltip title="Email" placement="left">
              <IconButton aria-label="send" onClick={handleGenerateEmail}>
                <SendIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className={styles.line} />
        <div className={styles.form_btn}>
          <Button type="submit" variant="contained" color="primary">
            Create Order
          </Button>
        </div>
      </form>
    </div>
  );
};
