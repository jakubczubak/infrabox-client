import styles from './css/Material.module.css';
import ReactDom from 'react-dom';
import React from 'react';
import { Stack, Button, InputAdornment } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { plateValidationSchema } from './validationSchema/plateValidationSchema';
import { rodValidationSchema } from './validationSchema/rodValidationSchema';
import { tubeValidationSchema } from './validationSchema/tubeValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';

import { useQueryClient } from '@tanstack/react-query';
import { Input } from '../common/Input';
import { useState, useEffect } from 'react';
import { Dimensions } from './Dimensions';
import { materialManager } from './service/materialManager';
import { calculateVolume } from './service/calcualteVolume';
import { calculateWeight } from './service/calculateWeight';
import { calculatePrice } from './service/calculatePrice';
import { calcualteTotalPrice } from './service/calcualteTotalPrice';
import { useDispatch } from 'react-redux';
import plate_image from '../../assets/plate.png';
import rod_image from '../../assets/rod.png';
import tube_image from '../../assets/tube.png';

export const MaterialModal_ADD = ({ open, onClose, item }) => {
  const [weight, setWeight] = useState(0);
  const [price, setPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const validationSchema = () => {
    if (item.type == 'Plate') {
      return plateValidationSchema;
    }
    if (item.type == 'Rod') {
      return rodValidationSchema;
    }
    if (item.type == 'Tube') {
      return tubeValidationSchema;
    }
  };

  const { handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      x: '',
      y: '',
      z: '',
      quantity: '',
      minQuantity: '',
      pricePerKg: '',
      diameter: '',
      thickeness: '',
      length: '',
      type: item.type,
      quantityInTransit: 0,
      prices: []
    },
    resolver: yupResolver(validationSchema())
  });

  useEffect(() => {
    const x = watch('x'); //width
    const y = watch('y'); //height
    const z = watch('z'); //thickness

    const diameter = watch('diameter'); //diameter
    const thickeness = watch('thickeness'); //thickeness
    const length = watch('length'); //length
    const quantity = watch('quantity'); //quantity
    const pricePerKg = watch('pricePerKg'); //price per kg

    const volume = calculateVolume(x, y, z, diameter, thickeness, length, item.type); //calculate volume
    const weight = calculateWeight(volume, item.materialDescription.density); //calculate weight
    const price = calculatePrice(weight, pricePerKg); //calculate price
    const totalPrice = calcualteTotalPrice(price, quantity); //calculate total price

    setWeight(weight);
    setPrice(price);
    setTotalPrice(totalPrice);
  }, [watch()]);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const handleForm = (data) => {
    let name;
    switch (item.type) {
      case 'Plate':
        name = `${item.name}: ${data.z}x${data.x}x${data.y}`;
        break;
      case 'Rod':
        name = `${item.name}: ⌀${data.diameter}x${data.length}`;
        break;
      case 'Tube':
        name = `${item.name}: ⌀${data.diameter}x${data.thickeness}x ${data.length}`;
        break;
      default:
        name = ''; // Domyślna wartość lub obsługa błędu
    }

    data.name = name;
    data.materialGroupID = item.id;

    console.log(data);
    materialManager.createMaterial(data, queryClient, dispatch);
    onClose();
    reset();
  };

  if (!open) {
    return null;
  }

  return ReactDom.createPortal(
    <div className={styles.modal_container}>
      <div className={styles.modal}>
        {item.type == 'Plate' && (
          <div className={styles.modal_image_wrapper}>
            <img src={plate_image} alt="plate" className={styles.modal_image} />
          </div>
        )}
        {item.type == 'Rod' && (
          <div className={styles.modal_image_wrapper}>
            <img src={rod_image} alt="rod" className={styles.modal_image} />
          </div>
        )}
        {item.type == 'Tube' && (
          <div className={styles.modal_image_wrapper}>
            <img src={tube_image} alt="tube" className={styles.modal_image} />
          </div>
        )}
        <div className={styles.modal_header}>{<h2>{item.type} dimension</h2>}</div>
        <form onSubmit={handleSubmit(handleForm)}>
          <Dimensions control={control} type={item.type} />
          <Stack spacing={1} mt={2} className={styles.login_content} direction="row">
            <Controller
              name="quantity"
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <Input
                  error={error}
                  placeholder="1"
                  onBlur={onBlur}
                  value={value}
                  onChange={onChange}
                  label="Quantity"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">x</InputAdornment>
                  }}
                />
              )}
            />
            <Controller
              name="minQuantity"
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <Input
                  error={error}
                  placeholder="1"
                  onBlur={onBlur}
                  value={value}
                  onChange={onChange}
                  label="Min. quantity"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">x</InputAdornment>
                  }}
                />
              )}
            />
            <Controller
              name="pricePerKg"
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <Input
                  error={error}
                  placeholder="42.5"
                  onBlur={onBlur}
                  value={value}
                  onChange={onChange}
                  label="Price"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">PLN/kg</InputAdornment>
                  }}
                />
              )}
            />
          </Stack>
          <Stack spacing={1} mb={5} mt={5} className={styles.login_content} direction="row">
            <Input
              value={price}
              label="Price net (1x)"
              disabled
              variant="filled"
              InputProps={{
                endAdornment: <InputAdornment position="end">PLN</InputAdornment>
              }}
            />
            <Input
              value={weight}
              label="Weight"
              disabled
              variant="filled"
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>
              }}
            />
            <Input
              value={totalPrice}
              label="Total net"
              disabled
              variant="filled"
              InputProps={{
                endAdornment: <InputAdornment position="end">PLN</InputAdornment>
              }}
            />
          </Stack>
          <Button type="submit" variant="contained" size="large">
            Create
          </Button>
          <Button variant="text" size="large" onClick={onClose}>
            Cancel
          </Button>
        </form>
      </div>
    </div>,
    document.getElementById('portal')
  );
};
