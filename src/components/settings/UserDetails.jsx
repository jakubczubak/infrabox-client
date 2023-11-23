import React from 'react';
import { Button, TextField } from '@mui/material';
import styles from './css/UserDetails.module.css';
import Lottie from 'lottie-react';
import animation from '../../assets/Lottie/my_profile.json';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userValidationSchema } from './service/validationSchema/userValidationSchema';
import { userManager } from './service/userManager';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';

export const UserDetails = () => {
  const { data, isLoading, isError } = useQuery(['userData'], () => userManager.getUserData());

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      isPassword: false,
      confirmPassword: '',
      actualPassword: ''
    },
    resolver: yupResolver(userValidationSchema)
  });

  useEffect(() => {
    if (data) {
      setValue('id', data.id);
      setValue('firstName', data.firstName);
      setValue('lastName', data.lastName);
      setValue('email', data.email);
    }
  }, [data, setValue]);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    userManager.updateUser(data, queryClient, dispatch);
    setValue('actualPassword', '');
    setValue('password', '');
    setValue('confirmPassword', '');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error />;
  }

  if (data) {
    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.userDetails_container}>
            <div className={styles.user_overview}>
              <div className={styles.user_overview_logo}>
                <Lottie animationData={animation} loop={true} className={styles.animation} />
              </div>
              <div className={styles.user_overview_details}>
                <p className={styles.user_overview_details_fullname}>
                  {data.firstName + ' ' + data.lastName}
                </p>
                <p className={styles.user_overview_details_email}>{data.email}</p>
              </div>
            </div>
            <div className={styles.user_inputs}>
              <p className={styles.userDetails_title}>Profile details:</p>
              <Controller
                name="firstName"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    error={!!error}
                    helperText={error ? error.message : null}
                    label="Name"
                    size="small"
                    variant="outlined"
                    className={styles.wider_textfield}
                    value={value}
                    onChange={onChange}
                    InputProps={{
                      endAdornment: <BadgeOutlinedIcon sx={{ color: '#767676' }} />
                    }}
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    error={!!error}
                    helperText={error ? error.message : null}
                    label="Surname"
                    size="small"
                    variant="outlined"
                    className={styles.wider_textfield}
                    onChange={onChange}
                    value={value}
                    InputProps={{
                      endAdornment: <BadgeOutlinedIcon sx={{ color: '#767676' }} />
                    }}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    error={!!error}
                    helperText={error ? error.message : null}
                    label="Email"
                    size="small"
                    variant="outlined"
                    className={styles.wider_textfield}
                    onChange={onChange}
                    value={value}
                    disabled
                    InputProps={{
                      endAdornment: <EmailOutlinedIcon sx={{ color: '#767676' }} />
                    }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  const isInvalidLength = value && value.length < 4;
                  const errorMessage = isInvalidLength
                    ? 'Password must be at least 4 characters long'
                    : error?.message;

                  return (
                    <TextField
                      error={!!errorMessage}
                      helperText={errorMessage}
                      label="New password (optional)"
                      size="small"
                      variant="outlined"
                      type="password"
                      value={value}
                      className={styles.wider_textfield}
                      onChange={onChange}
                      InputProps={{
                        endAdornment: <KeyOutlinedIcon sx={{ color: '#767676' }} />
                      }}
                    />
                  );
                }}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    error={!!error}
                    helperText={error ? error.message : null}
                    label="Confirm password"
                    size="small"
                    variant="outlined"
                    type="password"
                    value={value}
                    className={styles.wider_textfield}
                    onChange={onChange}
                    InputProps={{
                      endAdornment: <KeyOutlinedIcon sx={{ color: '#767676' }} />
                    }}
                  />
                )}
              />
              <Controller
                name="actualPassword"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    error={!!error}
                    helperText={error ? error.message : null}
                    label="Actual password"
                    size="small"
                    variant="outlined"
                    type="password"
                    value={value}
                    className={styles.wider_textfield}
                    onChange={onChange}
                    InputProps={{
                      endAdornment: <KeyOutlinedIcon sx={{ color: '#767676' }} />
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className={styles.userDetails_wrapper}>
            <Button variant="contained" size="size" type="submit">
              Change profile details
            </Button>
          </div>
        </form>
      </>
    );
  }
};
