import React from 'react';
import styles from './css/RecycleItem.module.css';
import { Breadcrumbs, Typography, Button, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm, Controller, set } from 'react-hook-form';
import { Input } from '../common/Input';
import { DateCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers';
import { yupResolver } from '@hookform/resolvers/yup';
import { recycleValidationSchema } from './service/validationSchema/recycleValidationSchema';
import { recycleManager } from './service/recycleManager';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import animation from '../../assets/Lottie/eco_v4.json';
import RecyclingOutlinedIcon from '@mui/icons-material/RecyclingOutlined';
import { MenuItem, Select, TextField, InputAdornment } from '@mui/material';
import 'dayjs/locale/pl';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useState } from 'react';

export const RecycleItem = () => {
  const { state } = useLocation();
  const [wasteName, setWasteName] = useState('');
  const [errorName, setErrorName] = useState(false);
  const [wasteQuantity, setWasteQuantity] = useState(0);
  const [errorQuantity, setErrorQuantity] = useState(false);
  const [wastePrice, setWastePrice] = useState(0);
  const [errorPrice, setErrorPrice] = useState(false);
  const [wasteValue, setWasteValue] = useState(0);
  const [wasteList, setWasteList] = useState([]);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      receiver: state ? state.receiver : '',
      carID: state ? state.carID : '',
      type: state ? state.type : '',
      date: state ? dayjs(state.date, 'DD/MM/YYYY') : dayjs(new Date()),
      time: state ? dayjs(new Date().toISOString().slice(0, 10) + 'T14:42') : dayjs(new Date())
    },
    resolver: yupResolver(recycleValidationSchema)
  });

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const localTime = dayjs(data.time).locale('pl').format('HH:mm');
    const localDate = dayjs(data.date).locale('pl').format('DD/MM/YYYY');

    data.time = localTime;
    data.date = localDate;

    const value = data.wasteList.reduce((acc, curr) => acc + curr.wasteValue, 0);

    data.value = value;

    if (state) {
      data.id = state.id;
      recycleManager.updateWTC(data, queryClient, dispatch);
    } else {
      recycleManager.createWTC(data, queryClient, dispatch);
    }

    navigate('/recycling');
  };

  const validateWaste = () => {
    let isValidate = true;

    if (wasteQuantity === '') {
      setErrorQuantity(true);
      isValidate = false;
    } else {
      setErrorQuantity(false);
    }

    if (wasteName === '') {
      setErrorName(true);
      isValidate = false;
    } else {
      setErrorName(false);
    }

    if (wastePrice === '') {
      setErrorPrice(true);
      isValidate = false;
    } else {
      setErrorPrice(false);
    }

    const quantity = parseFloat(wasteQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      setErrorQuantity(true);
      isValidate = false;
    } else {
      setErrorQuantity(false);
    }

    const price = parseFloat(wastePrice);
    if (isNaN(price) || price <= 0) {
      setErrorPrice(true);
      isValidate = false;
    } else {
      setErrorPrice(false);
    }

    return isValidate; // true or false
  };

  const handleAddWaste = () => {
    const isValidate = validateWaste();

    if (isValidate) {
      const wasteValue = wasteQuantity * wastePrice;

      const waste = {
        wasteName: wasteName,
        wasteQuantity: wasteQuantity,
        wastePrice: wastePrice,
        wasteValue: wasteValue
      };

      setWasteList([...wasteList, waste]);
      setWasteName('');
      setWasteQuantity(0);
      setWastePrice(0);
      setWasteValue(0);
    }
  };

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<Typography color="text.primary">/</Typography>}>
        <Typography color="text.primary">...</Typography>

        <Typography color="text.primary">
          <Link to="/recycling" className={styles.link}>
            Recycling
          </Link>
        </Typography>
        <Typography color="text.primary">Waste transfer card</Typography>
      </Breadcrumbs>
      <div className={styles.header}>
        <Typography variant="h5" component="div">
          {state ? 'Update waste transfer card' : 'Waste transfer card'}
        </Typography>
      </div>

      <div className={styles.wtc_wrapper}>
        <Lottie animationData={animation} loop={true} className={styles.animation} />

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <p className={styles.title}>Waste management (BDO)</p>

          <div className={styles.data_container}>
            <div className={styles.inputs}>
              <Controller
                name="status"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <>
                    <Tooltip title="Select type of waste">
                      <Select
                        onBlur={onBlur}
                        value={value}
                        variant="outlined"
                        onChange={onChange}
                        defaultValue={'production_waste'}
                        sx={{ textAlign: 'left', width: '325px' }}
                        error={!!error}>
                        <MenuItem value={'production_waste'}>
                          Recyclable waste (aluminum, steel, chips, etc.)
                        </MenuItem>
                        <MenuItem value={'disposal_service'}>
                          Non-recyclable waste (coolant, oils, etc.)
                        </MenuItem>
                      </Select>
                    </Tooltip>
                  </>
                )}
              />
              <Controller
                name="wase_code"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Input
                    error={error}
                    onBlur={onBlur}
                    value={value}
                    onChange={onChange}
                    variant="outlined"
                    label="Waste code"
                  />
                )}
              />
              <Controller
                name="receiver"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Input
                    error={error}
                    onBlur={onBlur}
                    value={value}
                    onChange={onChange}
                    variant="outlined"
                    label="Company name"
                  />
                )}
              />
              <Controller
                name="receiver"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Input
                    error={error}
                    onBlur={onBlur}
                    value={value}
                    onChange={onChange}
                    variant="outlined"
                    label="Tax identification number"
                  />
                )}
              />

              <Controller
                name="carID"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Input
                    error={error}
                    onBlur={onBlur}
                    value={value}
                    onChange={onChange}
                    variant="outlined"
                    label="Car ID"
                  />
                )}
              />
              <Controller
                name="time"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TimePicker
                    label="Time"
                    value={value}
                    onChange={onChange}
                    variant="filled"
                    views={['hours', 'minutes']}
                  />
                )}
              />
            </div>
            <div className={styles.date}>
              <Controller
                name="date"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DateCalendar value={value} onChange={onChange} />
                )}
              />
            </div>
            <div className={styles.waste_form}>
              <TextField
                label="Waste name"
                variant="outlined"
                value={wasteName}
                error={errorName}
                helperText={errorName ? 'Waste name is required' : ''}
                onChange={(e) => {
                  setWasteName(e.target.value);
                }}
              />
              <TextField
                label="Quantity"
                variant="outlined"
                error={errorQuantity}
                helperText={errorQuantity ? 'Quantity must be a number and greater than 0' : ''}
                value={wasteQuantity}
                onChange={(e) => {
                  const quantity = parseFloat(e.target.value);
                  if (isNaN(quantity) || quantity <= 0) {
                    setErrorQuantity(true);
                    setWasteQuantity(0);
                  } else {
                    setErrorQuantity(false);
                    setWasteQuantity(quantity);
                    setWasteValue(quantity * wastePrice);
                  }
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>
                }}
              />
              <TextField
                label="Price"
                variant="outlined"
                error={errorPrice}
                helperText={errorPrice ? 'Price must be a number and greater than 0' : ''}
                value={wastePrice}
                onChange={(e) => {
                  const price = parseFloat(e.target.value);
                  if (isNaN(price) || price <= 0) {
                    setErrorPrice(true);
                    setWastePrice(0);
                  } else {
                    setErrorPrice(false);
                    setWastePrice(price);
                    setWasteValue(price * wasteQuantity);
                  }
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">PLN/kg</InputAdornment>
                }}
              />
              <TextField
                label="Value"
                variant="outlined"
                disabled
                value={wasteValue}
                InputProps={{
                  endAdornment: <InputAdornment position="end">PLN</InputAdornment>
                }}
              />
              <Button
                variant="text"
                size="large"
                type="button"
                color="primary"
                onClick={handleAddWaste}
                endIcon={<AddOutlinedIcon />}>
                Add waste item
              </Button>
            </div>
          </div>
          {wasteList.length > 0 && <p className={styles.waste_list}>WASTE LIST</p>}
          <Button
            variant="contained"
            size="large"
            type="submit"
            color={state ? 'primary' : 'success'}
            endIcon={<RecyclingOutlinedIcon />}>
            Recycle
          </Button>
        </form>
      </div>
    </>
  );
};
