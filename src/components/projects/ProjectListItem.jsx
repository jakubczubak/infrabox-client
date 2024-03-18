import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Chart } from 'react-google-charts';
import { Breadcrumbs, TextField, Tooltip, Typography } from '@mui/material';
import styles from '../projects/css/ProjectListItem.module.css';
import InputAdornment from '@mui/material/InputAdornment';
import { ProjectListItemTable } from './ProjectListItemTable';
import { FormGroup, FormControlLabel } from '@mui/material';
import { IOSSwitch } from '../common/IOSSwitch';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectListManager } from './service/projectListManager';
import { useEffect } from 'react';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';

export const ProjectListItem = () => {
  const { id } = useParams();
  const [isFinished, setIsFinished] = useState(false);
  const [projectName, setProjectName] = useState('Project name');
  const [productionTime, setProductionTime] = useState(0);
  const [materialValue, setMaterialValue] = useState(0);
  const [toolValue, setToolValue] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [productionValue, setProductionValue] = useState(0);
  const [productionValueBasedOnDepartmentCost, setProductionValueBasedOnDepartmentCost] =
    useState(0);
  const [totalProductionValue, setTotalProductionValue] = useState(0);

  const { data, isLoading, isError } = useQuery(
    ['projectItem', id], // queryKey
    () => projectListManager.getProjectItemByID(id) // queryFn
  );

  const department_maintenance_cost = [
    ['Cost name', 'PLN'],
    ['Production value', 32000],
    ['Material value', 3500],
    ['Tool value', 1000]
  ];

  const handleProjectStatus = () => {
    setIsFinished(!data.status);
  };

  useEffect(() => {
    if (data) {
      setIsFinished(data.isFinished);
      department_maintenance_cost[1][1] = data.productionValue;
      department_maintenance_cost[2][1] = data.materialValue;
      department_maintenance_cost[3][1] = data.toolValue;
      setProjectName(data.projectName);
      setProductionTime(data.productionTime);
      setMaterialValue(data.materialValue);
      setToolValue(data.toolValue);
      setHourlyRate(data.hourlyRate);
      setProductionValue(data.productionValue);
      setProductionValueBasedOnDepartmentCost(data.productionValueBasedOnDepartmentCost);
      setTotalProductionValue(data.totalProductionValue);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error message="Error fetch project item. Please try again later!" />;
  }

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<Typography color="text.primary">/</Typography>}>
        <Typography color="text.primary">...</Typography>
        <Link color="inherit" to="/projects" className={styles.link}>
          <Typography color="text.primary">Project list</Typography>
        </Link>
        <Typography color="text.primary">{projectName}</Typography>
      </Breadcrumbs>
      <div className={styles.header}>
        <Typography variant="h5" component="div">
          Project details
        </Typography>
      </div>
      <div className={styles.project_status_wrapper}>
        <FormGroup>
          <Tooltip title="Click when project is FINISHED" placement="top">
            <FormControlLabel
              control={<IOSSwitch sx={{ m: 1 }} size="small" />}
              label="Finished"
              color="warning"
              value={isFinished}
              onChange={handleProjectStatus}
            />
          </Tooltip>
        </FormGroup>
      </div>
      <div className={styles.project_info_wrapper}>
        <div className={styles.project_main_info}>
          <div className={styles.container}>
            <img
              className={styles.project_img}
              src={require('./../../assets/icons/graph.png')}
              alt="graph"
            />
            <p className={styles.project_title}>{projectName}</p>
            <p className={styles.project_text}>Project name</p>
          </div>
          <div className={styles.container}>
            <img
              className={styles.project_img}
              src={require('./../../assets/icons/clock.png')}
              alt="clock"
            />
            <p className={styles.project_title}>
              {productionTime} <span>h</span>
            </p>
            <p className={styles.project_text}>Production time</p>
          </div>
          <div className={styles.container}>
            <img
              className={styles.project_img}
              src={require('./../../assets/icons/coins.png')}
              alt="coins"
            />
            <p className={styles.project_title}>
              {materialValue} <span>PLN</span>
            </p>
            <p className={styles.project_text}>Material value</p>
          </div>
          <div className={styles.container}>
            <img
              className={styles.project_img}
              src={require('./../../assets/icons/coins.png')}
              alt="coins"
            />
            <p className={styles.project_title}>
              {toolValue} <span>PLN</span>
            </p>
            <p className={styles.project_text}>Tool value</p>
          </div>
        </div>
        <div className={styles.project_value_wrapper}>
          <div className={styles.chart_container}>
            <div className={styles.project_value}>
              <div className={styles.project_value_rate}>
                <TextField
                  variant="standard"
                  value={hourlyRate}
                  InputProps={{
                    sx: { width: '150px', fontSize: '22px', color: '#4a4a4a', fontWeight: '800' },
                    endAdornment: <InputAdornment position="end">PLN/h</InputAdornment>
                  }}
                />
                <p className={styles.project_value_title}>Hourly rate</p>
              </div>
              <div className={styles.project_value_rate}>
                <p className={styles.project_value_number}>
                  {productionValue} <span>PLN</span>
                </p>
                <p className={styles.project_value_title}>Production value</p>
              </div>
              <div className={styles.project_value_rate}>
                <p className={styles.project_value_number}>
                  {productionValueBasedOnDepartmentCost} <span>PLN</span>
                </p>
                <p className={styles.project_value_title}>
                  Production value based on department cost
                </p>
              </div>
              <div className={styles.project_value_rate}>
                <p className={styles.project_value_number}>
                  {totalProductionValue} <span>PLN</span>
                </p>
                <p className={styles.project_value_title}>Total production value</p>
              </div>
            </div>
            <div className={styles.chart_wrapper}>
              <Chart
                chartType="PieChart"
                data={department_maintenance_cost}
                height={'600px'}
                width={'600px'}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.project_table_wrapper}>
        <ProjectListItemTable />
      </div>
    </>
  );
};
