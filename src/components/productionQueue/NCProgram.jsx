import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  FunctionsOutlined as FunctionsOutlinedIcon,
  AccessTime as AccessTimeIcon,
  DeleteOutlined as DeleteOutlinedIcon
} from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import styles from './css/productionQueue.module.css';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import AllInclusiveOutlinedIcon from '@mui/icons-material/AllInclusiveOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

export const NCProgram = ({ program, index, parent }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging // Dodajemy isDragging, aby wiedzieć, czy element jest przeciągany
  } = useSortable({
    id: program.id,
    data: { parent }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'opacity 0.2s ease' : transform ? 'transform 0.1s ease-out' : 'none'
  };

  const handleDelete = () => {
    console.log('Delete program:', program.id);
  };

  const backgroundClasses = {
    mill: styles.backgroundMill,
    turn: styles.backgroundTurn
  };

  const itemClassName = `${styles.nc_programs_item} ${
    backgroundClasses[program.type] || ''
  } ${isDragging ? styles.dragging : ''}`; // Dynamicznie dodajemy klasę dragging

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

  let deadlineIcon = <AllInclusiveOutlinedIcon fontSize="small" />;
  let deadlineText = 'No deadline';

  if (program.deadline) {
    const deadlineDate = new Date(program.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const workdaysLeft = countWorkdays(today, deadlineDate);

    let deadlineColor = 'inherit';
    if (workdaysLeft <= 4) {
      deadlineColor = 'error';
    } else if (workdaysLeft >= 5 && workdaysLeft <= 9) {
      deadlineColor = 'warning';
    }

    const calendarIconColor = program.isCompleted ? 'inherit' : deadlineColor;
    deadlineIcon = <CalendarMonthIcon fontSize="small" color={calendarIconColor} />;
    deadlineText = program.isCompleted
      ? `${program.deadline} (completed)`
      : `${program.deadline} (${workdaysLeft} working days)`;
  }

  const formatTime = (timeInMinutes) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}h:${formattedMinutes}m`;
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={itemClassName}>
      <div className={styles.nc_programs_item_info}>
        {[
          { icon: <PushPinOutlinedIcon fontSize="small" />, text: program.name },
          { icon: <BookmarkBorderOutlinedIcon fontSize="small" />, text: program.orderName },
          { icon: <FunctionsOutlinedIcon fontSize="small" />, text: `${program.quantity} pcs.` },
          { icon: <AccessTimeIcon fontSize="small" />, text: formatTime(program.time) },
          { icon: deadlineIcon, text: deadlineText },
          { icon: <PersonOutlineOutlinedIcon fontSize="small" />, text: program.author }
        ].map((item, idx) => (
          <p key={idx} className={styles.nc_program_text}>
            {item.icon} {item.text}
          </p>
        ))}
      </div>
      <div className={styles.nc_programs_item_btn}>
        {program.subtype && subtypeColors[program.subtype] && (
          <Tooltip
            title={program.subtype}
            arrow
            componentsProps={{ tooltip: { sx: { textTransform: 'capitalize' } } }}>
            <IconButton size="small">
              <FiberManualRecordOutlinedIcon color={subtypeColors[program.subtype]} size="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip PopperProps={{ disablePortal: true }} title="Delete" arrow>
          <IconButton size="small" onClick={handleDelete}>
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};
