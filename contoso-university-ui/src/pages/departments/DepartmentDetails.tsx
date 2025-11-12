// T124: Department details page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useNotification } from '../../context/NotificationContext';
import { getDepartmentById, deleteDepartment } from '../../services/api/departmentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Department } from '../../types/course';

const DepartmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartment();
  }, [id]);

  const fetchDepartment = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getDepartmentById(parseInt(id));
      setDepartment(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load department');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !department) return;

    if (department.courseCount > 0) {
      showError(
        `Cannot delete department "${department.name}". It has ${department.courseCount} course(s) assigned.`
      );
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the "${department.name}" department?`)) {
      return;
    }

    try {
      await deleteDepartment(parseInt(id));
      success('Department deleted successfully');
      navigate('/departments');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete department';
      showError(message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !department) {
    return (
      <ErrorMessage
        message={error || 'Department not found'}
        onRetry={fetchDepartment}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Department Details</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View department information and assigned courses
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link to={`/departments/edit/${department.departmentID || department.departmentId}`}>
              Edit
            </Link>
          </Button>
          <Button
            onClick={handleDelete}
            disabled={department.courseCount > 0}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{department.name}</CardTitle>
        </CardHeader>
        <CardContent>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Budget</dt>
                <dd className="mt-1 text-sm text-foreground">
                  ${department.budget.toLocaleString()}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Start Date</dt>
                <dd className="mt-1 text-sm text-foreground">
                  {new Date(department.startDate).toLocaleDateString()}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Administrator</dt>
                <dd className="mt-1 text-sm text-foreground">
                  {department.administratorName || (
                    <span className="text-muted-foreground">Not assigned</span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Courses</dt>
                <dd className="mt-1 text-sm text-foreground">
                  {department.courseCount} course{department.courseCount !== 1 ? 's' : ''}
                </dd>
              </div>
            </div>

            {department.courseCount > 0 && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <Link
                    to={`/courses?departmentId=${department.departmentID || department.departmentId}`}
                    className="text-primary hover:underline"
                  >
                    View courses in this department →
                  </Link>
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <Link
              to="/departments"
              className="text-sm font-medium text-primary hover:underline"
            >
              ← Back to Departments
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentDetailsPage;
