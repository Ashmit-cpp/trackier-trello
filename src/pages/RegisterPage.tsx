import { AuthForm } from '@/components/forms/AuthForm';
import React from 'react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div>
      <AuthForm mode="register" />
      <p className="text-center mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600">Login</Link>
      </p>
    </div>
  );
}