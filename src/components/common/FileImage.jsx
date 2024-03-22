//Import zewnętrzne
import React from 'react';
import { Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQueryClient } from '@tanstack/react-query';
//Importy lokalne
import styles from './css/FileImage.module.css';
import noImage from '../../assets/no-image.png';
import { fileImageManager } from './service/fileImageManager';

export const FileImage = ({ fileObject, materialGroupID, toolGroupID, toolType }) => {
  const queryClient = useQueryClient();

  if (toolType && !fileObject) {
    return (
      <div>
        <img
          src={require(`../../assets/tools/${toolType}.png`)}
          alt="empty"
          className={styles.img}
        />
      </div>
    );
  }

  if (!fileObject) {
    return (
      <div>
        <img src={noImage} alt="empty" className={styles.img} />
      </div>
    );
  }

  const { name, type, imageData } = fileObject;
  const imgSrc = `data:${type};base64,${imageData}`;

  const handleImageDelete = () => {
    if (materialGroupID) {
      fileImageManager.deleteMaterialFileImage(fileObject.id, materialGroupID, queryClient);
    } else if (toolGroupID) {
      fileImageManager.deleteToolFileImage(fileObject.id, toolGroupID, queryClient);
    }
  };

  return (
    <div>
      <img src={imgSrc} alt={name} className={styles.img} />
      <Tooltip title="Delete this image" placement="top">
        <DeleteIcon
          color="action"
          fontSize="6px"
          className={styles.icon}
          onClick={handleImageDelete}
        />
      </Tooltip>
    </div>
  );
};
