import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  SpeedDial,
  Breadcrumbs,
  Typography,
  TextField,
  Tooltip,
  InputAdornment
} from '@mui/material';
import { Edit as EditIcon, Search as SearchIcon } from '@mui/icons-material';
import { SpeedDialIcon } from '@mui/material';
import styles from './css/productionQueue.module.css';
import { NCProgramsList } from './NCProgramsList';
import { CompletedProgramsList } from './CompletedProgramsList';
import { MachineCard } from './MachineCard';
import { arrayMove } from '@dnd-kit/sortable';
import { DndContext, closestCenter } from '@dnd-kit/core';

import bacaImage from '../../assets/production/BACA R1000.png';
import venusImage from '../../assets/production/VENUS 350.png';

// Dane programów
const initialProductionQueueData = {
  ncQueue: [
    {
      id: '1',
      name: '09_15_MRW14D_part_ready_now',
      orderName: 'Zamówienie Alfa',
      quantity: 10,
      time: 171,
      deadline: '',
      author: 'Jakub Czubak',
      type: 'mill',
      subtype: 'plate',
      date: '',
      order: 1,
      isCompleted: false
    },
    {
      id: '2',
      name: '14_01_DCB2D_mac1',
      orderName: 'Zamówienie Beta',
      quantity: 2,
      time: 90,
      deadline: '2025-03-02',
      author: 'Anna Kowalska',
      type: 'turn',
      subtype: 'turn',
      date: '',
      order: 2,
      isCompleted: false
    },
    {
      id: '3',
      name: '15_01_DCB2D_mac1',
      orderName: 'Projekt Gamma',
      quantity: 4,
      time: 190,
      deadline: '2025-03-02',
      author: 'Tomasz Zieliński',
      type: 'mill',
      subtype: 'part',
      date: '',
      order: 3,
      isCompleted: false
    },
    {
      id: '4',
      name: '2_MRW_14D_mac2',
      orderName: 'Zlecenie Delta',
      quantity: 8,
      time: 115,
      deadline: '2025-03-03',
      author: 'Kamil Szymański',
      type: 'mill',
      subtype: 'modification',
      date: '',
      order: 4,
      isCompleted: false
    },
    {
      id: '5',
      name: '16_01_DCB2D_mac1',
      orderName: 'Seria Omega',
      quantity: 5,
      time: 165,
      deadline: '2025-03-05',
      author: 'Monika Wójcik',
      type: 'turn',
      subtype: 'turn',
      date: '',
      order: 5,
      isCompleted: false
    },
    {
      id: '6',
      name: '17_01_DCB2D_mac2',
      orderName: 'Produkcja Sigma',
      quantity: 6,
      time: 205,
      deadline: '2025-03-06',
      author: 'Piotr Kowalski',
      type: 'mill',
      subtype: 'plate',
      date: '',
      order: 6,
      isCompleted: false
    },
    {
      id: '7',
      name: '18_01_DCB2D_mac1',
      orderName: 'Zamówienie Lambda',
      quantity: 3,
      time: 120,
      deadline: '2025-03-07',
      author: 'Olga Nowak',
      type: 'turn',
      subtype: 'turn',
      date: '',
      order: 7,
      isCompleted: false
    },
    {
      id: '8',
      name: '19_01_DCB2D_mac2',
      orderName: 'Zlecenie Kappa',
      quantity: 7,
      time: 250,
      deadline: '2025-03-08',
      author: 'Łukasz Cieślak',
      type: 'mill',
      subtype: 'part',
      date: '',
      order: 8,
      isCompleted: false
    },
    {
      id: '9',
      name: '20_01_DCB2D_mac1',
      orderName: 'Projekt Epsilon',
      quantity: 9,
      time: 330,
      deadline: '2025-03-09',
      author: 'Adam Wojciechowski',
      type: 'mill',
      subtype: 'modification',
      date: '',
      order: 9,
      isCompleted: false
    },
    {
      id: '10',
      name: '21_01_DCB2D_mac2',
      orderName: 'Seria Theta',
      quantity: 2,
      time: 80,
      deadline: '2025-03-10',
      author: 'Karolina Dąbrowska',
      type: 'turn',
      subtype: 'turn',
      date: '',
      order: 10,
      isCompleted: false
    },
    {
      id: '11',
      name: '22_01_DCB2D_mac1',
      orderName: 'Produkcja Zeta',
      quantity: 10,
      time: 360,
      deadline: '2025-03-11',
      author: 'Marek Jabłoński',
      type: 'mill',
      subtype: 'plate',
      date: '',
      order: 11,
      isCompleted: false
    },
    {
      id: '12',
      name: '23_01_DCB2D_mac2',
      orderName: 'Zamówienie Rho',
      quantity: 3,
      time: 150,
      deadline: '2025-03-12',
      author: 'Ewa Majewska',
      type: 'turn',
      subtype: 'turn',
      date: '',
      order: 12,
      isCompleted: false
    },
    {
      id: '13',
      name: '24_01_DCB2D_mac1',
      orderName: 'Projekt Omikron',
      quantity: 4,
      time: 105,
      deadline: '2025-03-13',
      author: 'Wojciech Jankowski',
      type: 'mill',
      subtype: 'part',
      date: '',
      order: 13,
      isCompleted: false
    },
    {
      id: '14',
      name: '25_01_DCB2D_mac2',
      orderName: 'Zlecenie Tau',
      quantity: 6,
      time: 180,
      deadline: '2025-03-14',
      author: 'Natalia Woźniak',
      type: 'mill',
      subtype: 'modification',
      date: '',
      order: 14,
      isCompleted: false
    },
    {
      id: '15',
      name: '26_01_DCB2D_mac1',
      orderName: 'Seria Iota',
      quantity: 7,
      time: 290,
      deadline: '2025-03-15',
      author: 'Krzysztof Lewandowski',
      type: 'turn',
      subtype: 'turn',
      date: '',
      order: 15,
      isCompleted: false
    }
  ],
  baca1: [
    {
      id: '16',
      name: '03_01_DCB2D_mac1',
      orderName: 'Zamówienie Chi',
      quantity: 2,
      time: 90,
      deadline: '2025-03-02',
      author: 'Damian Sobieraj',
      type: 'mill',
      subtype: 'plate',
      date: '',
      order: 16,
      isCompleted: false
    }
  ],
  baca2: [
    {
      id: '17',
      name: '04_01_DCB2D_mac2',
      orderName: 'Projekt Psi',
      quantity: 5,
      time: 195,
      deadline: '2025-03-03',
      author: 'Paweł Nowak',
      type: 'turn',
      subtype: 'turn',
      date: '',
      order: 17,
      isCompleted: false
    }
  ],
  vensu350: [
    {
      id: '18',
      name: '05_01_DCB2D_vensu',
      orderName: 'Produkcja Upsilon',
      quantity: 8,
      time: 240,
      deadline: '2025-03-04',
      author: 'Karolina Wiśniewska',
      type: 'mill',
      subtype: 'part',
      date: '',
      order: 18,
      isCompleted: false
    }
  ],
  completed: [
    {
      id: '19',
      name: '06_01_DCB2D_done',
      orderName: 'Zlecenie Phi',
      quantity: 3,
      time: 165,
      deadline: '2025-02-28',
      author: 'Mateusz Krawczyk',
      type: 'turn',
      subtype: 'turn',
      date: '',
      order: 19,
      isCompleted: true
    }
  ]
};

