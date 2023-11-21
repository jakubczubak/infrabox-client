import React from 'react';
import styles from './css/CalculationItem.module.css';
import {
  Typography,
  Breadcrumbs,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  InputAdornment,
  Tooltip,
  Button
} from '@mui/material';
import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { Chart } from 'react-google-charts';
import RepeatIcon from '@mui/icons-material/Repeat';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { calcualtionItemValidationSchema } from './validationSchema/calculationItemValidationSchema';
import dayjs from 'dayjs';
import { calculationManager } from './service/calculationManager';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { InfoModal } from '../common/InfoModal';
import Lottie from 'lottie-react';
import animation from '../../assets/Lottie/calculation.json';

export const CalculationItem = ({ defaultValues }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [formData, setFormData] = useState({});

  const [departmentMaintenanceCost, setDepartmentMaintenanceCost] = useState(0);
  const [hourlyDepartmentMaintenanceCost, setHourlyDepartmentMaintenanceCost] = useState(0);
  const [machineWorkingTime, setMachineWorkingTime] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [hourlyRatePerMachine, setHourlyRatePerMachine] = useState(0);
  const [cncOrderValuation, setCncOrderValuation] = useState(0);
  const [employeeCosts, setEmployeeCosts] = useState(state ? state.employeeCosts : 0);
  const [electricityCost, setElectrcityCost] = useState(0);
  const [mediaPrice, setMediaPrice] = useState(state ? state.mediaPrice : 0);
  const [depreciationPrice, setDepreciationPrice] = useState(state ? state.depreciationPrice : 0);
  const [toolsPrice, setToolsPrice] = useState(state ? state.toolsPrice : 0);
  const [leasingPrice, setLeasingPrice] = useState(state ? state.leasingPrice : 0);
  const [variableCostsI, setVariableCostsI] = useState(state ? state.variableCostsI : 0);
  const [variableCostsII, setVariableCostsII] = useState(state ? state.variableCostsII : 0);

  const [estimatedTime, setEstimatedTime] = useState(0);
  const [hourlyDepartmentMaintenanceCostPerMachine, setHourlyDepartmentMaintenanceCostPerMachine] =
    useState(0);

  const department_maintenance_cost = [
    ['Cost name', 'PLN'],
    ['Employee costs 🧑‍🤝‍🧑', employeeCosts],
    ['Electricity cost ⚡', electricityCost],
    ['Media', mediaPrice],
    ['Depreciation', depreciationPrice],
    ['Tools', toolsPrice],
    ['Leasing/Installment', leasingPrice],
    ['Variable costs I ', variableCostsI],
    ['Variable costs II', variableCostsII]
  ];

  const [materialCost, setMaterialCost] = useState(state ? state.materialCost : 0);
  const [toolCost, setToolCost] = useState(state ? state.toolCost : 0);
  const [startupFee, setStartupFee] = useState(state ? state.startupFee : 0);
  const [income, setIncome] = useState(state ? state.income : 0);
  const [departmentCost, setDepartmentCost] = useState(0);

  const cnc_order_cost = [
    ['Cost name', 'PLN'],
    ['Material cost', materialCost],
    ['Tool cost', toolCost],
    ['Startup fee', startupFee],
    ['Department cost', departmentCost],
    ['Income 👌', income]
  ];

  const { handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      calculationName: state ? state.calculationName : '',
      selectedDate: state ? dayjs(state.selectedDate, 'DD/MM/YYYY') : dayjs(new Date()),
      status: state ? state.status : 'Pending',
      billingPeriod: state
        ? state.billingPeriod
        : defaultValues
        ? defaultValues.billingPeriod
        : 160,
      employeeCosts: state
        ? state.employeeCosts
        : defaultValues
        ? defaultValues.employeeCosts
        : 45000,
      powerConsumption: state
        ? state.powerConsumption
        : defaultValues
        ? defaultValues.powerConsumption
        : 45,
      operatingHours: state
        ? state.operatingHours
        : defaultValues
        ? defaultValues.operatingHours
        : 160,
      pricePerKwh: state ? state.pricePerKwh : defaultValues ? defaultValues.pricePerKwh : 0.79,
      mediaPrice: state ? state.mediaPrice : defaultValues ? defaultValues.mediaPrice : 1000,
      depreciationPrice: state
        ? state.depreciationPrice
        : defaultValues
        ? defaultValues.depreciationPrice
        : 1000,
      toolsPrice: state ? state.toolsPrice : defaultValues ? defaultValues.toolsPrice : 500,
      leasingPrice: state ? state.leasingPrice : defaultValues ? defaultValues.leasingPrice : 0,
      variableCostsI: state
        ? state.variableCostsI
        : defaultValues
        ? defaultValues.variableCostsI
        : 0,
      variableCostsII: state
        ? state.variableCostsII
        : defaultValues
        ? defaultValues.variableCostsII
        : 0,
      camTime: state ? state.camTime : 10,
      factor: state ? state.factor : 1.2,
      startupFee: state ? state.startupFee : 0,
      materialCost: state ? state.materialCost : 0,
      toolCost: state ? state.toolCost : 0,
      income: state ? state.income : 0,
      hourlyRate: state ? state.hourlyRate : 0,
      numberOfMachines: state ? state.numberOfMachines : 1,
      shiftLength: state ? state.shiftLength : 8
    },
    resolver: yupResolver(calcualtionItemValidationSchema),
    mode: 'onChange'
  });

  const handleFinishCalculation = () => {
    calculationManager.updateCalculation(formData, queryClient, dispatch);

    setOpenInfoModal(false);
    reset();
    navigate('/calculations');
  };

  const handleSubmitForm = (data) => {
    const localDate = dayjs(data.selectedDate).locale('pl').format('DD/MM/YYYY');
    data.selectedDate = localDate;
    data.cncOrderValuation = cncOrderValuation;

    if (state) {
      data.id = state.id;

      if (data.status == 'Finish') {
        setFormData(data);
        setOpenInfoModal(true);

        return;
      } else {
        calculationManager.updateCalculation(data, queryClient, dispatch);
      }
    } else {
      calculationManager.createCalculation(data, queryClient, dispatch);
    }

    reset();

    navigate('/calculations');
  };

  useEffect(() => {
    const billingPeriod = parseFloat(watch('billingPeriod'));
    const employeeCost = parseFloat(watch('employeeCosts'));
    const powerConsumption = parseFloat(watch('powerConsumption'));
    const operatingHours = parseFloat(watch('operatingHours'));
    const pricePerKwh = parseFloat(watch('pricePerKwh'));
    const mediaPrice = parseFloat(watch('mediaPrice'));
    const depreciationPrice = parseFloat(watch('depreciationPrice'));
    const toolsPrice = parseFloat(watch('toolsPrice'));
    const leasingPrice = parseFloat(watch('leasingPrice'));
    const variableCostsI = parseFloat(watch('variableCostsI'));
    const variableCostsII = parseFloat(watch('variableCostsII'));

    const camTime = parseFloat(watch('camTime'));
    const factor = parseFloat(watch('factor'));
    const materialCost = parseFloat(watch('materialCost'));
    const toolCost = parseFloat(watch('toolCost'));
    const startupFee = parseFloat(watch('startupFee'));
    const income = parseFloat(watch('income'));
    const numberOfMachines = parseInt(watch('numberOfMachines'));
    const shiftLength = parseFloat(watch('shiftLength'));

    const electricityCost = powerConsumption * operatingHours * pricePerKwh;
    const departmentMaintenanceCost = (
      employeeCost +
      mediaPrice +
      depreciationPrice +
      toolsPrice +
      leasingPrice +
      variableCostsI +
      variableCostsII +
      electricityCost
    ).toFixed(2);
    const hourlyDepartmentMaintenanceCost = (departmentMaintenanceCost / billingPeriod).toFixed(2);
    const machineWorkingTime = (camTime * factor).toFixed(2);
    const departmentCost = hourlyDepartmentMaintenanceCost * machineWorkingTime;
    const cncOrderValuation = (
      materialCost +
      toolCost +
      startupFee +
      departmentCost +
      income
    ).toFixed(2);
    const hourlyRateValue = ((departmentCost + income) / machineWorkingTime).toFixed(2);

    const estimatedTime = (machineWorkingTime / (shiftLength * numberOfMachines)).toFixed(2);

    setDepartmentMaintenanceCost(departmentMaintenanceCost);
    setHourlyDepartmentMaintenanceCost(hourlyDepartmentMaintenanceCost);
    setMachineWorkingTime(machineWorkingTime);
    setCncOrderValuation(cncOrderValuation);
    setHourlyRate(hourlyRateValue);
    setHourlyRatePerMachine((hourlyRateValue / numberOfMachines).toFixed(2));

    setEmployeeCosts(employeeCost);
    setElectrcityCost(electricityCost);
    setMediaPrice(mediaPrice);
    setDepreciationPrice(depreciationPrice);
    setToolsPrice(toolsPrice);
    setLeasingPrice(leasingPrice);
    setVariableCostsI(variableCostsI);
    setVariableCostsII(variableCostsII);

    setMaterialCost(materialCost);
    setToolCost(toolCost);
    setStartupFee(startupFee);
    setDepartmentCost(departmentCost);

    setEstimatedTime(estimatedTime);
    setHourlyDepartmentMaintenanceCostPerMachine(
      (hourlyDepartmentMaintenanceCost / numberOfMachines).toFixed(2)
    );

    if (income >= 0) {
      setIncome(income);
    } else {
      setIncome(0);
    }
  }, [watch()]);

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<Typography color="text.primary">/</Typography>}
      >
        <Typography color="text.primary">...</Typography>
        <Link color="inherit" to="/calculations" className={styles.link}>
          <Typography color="text.primary">Calculations</Typography>
        </Link>
        {state ? (
          <Typography color="text.primary">Edit calculation</Typography>
        ) : (
          <Typography color="text.primary">New calculation</Typography>
        )}
      </Breadcrumbs>
      <div className={styles.header}>
        {state ? (
          <Typography variant="h5" component="div">
            Edit calculation
          </Typography>
        ) : (
          <Typography variant="h5" component="div">
            Create calculation
          </Typography>
        )}
      </div>
      <form className={styles.calculation_form} onSubmit={handleSubmit(handleSubmitForm)}>
        <div className={styles.calculation_container}>
          <Lottie animationData={animation} loop={true} className={styles.animation} />
          <div className={styles.calculation_general_info}>
            <Controller
              name="calculationName"
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <TextField
                  id="outlined-basic"
                  disabled={state && state.status === 'Finish' ? true : false}
                  label="Calculation name"
                  variant="outlined"
                  error={!!error}
                  onBlur={onBlur}
                  value={value}
                  onChange={onChange}
                  helperText={error ? error.message : null}
                  mb={16}
                />
              )}
            />
            <Controller
              name="selectedDate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  value={value}
                  onChange={onChange}
                  disabled={state && state.status === 'Finish' ? true : false}
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <>
                  <InputLabel id="select-label">Status:</InputLabel>
                  <Select
                    labelId="select-label"
                    disabled={state && state.status === 'Finish' ? true : false}
                    onBlur={onBlur}
                    value={value}
                    onChange={onChange}
                    error={!!error}
                  >
                    <MenuItem value={'Finish'}>Finish</MenuItem>
                    <MenuItem value={'Pending'}>Pending</MenuItem>
                  </Select>
                </>
              )}
            />
          </div>
          <div className={styles.line} />
          <div className={styles.department_maintenance_cost}>
            <div className={styles.cost_header}>
              <Typography variant="h6" component="div">
                Department maintenance cost
              </Typography>
            </div>
            <div className={styles.input}>
              <Controller
                name="billingPeriod"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Employee costs">
                    <TextField
                      label="Billing period"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">h</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
            </div>
            <div className={styles.input}>
              <Controller
                name="employeeCosts"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Employee costs">
                    <TextField
                      label="Employee costs"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">PLN</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />

              <Controller
                name="powerConsumption"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Machine power consumption">
                    <TextField
                      label="Power consumption"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">kW</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
              <Controller
                name="operatingHours"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Machine operating hours">
                    <TextField
                      label="Operating hours"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">h</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
              <Controller
                name="pricePerKwh"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Price PLN/kWh">
                    <TextField
                      label="Price PLN/kWh"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">PLN/kWh</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
              <Controller
                name="mediaPrice"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Media price">
                    <TextField
                      label="Media"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">PLN</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
              <Controller
                name="depreciationPrice"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Depreciation price">
                    <TextField
                      label="Depreciation"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">PLN</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
              <Controller
                name="toolsPrice"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Tools price">
                    <TextField
                      label="Tools"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">PLN</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
              <Controller
                name="leasingPrice"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Leasing/Installment price">
                    <TextField
                      label="Leasing/Installment"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">PLN</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
              <Controller
                name="variableCostsI"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Variable costs I price">
                    <TextField
                      label="Variable costs I"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">PLN</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
              <Controller
                name="variableCostsII"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Variable costs II price">
                    <TextField
                      label="Variable costs II"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">PLN</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
            </div>
            <div className={styles.input}>
              <Tooltip title="Department maintenance cost">
                <TextField
                  label="Maintenance cost"
                  variant="filled"
                  disabled
                  sx={{ width: '280px' }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">PLN (net)</InputAdornment>
                  }}
                  value={departmentMaintenanceCost}
                />
              </Tooltip>

              <Tooltip title="Hourly department maintenance cost">
                <TextField
                  label="Hourly maintenance cost"
                  variant="filled"
                  disabled
                  sx={{ width: '280px' }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">PLN (net)/h</InputAdornment>
                  }}
                  value={hourlyDepartmentMaintenanceCost}
                />
              </Tooltip>
            </div>
            <div className={styles.pie_chart}>
              <Chart
                chartType="PieChart"
                data={department_maintenance_cost}
                height={'550px'}
                options={{ pieHole: 0.4 }}
              />
            </div>
            <div className={styles.line} />
          </div>
          <div className={styles.cnc_order_valuation}>
            <div className={styles.cost_header}>
              <Typography variant="h6" component="div">
                Order valuation
              </Typography>
            </div>
            <div className={styles.cnc_calculation_cost}>
              <Controller
                name="camTime"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Machine time in CAM simulation">
                    <TextField
                      label="CAM Time"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">h</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
              <div>x</div>
              <Controller
                name="factor"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Factor (Montowanie, uzbrajanie maszyny)">
                    <TextField
                      label="Factor"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">x</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
              <div>=</div>
              <Tooltip title="Machine working time">
                <TextField
                  label="CNC Time"
                  size="small"
                  variant="filled"
                  disabled
                  sx={{ width: '280px' }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">h</InputAdornment>
                  }}
                  value={machineWorkingTime}
                />
              </Tooltip>
            </div>
            <div className={styles.input}>
              <Controller
                name="materialCost"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Material cost">
                    <TextField
                      label="Material cost"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">PLN</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
            </div>
            <div className={styles.input}>
              <Controller
                name="toolCost"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Tool cost">
                    <TextField
                      label="Tool cost"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">PLN</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
            </div>
            <div className={styles.input}>
              <Controller
                name="startupFee"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Startup fee">
                    <TextField
                      label="Startup fee"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">PLN</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
            </div>
            <div className={styles.input}>
              <Tooltip title="Hourly Department maintanace cost">
                <TextField
                  label="Hourly maintanace cost"
                  variant="filled"
                  size="small"
                  disabled
                  sx={{ width: '280px' }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">PLN (net)/h</InputAdornment>
                  }}
                  value={hourlyDepartmentMaintenanceCost}
                />
              </Tooltip>
            </div>
            <div className={styles.input}>
              <Tooltip title="Hourly Department maintanace cost per machine">
                <TextField
                  label="Per machine"
                  variant="filled"
                  size="small"
                  disabled
                  sx={{ width: '280px' }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">PLN (net)/machine</InputAdornment>
                  }}
                  value={hourlyDepartmentMaintenanceCostPerMachine}
                />
              </Tooltip>
            </div>
            <div className={styles.input}>
              <Controller
                name="income"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Income">
                    <TextField
                      label="Income"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">PLN</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
              <div>
                <RepeatIcon />
              </div>
              <Tooltip title="Hourly rate">
                <TextField
                  label="Hourly rate"
                  variant="filled"
                  disabled
                  size="small"
                  sx={{ width: '280px' }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">PLN/h</InputAdornment>
                  }}
                  value={hourlyRate}
                />
              </Tooltip>
              <div>
                <RepeatIcon />
              </div>
              <Tooltip title="Hourly rate per machine">
                <TextField
                  label="Hourly rate per machine"
                  variant="filled"
                  disabled
                  size="small"
                  sx={{ width: '280px' }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">PLN/h</InputAdornment>
                  }}
                  value={hourlyRatePerMachine}
                />
              </Tooltip>
            </div>
            <div className={styles.input}>
              <Controller
                name="numberOfMachines"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Number of machines used">
                    <TextField
                      label="Number of machines"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">x</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
            </div>
            <div className={styles.input}>
              <Controller
                name="shiftLength"
                control={control}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                  <Tooltip title="Length of work during one day">
                    <TextField
                      label="Shift length"
                      disabled={state && state.status === 'Finish' ? true : false}
                      variant="outlined"
                      size="small"
                      sx={{ width: '280px' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">h</InputAdornment>
                      }}
                      onBlur={onBlur}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                    />
                  </Tooltip>
                )}
              />
            </div>
            <div className={styles.input}>
              <Tooltip title="Estimated time of order completion">
                <TextField
                  label="Estimated time"
                  variant="filled"
                  disabled
                  size="small"
                  sx={{ width: '280px' }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">day</InputAdornment>
                  }}
                  value={estimatedTime}
                />
              </Tooltip>
            </div>

            <div className={styles.cnc_calculation_cost}>
              <Tooltip title="CNC order valuation">
                <TextField
                  label="Valuation"
                  size="small"
                  variant="filled"
                  disabled
                  sx={{ width: '280px' }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">PLN (net)</InputAdornment>
                  }}
                  value={cncOrderValuation}
                />
              </Tooltip>
            </div>
            <div className={styles.pie_chart}>
              <Chart
                chartType="PieChart"
                data={cnc_order_cost}
                height={'550px'}
                options={{ pieHole: 0.4 }}
              />
            </div>
          </div>
          <div className={styles.form_btn}>
            {state ? (
              <Button
                variant="contained"
                color="warning"
                type="submit"
                disabled={state && state.status === 'Finish' ? true : false}
              >
                Update calculation
              </Button>
            ) : (
              <Button variant="contained" color="success" type="submit">
                Create calculation
              </Button>
            )}
          </div>
        </div>
      </form>
      <InfoModal
        open={openInfoModal}
        onCancel={() => setOpenInfoModal(false)}
        onConfirm={() => handleFinishCalculation()}
        text="Please check if the calculation is correct. If you want to edit the calculation, click 'Cancel' and then 'Edit calculation'.
        If you want to change the calculation status to 'FINISH', click 'Confirm'. This action cannot be undone. You will not be able to edit the calculation."
      />
    </>
  );
};
