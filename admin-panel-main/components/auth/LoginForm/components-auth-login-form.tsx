"use client";
import { Button, PasswordInput, TextInput } from '@mantine/core';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Define the validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const ComponentsAuthLoginForm = () => {
  const router = useRouter();

  // Initialize form values
  const initialValues = {
    email: '',
    password: '',
  };

  // Handle form submission
  const handleLoginSubmit = async (values: { email: string; password: string }, { setSubmitting }: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/adminLogin`,
        values
      );

      if (response.status === 200 && response.data.success) {
        const token = response.data.data.token;
        localStorage.setItem('authToken', token);
        toast.success(response.data.message || 'Login successful!');
        router.push('/dashboard');
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
        console.error('Login error:', error); // Add logging to debug
        
        // Safely handle error responses
        const errors = error.response?.data?.errors || {};
        const message = error.response?.data?.message;
        const emailError = errors.email;
        const passwordError = errors.password;

        if (emailError && passwordError) {
          toast.error(`Error: Both email and password are incorrect.`);
        } else if (emailError) {
          toast.error(`Error: ${emailError}`);
        } else if (passwordError) {
          toast.error(`Error: ${passwordError}`);
        } else if (message) {
          toast.error(message); // Show server message if available
        } else {
          toast.error('Login failed. Please check your credentials.');
        }
      } finally {
        setSubmitting(false);
      }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleLoginSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form className="space-y-5 dark:text-white">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block font-semibold mb-2">Email</label>
            <Field
              name="email"
              as={TextInput}
              placeholder="Enter Email"
              className="w-full"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block font-semibold mb-2">Password</label>
            <Field
              name="password"
              as={PasswordInput}
              placeholder="Enter Password"
              className="w-full"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting || !isValid} 
            className="w-full btn btn-gradient !mt-6 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ComponentsAuthLoginForm;
