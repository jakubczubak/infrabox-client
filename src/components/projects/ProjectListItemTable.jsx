// Zewnętrzne importy
import React, { useState } from 'react';
import { TextField, InputAdornment, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Lokalne importy

import { ProductionTable } from './../production/ProductionTable';

import styles from './../production/css/Production.module.css';
import { IconButton } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { productionCartManager } from '../productionCart/service/productionCartManager';
import { useDispatch } from 'react-redux';

export const ProjectListItemTable = ({ productionItems }) => {
  const [query, setQuery] = useState('');

  const dispatch = useDispatch();

  // Funkcja sortująca dane na podstawie właściwości 'createdOn'
  const sortByCreatedOn = (items) => {
    return items.slice().sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
  };

  const handleExport = () => {
    productionItems.forEach((item) => {
      productionCartManager.addItem(item, dispatch);
    });
  };

  const handleImport = () => {
    console.log('Import production list');
  };

  return (
    <>
      <div className={styles.icon_container}>
        <Tooltip title="Search" placement="right">
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
        <div>
          <Tooltip title="Import production list">
            <IconButton
              onClick={() => {
                handleImport();
              }}
            >
              <FileDownloadOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export production list">
            <IconButton
              onClick={() => {
                handleExport();
              }}
            >
              <FileUploadOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {productionItems && (
        <ProductionTable
          items={sortByCreatedOn(productionItems).filter((item) => {
            if (query === '') return item;
            else if (item.partName.toLowerCase().includes(query.toLowerCase())) return item;
          })}
        />
      )}
    </>
  );
};