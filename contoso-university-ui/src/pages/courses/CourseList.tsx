// Course list page with pagination, search, and department filtering
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, deleteCourse, getDepartments } from '../../services/api/courseService';
import { useNotification } from '../../context/NotificationContext';
import { usePagination } from '../../hooks/usePagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import type { Course, Department } from '../../types/course';

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchString, setSearchString] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<number | undefined>();
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
  } = usePagination({ initialPageSize: 10 });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, pageSize, searchString, selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Failed to load departments:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCourses(
        currentPage,
        pageSize,
        selectedDepartment,
        searchString || undefined
      );
      setCourses(response.data);
      setPaginationData({
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        hasPrevious: response.hasPrevious,
        hasNext: response.hasNext,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load courses';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchString(searchInput);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchString('');
    setSelectedDepartment(undefined);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDepartment(value ? parseInt(value) : undefined);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete ${title}?`)) {
      return;
    }

    try {
      await deleteCourse(id);
      success(`Successfully deleted ${title}`);
      fetchCourses();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete course';
      showError(message);
    }
  };

  if (loading && courses.length === 0) {
    return <LoadingSpinner message="Loading courses..." />;
  }

  const hasFilters = searchString || selectedDepartment;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage course catalog and enrollments
          </p>
        </div>
        <Button asChild>
          <Link to="/courses/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New Course
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title..."
            className="flex-1"
          />
          <select
            value={selectedDepartment || ''}
            onChange={handleDepartmentChange}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.departmentID || dept.departmentId} value={dept.departmentID || dept.departmentId}>
                {dept.name}
              </option>
            ))}
          </select>
          <Button type="submit">
            Search
          </Button>
          {hasFilters && (
            <Button
              type="button"
              onClick={handleClearFilters}
              variant="outline"
            >
              Clear
            </Button>
          )}
        </form>
      </Card>

      {error && <ErrorMessage message={error} onRetry={fetchCourses} className="mb-6" />}

      {/* Results summary */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {courses.length} of {totalCount} courses
        {searchString && ` (filtered by "${searchString}")`}
        {selectedDepartment &&
          ` (department: ${departments.find((d) => (d.departmentID || d.departmentId) === selectedDepartment)?.name})`}
      </div>

      {/* Courses table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course #</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Enrollments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  {hasFilters ? 'No courses found matching your filters.' : 'No courses found.'}
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.courseId}>
                  <TableCell className="font-medium">
                    {course.courseNumber}
                  </TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell className="text-muted-foreground">{course.departmentName}</TableCell>
                  <TableCell>{course.enrollmentCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/courses/${course.courseId}`}>
                          Details
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/courses/edit/${course.courseId}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button
                        onClick={() => handleDelete(course.courseId, course.title)}
                        variant="ghost"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
          />
        </div>
      )}
    </div>
  );
};

export default CourseList;
