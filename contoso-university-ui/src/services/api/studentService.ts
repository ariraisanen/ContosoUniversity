// Student API service
import apiClient from './client';
import type { PaginatedResponse } from '../../types/api';
import type { Student, CreateStudent, UpdateStudent } from '../../types/student';

/**
 * Get paginated list of students with optional search
 */
export const getStudents = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  searchString?: string
): Promise<PaginatedResponse<Student>> => {
  const params = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  if (searchString) {
    params.append('searchString', searchString);
  }

  const response = await apiClient.get<PaginatedResponse<Student>>(
    `/students?${params.toString()}`
  );
  return response.data;
};

/**
 * Get a single student by ID
 */
export const getStudentById = async (id: number): Promise<Student> => {
  const response = await apiClient.get<Student>(`/students/${id}`);
  return response.data;
};

/**
 * Create a new student
 */
export const createStudent = async (student: CreateStudent): Promise<Student> => {
  const response = await apiClient.post<Student>('/students', student);
  return response.data;
};

/**
 * Update an existing student
 */
export const updateStudent = async (
  id: number,
  student: UpdateStudent
): Promise<Student> => {
  const response = await apiClient.put<Student>(`/students/${id}`, student);
  return response.data;
};

/**
 * Delete a student
 */
export const deleteStudent = async (id: number): Promise<void> => {
  await apiClient.delete(`/students/${id}`);
};
