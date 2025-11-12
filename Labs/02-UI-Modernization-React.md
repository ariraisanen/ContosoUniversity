# Lab 2: UI Modernization - Moving to React

## Overview

In this lab, you'll use Spec-Kit to plan and execute a significant architectural change: migrating the Contoso University UI from Razor Pages to a modern React single-page application, while keeping the backend as a REST API.

## Learning Objectives

- Use Spec-Kit for large-scale architectural changes
- Separate frontend and backend concerns
- Create RESTful API endpoints from existing page models
- Build a modern React application with TypeScript
- Handle cross-cutting concerns (routing, state management, API communication)

## Prerequisites

- Completed Lab 1 (or familiar with Spec-Kit basics)
- Node.js 18+ and npm installed
- Basic React and TypeScript knowledge
- GitHub Copilot enabled in your IDE

## Duration

Approximately 2-3 hours

---

## Part 1: Planning with Spec-Kit

### Step 1: Create Feature Branch

```bash
git checkout main
git pull
git checkout -b feature/react-ui
```

### Step 2: Create High-Level Specification

Use Spec-Kit to create a planning document:

```bash
/speckit.plan
```

Or create `specs/002-react-ui/spec.md`:

```markdown
# Migrate UI to React SPA

## Problem Statement

The current Razor Pages architecture tightly couples frontend and backend code. To modernize the application and enable:
- Better separation of concerns
- Improved developer experience with modern frontend tooling
- Potential for mobile apps using the same API
- Easier testing of frontend and backend independently

We will migrate to a React-based SPA with a separate REST API backend.

## Scope

### In Scope
1. Create REST API controllers for all entities (Students, Courses, Instructors, Departments)
2. Implement React frontend with TypeScript
3. Maintain existing functionality (CRUD operations, pagination, relationships)
4. Modern UI using React best practices
5. API documentation (Swagger/OpenAPI)

### Out of Scope
- Authentication/authorization (future phase)
- Real-time features (SignalR)
- Mobile applications
- Complete UI redesign (maintain similar functionality)

## Architecture

### Backend (ASP.NET Core)
- Convert page models to API controllers
- Add DTOs for request/response models
- Implement AutoMapper for entity-DTO mapping
- Add CORS configuration
- Add Swagger for API documentation

### Frontend (React + TypeScript)
- Create React App with TypeScript template
- React Router for navigation
- Axios for API communication
- React Query for data fetching and caching
- Component structure mirrors current pages

## Success Criteria

1. All CRUD operations accessible via REST API
2. React app successfully calls all API endpoints
3. Pagination works in React UI
4. Related data loading works (e.g., courses with departments)
5. Error handling displays properly
6. Application maintainable and testable
```

### Step 3: Research Technical Details

In GitHub Copilot Chat, ask:

```
Research best practices for converting ASP.NET Core Razor Pages 
to REST API controllers. Also research React project structure 
for CRUD applications with multiple entities. Document your 
findings in specs/002-react-ui/research.md.
```

---

## Part 2: Backend API Implementation

### Step 1: Generate API Implementation Tasks

```bash
/speckit.tasks
```

Ask GitHub Copilot:

```
Create a detailed task breakdown for converting the Contoso University 
Razor Pages to a REST API backend, following specs/002-react-ui/spec.md
```

### Step 2: Create API Controllers with GitHub Copilot

Ask GitHub Copilot Chat:

```
Following the spec in specs/002-react-ui/spec.md, help me:

1. Add required NuGet packages (AutoMapper, Swashbuckle)
2. Create REST API controllers for Students, Courses, Instructors, and Departments
3. Each controller should handle: GET (list with pagination), GET (by id), POST, PUT, DELETE
4. Create DTOs for each entity
5. Follow RESTful conventions

Start with the Students controller as an example.
```

GitHub Copilot will guide you through creating the API structure.

### Step 4: Configure Swagger and CORS

Update `Program.cs` to add:

```
Add Swagger configuration and CORS policy to allow 
the React frontend (running on localhost:3000) to call the API
```

### Step 5: Test API Endpoints

```bash
dotnet run
```

Navigate to `https://localhost:7054/swagger` to test endpoints.

---

## Part 3: React Frontend Implementation

### Step 1: Create React Application

```bash
# From repository root
npx create-react-app contoso-university-ui --template typescript
cd contoso-university-ui
```

