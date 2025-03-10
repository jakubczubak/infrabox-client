import React from 'react';
import { NCProgram } from './NCProgram';
import styles from './css/productionQueue.module.css';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export const CompletedProgramsList = ({ programs, title, droppableId }) => {
  const { setNodeRef } = useDroppable({
    id: droppableId,
    data: { parent: droppableId }
  });

  return (
    <div className={styles.nc_programs_container}>
      <h2 className={styles.production_header}>{title}</h2>
      <div ref={setNodeRef} className={styles.nc_programs_row} style={{ minHeight: '190px' }}>
        {programs.length === 0 && <div className={styles.placeholder}>No programs here yet!</div>}
        <SortableContext items={programs.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          {programs.map((program, index) => (
            <NCProgram
              program={program}
              key={`${title}-${program.id}`}
              index={index}
              parent={droppableId}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
