// Student form component (shared for create and edit)
import React from 'react';
import type { CreateStudent, UpdateStudent } from '../../types/student';

interface StudentFormProps {
  initialData?: UpdateStudent;
  onSubmit: (data: CreateStudent | UpdateStudent) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = React.useState({
    lastName: initialData?.lastName || '',
    firstMidName: initialData?.firstMidName || '',
    enrollmentDate: initialData?.enrollmentDate
      ? new Date(initialData.enrollmentDate).toISOString().split('T')[0]
      : '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = 'Last name cannot exceed 50 characters';
    }

    if (!formData.firstMidName.trim()) {
      newErrors.firstMidName = 'First name is required';
    } else if (formData.firstMidName.length > 50) {
      newErrors.firstMidName = 'First name cannot exceed 50 characters';
    }

    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = 'Enrollment date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData: CreateStudent | UpdateStudent = {
      lastName: formData.lastName.trim(),
      firstMidName: formData.firstMidName.trim(),
      enrollmentDate: formData.enrollmentDate,
      ...(isEdit && initialData?.rowVersion ? { rowVersion: initialData.rowVersion } : {}),
    };

    await onSubmit(submitData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Last Name */}
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="lastName"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.lastName ? 'border-red-300' : 'border-gray-300'
          }`}
          maxLength={50}
          disabled={isSubmitting}
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
        )}
      </div>

      {/* First Name */}
      <div>
        <label htmlFor="firstMidName" className="block text-sm font-medium text-gray-700">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="firstMidName"
          value={formData.firstMidName}
          onChange={(e) => handleChange('firstMidName', e.target.value)}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.firstMidName ? 'border-red-300' : 'border-gray-300'
          }`}
          maxLength={50}
          disabled={isSubmitting}
        />
        {errors.firstMidName && (
          <p className="mt-1 text-sm text-red-600">{errors.firstMidName}</p>
        )}
      </div>

      {/* Enrollment Date */}
      <div>
        <label htmlFor="enrollmentDate" className="block text-sm font-medium text-gray-700">
          Enrollment Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="enrollmentDate"
          value={formData.enrollmentDate}
          onChange={(e) => handleChange('enrollmentDate', e.target.value)}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.enrollmentDate ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.enrollmentDate && (
          <p className="mt-1 text-sm text-red-600">{errors.enrollmentDate}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Student' : 'Create Student'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
