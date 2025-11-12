// Course form component (shared for create and edit)
import React, { useState, useEffect } from 'react';
import { getDepartments } from '../../services/api/courseService';
import type { CreateCourse, UpdateCourse, Department } from '../../types/course';

interface CourseFormProps {
  initialData?: UpdateCourse & { courseNumber?: number };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    courseNumber: initialData?.courseNumber || 0,
    title: initialData?.title || '',
    credits: initialData?.credits || 3,
    departmentId: initialData?.departmentId || 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
      if (!isEdit && data.length > 0 && !formData.departmentId) {
        const deptId = data[0].departmentID || data[0].departmentId;
        if (deptId) {
          setFormData((prev) => ({ ...prev, departmentId: deptId }));
        }
      }
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isEdit && (!formData.courseNumber || formData.courseNumber < 1)) {
      newErrors.courseNumber = 'Course number is required and must be positive';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3 || formData.title.length > 50) {
      newErrors.title = 'Title must be between 3 and 50 characters';
    }

    if (formData.credits < 0 || formData.credits > 5) {
      newErrors.credits = 'Credits must be between 0 and 5';
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = isEdit
      ? ({
          title: formData.title.trim(),
          credits: formData.credits,
          departmentId: formData.departmentId,
          ...(initialData?.rowVersion ? { rowVersion: initialData.rowVersion } : {}),
        } as UpdateCourse)
      : ({
          courseNumber: formData.courseNumber,
          title: formData.title.trim(),
          credits: formData.credits,
          departmentId: formData.departmentId,
        } as CreateCourse);

    await onSubmit(submitData);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading departments...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course Number (Create only) */}
      {!isEdit && (
        <div>
          <label htmlFor="courseNumber" className="block text-sm font-medium text-gray-700">
            Course Number <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="courseNumber"
            value={formData.courseNumber || ''}
            onChange={(e) => handleChange('courseNumber', parseInt(e.target.value) || 0)}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.courseNumber ? 'border-red-300' : 'border-gray-300'
            }`}
            min="1"
            max="9999"
            disabled={isSubmitting}
          />
          {errors.courseNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.courseNumber}</p>
          )}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
          maxLength={50}
          disabled={isSubmitting}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Credits */}
      <div>
        <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
          Credits <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="credits"
          value={formData.credits}
          onChange={(e) => handleChange('credits', parseInt(e.target.value) || 0)}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.credits ? 'border-red-300' : 'border-gray-300'
          }`}
          min="0"
          max="5"
          disabled={isSubmitting}
        />
        {errors.credits && <p className="mt-1 text-sm text-red-600">{errors.credits}</p>}
      </div>

      {/* Department */}
      <div>
        <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
          Department <span className="text-red-500">*</span>
        </label>
        <select
          id="departmentId"
          value={formData.departmentId}
          onChange={(e) => handleChange('departmentId', parseInt(e.target.value))}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.departmentId ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        >
          <option value="0">Select a department</option>
          {departments.map((dept) => (
            <option key={dept.departmentID || dept.departmentId} value={dept.departmentID || dept.departmentId}>
              {dept.name}
            </option>
          ))}
        </select>
        {errors.departmentId && (
          <p className="mt-1 text-sm text-red-600">{errors.departmentId}</p>
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
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
