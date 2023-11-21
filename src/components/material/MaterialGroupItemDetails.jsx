import styles from './css/MaterialItemDetails.module.css';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs, Typography, SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import { materialManager } from './service/materialManager';
import { useQuery } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { MaterialModal_ADD } from './MaterialModal_ADD';
import { useState } from 'react';
import { MaterialList } from './MaterialList';

import { Loader } from '../common/Loader';
import { Error } from '../common/Error';

export const MaterialGroupItemDetails = () => {
  const [openMaterialModal, setOpenMaterialModal] = useState(false);
  let { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['material', id],
    queryFn: () => materialManager.getMaterialGroupByID(id)
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={'Failed to fetch materials, please try again later.'} />;
  }

  return (
    <div>
      <Breadcrumbs
        className={styles.breadcrumbs}
        aria-label="breadcrumb"
        separator={<Typography color="text.primary">/</Typography>}
      >
        <Typography color="text.primary">...</Typography>
        <Typography color="text.primary">
          <Link to="/materials" className={styles.link}>
            Materials
          </Link>
        </Typography>
        <Typography color="text.primary"> {data.name}</Typography>
      </Breadcrumbs>
      <div className={styles.header}>
        <Typography variant="h5" component="div">
          {data && data.name}
        </Typography>
        <Typography variant="subtitle1" component="div">
          {data &&
            data.materialDescription.name + ' ' + data.materialDescription.density + ' g/cm3'}
        </Typography>
      </div>
      <SpeedDial
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        ariaLabel="Navigation speed dial"
        sx={speedDialStyles}
      >
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Create"
          onClick={() => {
            setOpenMaterialModal(true);
          }}
        />
      </SpeedDial>
      <MaterialModal_ADD
        open={openMaterialModal}
        onClose={() => setOpenMaterialModal(false)}
        item={data}
      />
      <MaterialList item={data} />
    </div>
  );
};

const speedDialStyles = {
  position: 'fixed',
  bottom: 16,
  right: 16
};
