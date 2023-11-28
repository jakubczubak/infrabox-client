import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import styles from './css/ToolGroupItem.module.css';
import { toolManager } from './service/toolManager';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteModal } from '../common/DeleteModal';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ToolGroupModal_EDIT } from './ToolGroupModal_EDIT';
import { showNotification } from '../common/service/showNotification';
import { useEffect } from 'react';

export const ToolGroupItem = ({ tool }) => {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [toolGroupValue, setToolGroupValue] = useState(0);

  useEffect(() => {
    setToolGroupValue(toolManager.calculateValueOfToolsInToolGroup(tool));
  }, [tool]);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (tool.tools.length > 0) {
      setIsOpenDeleteModal(false);
      showNotification('This tool group has tools. Please delete them first.', 'error', dispatch);
    } else {
      toolManager.deleteToolGroup(tool.id, queryClient, dispatch);
      setIsOpenDeleteModal(false);
    }
  };

  return (
    <>
      <Box className={styles.item}>
        <Card>
          <CardMedia
            component="img"
            image={tool.imageURL ? tool.imageURL : require(`../../assets/tools/${tool.type}.png`)}
            alt={tool.name}
            sx={{
              height: 150,
              objectFit: 'contain',
              position: 'center',
              padding: '10px',
              borderBottom: 'thin solid #e8e8e8',
              backgroundColor: '#fafafa'
            }}
          />
          <CardContent className={styles.item_content}>
            <Typography variant="h6" gutterBottom>
              {tool.name}
            </Typography>
            <p className={styles.value}>
              {toolGroupValue} <span className={styles.value_text}>PLN</span>
            </p>
          </CardContent>
          <CardActions>
            <Tooltip title="Check" placement="top">
              <Link to={`/tools/` + tool.id} className={styles.link}>
                <Button size="small">Check</Button>
              </Link>
            </Tooltip>

            <Tooltip title="Edit" placement="top">
              <EditIcon
                color="action"
                fontSize="6px"
                onClick={() => setIsOpenEditModal(true)}
                className={styles.icon}
              />
            </Tooltip>
            <Tooltip title="Delete" placement="top">
              <DeleteIcon
                color="action"
                fontSize="6px"
                className={styles.icon}
                onClick={setIsOpenDeleteModal}
              />
            </Tooltip>
          </CardActions>
        </Card>
        <ToolGroupModal_EDIT
          open={isOpenEditModal}
          onClose={() => setIsOpenEditModal(false)}
          item={tool}
        />
        <DeleteModal
          open={isOpenDeleteModal}
          onCancel={() => {
            setIsOpenDeleteModal(false);
          }}
          onDelete={handleDelete}
          name={tool.name}
          text="tool group"
        />
      </Box>
    </>
  );
};
