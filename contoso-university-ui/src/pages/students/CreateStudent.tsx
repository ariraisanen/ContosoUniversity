// Create student page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStudent } from '../../services/api/studentService';
import { useNotification } from '../../context/NotificationContext';
import StudentForm from '../../components/features/StudentForm';
import type { CreateStudent } from '../../types/student';

const CreateStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateStudent) => {
    try {
      setIsSubmitting(true);
      const student = await createStudent(data);
      success(`Successfully created student: ${student.fullName}`);
      navigate('/students');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create student';
      error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/students');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Student</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <StudentForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateStudentPage;
