import { IconButton } from '@mui/material';
import {
  FunctionsOutlined as FunctionsOutlinedIcon,
  AccessTime as AccessTimeIcon,
  InfoOutlined as InfoOutlinedIcon,
  DeleteOutlined as DeleteOutlinedIcon
} from '@mui/icons-material';
import { Draggable } from '@hello-pangea/dnd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import { motion } from 'framer-motion';
import styles from './css/productionQueue.module.css';

export const NCProgram = ({ program, index }) => {
  const handleDelete = () => {
    console.log('Delete program:', program.id);
  };

  const backgroundClasses = {
    mill: styles.backgroundMill,
    turn: styles.backgroundTurn
  };

  const itemClassName = `${styles.nc_programs_item} ${backgroundClasses[program.type] || ''}`;

  const subtypeColors = {
    plate: 'primary',
    part: 'secondary',
    modification: 'success',
    turn: 'error'
  };

  const countWorkdays = (startDate, endDate) => {
    let count = 0;
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(program.deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  const workdaysLeft = countWorkdays(today, deadlineDate);

  let deadlineColor = 'inherit';
  if (workdaysLeft <= 4) {
    deadlineColor = 'error';
  } else if (workdaysLeft >= 5 && workdaysLeft <= 9) {
    deadlineColor = 'warning';
  }

  return (
    <Draggable draggableId={program.id} index={index}>
      {(provided) => (
        <motion.div
          className={itemClassName}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}>
          <div className={styles.nc_programs_item_info}>
            {[
              { icon: <PushPinOutlinedIcon fontSize="small" />, text: program.name },
              { icon: <FunctionsOutlinedIcon fontSize="small" />, text: program.quantity },
              { icon: <AccessTimeIcon fontSize="small" />, text: program.time },
              {
                icon: <CalendarMonthIcon fontSize="small" color={deadlineColor} />,
                text: `${program.deadline} (${workdaysLeft} working days)`
              },
              { icon: <InfoOutlinedIcon fontSize="small" />, text: program.author }
            ].map((item, idx) => (
              <p key={idx} className={styles.nc_program_text}>
                {item.icon} {item.text}
              </p>
            ))}
          </div>
          <div className={styles.nc_programs_item_btn}>
            {program.subtype && subtypeColors[program.subtype] && (
              <IconButton size="small">
                <FiberManualRecordOutlinedIcon
                  color={subtypeColors[program.subtype]}
                  size="small"
                />
              </IconButton>
            )}
            <IconButton onClick={handleDelete} aria-label="delete" size="small">
              <DeleteOutlinedIcon color="action" />
            </IconButton>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
};
