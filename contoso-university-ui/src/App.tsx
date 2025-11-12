// T022: React Router setup
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import NavigationBar from './components/common/NavigationBar';

// Placeholder pages - will be implemented in user story phases
const HomePage: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">Welcome to Contoso University</h1>
    <p className="text-gray-600">
      Select a section from the navigation menu to get started.
    </p>
  </div>
);

const StudentsPage: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">Students</h1>
    <p className="text-gray-600">Student management will be implemented in Phase 3.</p>
  </div>
);

const CoursesPage: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">Courses</h1>
    <p className="text-gray-600">Course management will be implemented in Phase 4.</p>
  </div>
);

const DepartmentsPage: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">Departments</h1>
    <p className="text-gray-600">Department management will be implemented in Phase 5.</p>
  </div>
);

const InstructorsPage: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">Instructors</h1>
    <p className="text-gray-600">Instructor management will be implemented in Phase 6.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <NavigationBar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/students/*" element={<StudentsPage />} />
              <Route path="/courses/*" element={<CoursesPage />} />
              <Route path="/departments/*" element={<DepartmentsPage />} />
              <Route path="/instructors/*" element={<InstructorsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </NotificationProvider>
  );
};

export default App;