### Step 2: Install Dependencies

```bash
npm install react-router-dom axios @tanstack/react-query
npm install -D @types/react-router-dom
```

### Step 3: Create Project Structure

Ask GitHub Copilot:

```
Create a React project structure for the Contoso University frontend with:
- Services layer for API calls
- Components for each entity (Students, Courses, Instructors, Departments)
- Routing structure
- Shared components (Navbar, Pagination)
- Types/models for TypeScript
```

Expected structure:
```
src/
  components/
    Students/
      StudentsList.tsx
      StudentDetail.tsx
      StudentForm.tsx
    Courses/
    Instructors/
    Departments/
    shared/
      Navbar.tsx
      Pagination.tsx
  services/
    api.ts
    studentService.ts
    courseService.ts
  types/
    student.ts
    course.ts
  App.tsx
  index.tsx
```

### Step 4: Implement API Service Layer

Ask Copilot:

```
Create an Axios-based API service that:
- Configures base URL to the .NET API
- Handles authentication headers (for future)
- Has error handling
- Has TypeScript types for all endpoints
```

### Step 5: Implement Components

For each entity, implement:

```
Create React components for Students that:
- Display paginated list (StudentsList)
- Show details (StudentDetail)
- Handle create/edit (StudentForm)
- Use React Query for data fetching
- Include proper TypeScript typing
```

### Step 6: Add Routing

```
Configure React Router with routes for:
- / (Home)
- /students (list)
- /students/:id (detail)
- /students/create (create)
- /students/edit/:id (edit)
- Similar routes for courses, instructors, departments
```

### Step 7: Run React Application

```bash
npm start
```

Application opens at `http://localhost:3000`

---

## Part 4: Integration and Testing

### Step 1: Start Both Applications

**Terminal 1** (Backend):
```bash
cd ContosoUniversity
dotnet run
```

**Terminal 2** (Frontend):
```bash
cd contoso-university-ui
npm start
```

### Step 2: Test All Functionality

For each entity:
- [ ] List view loads with pagination
- [ ] Detail view displays correctly
- [ ] Create form submits successfully
- [ ] Edit form updates data
- [ ] Delete operation works
- [ ] Related data displays (e.g., course department)

### Step 3: Error Handling

Test error scenarios:
- Invalid form data
- Network errors
- 404 for non-existent resources

---

## Part 5: Documentation and Deployment

### Step 1: Update Documentation

Create `contoso-university-ui/README.md` with:
- Setup instructions
- Available scripts
- Environment configuration
- API endpoint documentation

### Step 2: Environment Configuration

Create `.env` file:
```
REACT_APP_API_URL=https://localhost:7054
```

### Step 3: Commit Changes

```bash
git add .
git commit -m "Add React frontend and REST API

- Created API controllers for all entities
- Added DTOs and AutoMapper configuration
- Configured Swagger and CORS
- Built React SPA with TypeScript
- Implemented all CRUD operations in React
- Added React Query for data management

Follows spec: specs/002-react-ui/spec.md"
```

---

## Key Takeaways

1. **Separation of Concerns**: Clean split between API and UI enables independent development
2. **Spec-Driven for Large Changes**: Breaking down complex migrations into specs prevents scope creep
3. **Modern Stack**: React + TypeScript + REST API is industry standard
4. **Iterative Development**: Build and test each component incrementally

## Challenge Extensions

1. **State Management**: Add Redux or Zustand for global state
2. **UI Framework**: Integrate Material-UI or Tailwind CSS
3. **Testing**: Add Jest tests for components and services
4. **Form Validation**: Use React Hook Form with Zod for validation
5. **Optimistic Updates**: Implement optimistic UI updates with React Query

## Troubleshooting

### CORS Issues
Ensure `Program.cs` has correct CORS configuration:
```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("ReactApp", builder =>
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyMethod()
               .AllowAnyHeader());
});

app.UseCors("ReactApp");
```

### API Connection Errors
Verify:
- Backend is running on expected port
- `REACT_APP_API_URL` is correct
- Certificate warnings accepted in browser

## Next Steps

Proceed to **Lab 3: Git Worktrees** to learn how to work on multiple UI iterations simultaneously, or explore optional feature labs.

## Resources

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [React Query](https://tanstack.com/query/latest)
- [ASP.NET Core Web API](https://learn.microsoft.com/aspnet/core/web-api)

