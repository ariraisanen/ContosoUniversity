// Course API service
import apiClient from './client';
import type { PaginatedResponse } from '../../types/api';
import type { Course, CreateCourse, UpdateCourse, Department } from '../../types/course';

/**
 * Get paginated list of courses with optional filtering
 */
export const getCourses = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  departmentId?: number,
  searchString?: string
): Promise<PaginatedResponse<Course>> => {
  const params = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  if (departmentId) {
    params.append('departmentId', departmentId.toString());
  }

  if (searchString) {
    params.append('searchString', searchString);
  }

  const response = await apiClient.get<PaginatedResponse<Course>>(
    `/courses?${params.toString()}`
  );
  return response.data;
};

/**
 * Get a single course by ID
 */
export const getCourseById = async (id: number): Promise<Course> => {
  const response = await apiClient.get<Course>(`/courses/${id}`);
  return response.data;
};

/**
 * Create a new course
 */
export const createCourse = async (course: CreateCourse): Promise<Course> => {
  const response = await apiClient.post<Course>('/courses', course);
  return response.data;
};

/**
 * Update an existing course
 */
export const updateCourse = async (
  id: number,
  course: UpdateCourse
): Promise<Course> => {
  const response = await apiClient.put<Course>(`/courses/${id}`, course);
  return response.data;
};

/**
 * Delete a course
 */
export const deleteCourse = async (id: number): Promise<void> => {
  await apiClient.delete(`/courses/${id}`);
};

/**
 * Get list of all departments for dropdown
 */
export const getDepartments = async (): Promise<Department[]> => {
  const response = await apiClient.get<PaginatedResponse<Department>>('/departments?pageSize=1000');
  return response.data.data;
};
