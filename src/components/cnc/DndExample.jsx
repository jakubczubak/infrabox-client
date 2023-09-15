import React from 'react';
import { Column } from './Column';
import initialData from './service/initial-data';
import styles from './css/DndExample.module.css';

export const DndExample = () => {
  const state = initialData;

  return (
    <div className={styles.columns_wrapper}>
      {state.columnOrder.map((columnId) => {
        const column = state.columns[columnId];
        const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

        return <Column key={column.id} title={column.title} tasks={tasks} />;
      })}
    </div>
  );
};