export const ProductionQueue = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [productionQueueData, setProductionQueueData] = useState(initialProductionQueueData);

  const speedDialStyles = {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 1000
  };

  const handleGenerateQueue = useCallback((machineId) => {
    console.log('Generowanie kolejki dla maszyny:', machineId);
  }, []);

  const handleSyncQueue = useCallback((machineId) => {
    console.log('Synchronizacja kolejki dla maszyny:', machineId);
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = active.data.current?.parent;
    const overContainer = over.data.current?.parent || over.id;

    if (activeContainer === overContainer) {
      const items = productionQueueData[activeContainer];
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      setProductionQueueData((prev) => ({
        ...prev,
        [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex)
      }));
    } else {
      setProductionQueueData((prev) => {
        const sourceItems = [...prev[activeContainer]];
        const destItems = [...prev[overContainer]];
        const draggedItem = sourceItems.find((item) => item.id === active.id);

        const sourceIndex = sourceItems.findIndex((item) => item.id === active.id);
        sourceItems.splice(sourceIndex, 1);
        destItems.push(draggedItem);

        return {
          ...prev,
          [activeContainer]: sourceItems,
          [overContainer]: destItems
        };
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<Typography color="text.primary">/</Typography>}>
        <Typography color="text.primary">
          <Link to="/dashboard" className={styles.link}>
            ...
          </Link>
        </Typography>
        <Typography color="text.primary">Production</Typography>
      </Breadcrumbs>

      <div className={styles.header}>
        <Typography variant="h5">Production Manager</Typography>
      </div>

      <Tooltip PopperProps={{ disablePortal: true }} title="Search" placement="right">
        <TextField
          variant="standard"
          onChange={(e) => setQuery(e.target.value)}
          label="Search"
          InputProps={{
            className: styles.search_input,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Tooltip>

      <div className={styles.production_container}>
        <NCProgramsList
          programs={productionQueueData.ncQueue}
          title="NC Programs"
          droppableId="ncQueue"
        />

        <div className={styles.production_queue_container}>
          <h2 className={styles.production_header}>Production queue</h2>
          <div className={styles.machines_container}>
            <MachineCard
              image={bacaImage}
              name="BACA 1"
              time="2h:35min"
              programs={productionQueueData.baca1}
              onGenerateQueue={() => handleGenerateQueue('baca1')}
              onSyncQueue={() => handleSyncQueue('baca1')}
              droppableId="baca1"
            />
            <MachineCard
              image={bacaImage}
              name="BACA 2"
              time="2h:35min"
              programs={productionQueueData.baca2}
              onGenerateQueue={() => handleGenerateQueue('baca2')}
              onSyncQueue={() => handleSyncQueue('baca2')}
              droppableId="baca2"
            />
            <MachineCard
              image={venusImage}
              name="VENUS 350"
              time="2h:10min"
              programs={productionQueueData.vensu350}
              onGenerateQueue={() => handleGenerateQueue('vensu350')}
              onSyncQueue={() => handleSyncQueue('vensu350')}
              droppableId="vensu350"
            />
          </div>
        </div>

        <CompletedProgramsList
          programs={productionQueueData.completed}
          title="Completed Programs"
          droppableId="completed"
        />
      </div>

      <Tooltip PopperProps={{ disablePortal: true }} title="Add new NC Program" placement="left">
        <SpeedDial
          icon={<SpeedDialIcon openIcon={<EditIcon />} />}
          ariaLabel="Add new NC program"
          sx={speedDialStyles}
          onClick={() => setIsOpen(true)}
        />
      </Tooltip>
    </DndContext>
  );
};
