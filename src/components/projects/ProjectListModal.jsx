// Importy zewnętrzne
import React from 'react';
import ReactDom from 'react-dom';
import { Controller } from 'react-hook-form';
import { Stack, Button } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { projectListValidationSchema } from './validationSchema/projectListValidationSchema';
import Lottie from 'lottie-react';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useEffect } from 'react';
// Importy lokalne
import styles from './css/ProjectListModal.module.css';
import animation from '../../assets/Lottie/project.json';
import { projectListManager } from './service/projectListManager';
import { Input } from '../common/Input';

export const ProjectListModal = ({ open, item, onClose }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(projectListValidationSchema)
  });

  useEffect(() => {
    if (item) {
      setValue('name', item.name);
    }
  }, [item]);

  const handleForm = (data) => {
    if (item) {
      data.id = item.id;
      projectListManager.updateProject(data, queryClient, dispatch);
      onClose();
    } else {
      projectListManager.createProject(data, queryClient, dispatch);
      onClose();
    }
  };

  if (!open) {
    return null;
  }

  return ReactDom.createPortal(
    <>
      <div className={styles.modal_container}>
        <div className={styles.modal}>
          <Lottie animationData={animation} loop={true} className={styles.animation} />
          <div className={styles.modal_header}>
            <h2>Project name</h2>
          </div>
          <form onSubmit={handleSubmit(handleForm)}>
            <Stack spacing={2} className={styles.login_content}>
              <Controller
                name="name"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Input
                    variant="standard"
                    error={error}
                    placeholder="LSR10"
                    onBlur={onBlur}
                    value={value}
                    onChange={onChange}
                    label="Project name"
                  />
                )}
              />
              {item ? (
                <Button type="submit" variant="contained" size="large" color="warning">
                  Update
                </Button>
              ) : (
                <Button type="submit" variant="contained" size="large">
                  Create
                </Button>
              )}
              <Button variant="text" size="large" onClick={onClose}>
                Cancel
              </Button>
            </Stack>
          </form>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
};
