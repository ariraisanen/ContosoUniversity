// Student details page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getStudentById, deleteStudent } from '../../services/api/studentService';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import type { Student } from '../../types/student';

const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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

  const handleDelete = async () => {
    if (!student || !id) return;

    if (!window.confirm(`Are you sure you want to delete ${student.fullName}?`)) {
      return;
    }

    try {
      await deleteStudent(parseInt(id, 10));
      success(`Successfully deleted ${student.fullName}`);
      navigate('/students');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete student';
      error(message);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading student details..." />;
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            to="/students"
            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Students
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{student.fullName}</h1>
          </div>

          <div className="px-6 py-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.lastName}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">First Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.firstMidName}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Enrollment Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(student.enrollmentDate).toLocaleDateString()}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Number of Enrollments</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.enrollmentCount}</dd>
              </div>
            </dl>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Link
              to={`/students/edit/${student.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
