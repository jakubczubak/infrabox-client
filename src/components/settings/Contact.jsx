//Importy zewnętrzne
import React from 'react';
import Lottie from 'lottie-react';
import { IconButton, Tooltip } from '@mui/material';
//Importy loklane
import styles from './css/Contact.module.css';
import animation from '../../assets/Lottie/infinite.json';

export const Contact = () => {
  const author = 'Jakub Czubak';
  const version = '1.0.0';
  const email = 'czubakjakub94@gmail.com';
  const last_update = '2024-04-01';
  const title = 'INFRABOX';

  return (
    <div className={styles.contact_section}>
      <Lottie animationData={animation} loop={true} className={styles.animation} />
      <h3 className={styles.title}>{title}</h3>
      <h3 className={styles.version}>Version: {version}</h3>
      <h3 className={styles.date}>
        Last update: {last_update}
        <img src={require('../../assets/update.png')} alt="Orders" />
      </h3>
      <h3 className={styles.author}>Author: {author}</h3>
      <p className={styles.contact_text}>
        If you have any questions or suggestions, click below to contact me
      </p>
      <div className={styles.icon_wrapper}>
        <Tooltip title="Send me an email" arrow>
          <IconButton onClick={() => window.open(`mailto:${email}`)} disableRipple>
            <img src={require('../../assets/email.png')} alt="Email" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};
