import { number, string, object } from 'yup';

export const productionValidationSchema = object().shape({
  partName: string().min(2).required('Part name is required'),
  quantity: number().min(0).required('Quantity is required'),
  status: string().required('Production status is required'),
  camTime: number().min(0).required('Cam time is required'),
  materialValue: number().min(0).required('Material value is required'),
  partType: string().required('Production type is required'),
  startUpTime: number().min(0).required('Startup time is required'),
  factor: number().min(1).required('Factor is required'),
  fixtureTime: number().min(0).required('Fixture time is required')
});
