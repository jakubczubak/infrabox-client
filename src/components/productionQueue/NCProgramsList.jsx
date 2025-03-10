import React from 'react';
import { NCProgram } from './NCProgram';
import styles from './css/productionQueue.module.css';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

export const NCProgramsList = ({ programs, title, droppableId }) => {
  const { setNodeRef } = useDroppable({
    id: droppableId,
    data: { parent: droppableId }
  });

  return (
    <div className={styles.nc_programs_container}>
      <h2 className={styles.production_header}>{title}</h2>
      <div ref={setNodeRef} className={styles.nc_programs_row}>
        {programs.length === 0 && <div className={styles.placeholder}>No programs here yet!</div>}
        <SortableContext items={programs.map((p) => p.id)} strategy={rectSortingStrategy}>
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
