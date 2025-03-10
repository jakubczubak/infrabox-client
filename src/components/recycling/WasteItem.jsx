// Importy zewnętrzne
import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import 'dayjs/locale/pl';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// Importy lokalne
import styles from './css/RecycleItem.module.css';

export const WasteItem = ({ index, item, recyclingItems, setRecyclingItems }) => {
  return (
    <div className={styles.waste_item}>
      <Tooltip PopperProps={{ disablePortal: true }} title="Waste name">
        <p className={styles.waste_name}>{item.name}</p>
      </Tooltip>
      <Tooltip PopperProps={{ disablePortal: true }} title="Quantity">
        <p className={styles.waste_quantity}>{item.quantity} kg</p>
      </Tooltip>
      <Tooltip PopperProps={{ disablePortal: true }} title="Price per kg">
        <p className={styles.waste_price}>{item.pricePerKg} PLN/kg</p>
      </Tooltip>
      <Tooltip PopperProps={{ disablePortal: true }} title="Value">
        <p className={styles.waste_value}>{item.totalPrice} PLN</p>
      </Tooltip>
      <IconButton
        aria-label="delete"
        onClick={() => {
          const list = recyclingItems.filter((_, i) => i !== index);
          setRecyclingItems(list);
        }}>
        <Tooltip PopperProps={{ disablePortal: true }} title="Delete">
          <DeleteOutlineOutlinedIcon />
        </Tooltip>
      </IconButton>
    </div>
  );
};
