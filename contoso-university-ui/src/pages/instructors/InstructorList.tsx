// T142: Instructor list page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePagination } from '../../hooks/usePagination';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import { getInstructors, deleteInstructor } from '../../services/api/instructorService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, X } from 'lucide-react';
import type { Instructor } from '../../types/instructor';

const InstructorList: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchString, setSearchString] = useState('');
  const { success, error: showError } = useNotification();

  const {
    currentPage,
    pageSize,
    totalPages,
    hasPrevious,
    hasNext,
    setCurrentPage,
    setPaginationData,
    goToFirstPage,
  } = usePagination();

  useEffect(() => {
    fetchInstructors();
  }, [currentPage, pageSize, searchString]);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getInstructors(currentPage, pageSize, searchString || undefined);

      setInstructors(data.data);
      setPaginationData({
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        hasPrevious: data.hasPrevious,
        hasNext: data.hasNext,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load instructors');
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

  const handleDelete = async (id: number, fullName: string) => {
    if (!window.confirm(`Are you sure you want to delete instructor "${fullName}"?`)) {
      return;
    }

    try {
      await deleteInstructor(id);
      success('Instructor deleted successfully');
      fetchInstructors();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete instructor';
      showError(errorMessage);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && instructors.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Instructors</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage instructor information and course assignments
          </p>
        </div>
        <Button asChild>
          <Link to="/instructors/create">
            <Plus className="mr-2 h-4 w-4" />
            Add New Instructor
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Instructors</CardTitle>
          <CardDescription>Filter instructors by name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            {searchString && (
              <Button onClick={handleClearSearch} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          {searchString && (
            <div className="mt-2 text-sm text-muted-foreground">
              Showing results for: <strong>{searchString}</strong>
            </div>
          )}
        </CardContent>
      </Card>

      {error && <ErrorMessage message={error} />}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Hire Date</TableHead>
              <TableHead>Office</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instructors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  {searchString ? 'No instructors found matching your search.' : 'No instructors found.'}
                </TableCell>
              </TableRow>
            ) : (
              instructors.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell>
                    <Link to={`/instructors/${instructor.id}`} className="text-primary hover:underline">
                      {instructor.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(instructor.hireDate)}</TableCell>
                  <TableCell className="text-muted-foreground">{instructor.officeLocation || '—'}</TableCell>
                  <TableCell>
                    {instructor.courseAssignments.length > 0 ? (
                      <div className="space-y-1">
                        {instructor.courseAssignments.map((course) => (
                          <div key={course.courseId} className="text-sm">
                            {course.courseNumber} {course.courseTitle}
                            <span className="text-muted-foreground"> ({course.departmentName})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No courses assigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/instructors/edit/${instructor.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button
                        onClick={() => handleDelete(instructor.id, instructor.fullName)}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default InstructorList;
