// T118: Department list page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePagination } from '../../hooks/usePagination';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import { getDepartments, deleteDepartment } from '../../services/api/departmentService';
import type { Department } from '../../types/course';

const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchString, setSearchString] = useState('');
  const { success, error: showError } = useNotification();

  const {
    currentPage,
    pageSize,
    totalPages,
    totalCount,
    hasPrevious,
    hasNext,
    setCurrentPage,
    setPaginationData,
    goToFirstPage,
  } = usePagination();

  useEffect(() => {
    fetchDepartments();
  }, [currentPage, pageSize, searchString]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getDepartments(currentPage, pageSize, searchString || undefined);

      setDepartments(data.data);
      setPaginationData({
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        hasPrevious: data.hasPrevious,
        hasNext: data.hasNext,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchString(searchInput);
    goToFirstPage();
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchString('');
    goToFirstPage();
  };

  const handleDelete = async (id: number, name: string, courseCount: number) => {
    if (courseCount > 0) {
      showError(`Cannot delete department "${name}". It has ${courseCount} course(s) assigned.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the "${name}" department?`)) {
      return;
    }

    try {
      await deleteDepartment(id);
      success('Department deleted successfully');
      fetchDepartments();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete department';
      showError(message);
    }
  };

  if (loading && departments.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDepartments} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage university departments and their administrators
          </p>
        </div>
        <Link
          to="/departments/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create New Department
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
          {searchString && (
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {departments.length} of {totalCount} department(s)
        {searchString && <span className="ml-2">matching "{searchString}"</span>}
      </div>

      {/* Departments table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Administrator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Courses
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No departments found
                </td>
              </tr>
            ) : (
              departments.map((department) => (
                <tr key={department.departmentID || department.departmentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/departments/${department.departmentID || department.departmentId}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {department.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${department.budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(department.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {department.administratorName || (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {department.courseCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <Link
                      to={`/departments/${department.departmentID || department.departmentId}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Details
                    </Link>
                    <Link
                      to={`/departments/edit/${department.departmentID || department.departmentId}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(
                          department.departmentID || department.departmentId!,
                          department.name,
                          department.courseCount
                        )
                      }
                      className="text-red-600 hover:text-red-900"
                      disabled={department.courseCount > 0}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
