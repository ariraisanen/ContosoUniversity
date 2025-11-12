// Edit student page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudentById, updateStudent } from '../../services/api/studentService';
import { useNotification } from '../../context/NotificationContext';
import StudentForm from '../../components/features/StudentForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import type { Student, UpdateStudent } from '../../types/student';

const EditStudentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) {
        setLoadError('Invalid student ID');
        setLoading(false);
        return;
      }

      try {
        const data = await getStudentById(parseInt(id, 10));
        setStudent(data);
      } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to load student';
        setLoadError(message);
        error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleSubmit = async (data: UpdateStudent) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      const updatedStudent = await updateStudent(parseInt(id, 10), data);
      success(`Successfully updated student: ${updatedStudent.fullName}`);
      navigate('/students');
    } catch (err: any) {
      if (err.response?.status === 409) {
        error('The student was modified by another user. Please refresh and try again.');
      } else {
        const message = err.response?.data?.message || 'Failed to update student';
        error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/students');
  };

  if (loading) {
    return <LoadingSpinner message="Loading student..." />;
  }

  if (loadError || !student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          message={loadError || 'Student not found'}
          onRetry={() => navigate('/students')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Student</h1>
        <p className="text-gray-600 mb-6">{student.fullName}</p>
        <div className="bg-white shadow-md rounded-lg p-6">
          <StudentForm
            initialData={{
              lastName: student.lastName,
              firstMidName: student.firstMidName,
              enrollmentDate: student.enrollmentDate,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEdit
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default EditStudentPage;
