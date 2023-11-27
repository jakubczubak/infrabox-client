import { object, string, ref } from 'yup';

export const userUpdateModalValidationSchema = object().shape({
  firstName: string().required('First name is required'),
  lastName: string().required('Surname is required'),
  email: string().email('Email is not valid').required('Email is required'),
  password: string().required('Password is required'),
  confirmPassword: string()
    .required('Password did not match')
    .oneOf([ref('password')], 'Password must match')
});
