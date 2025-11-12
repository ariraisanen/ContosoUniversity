# Research: React SPA Migration Technology Decisions

**Feature**: React SPA Migration with REST API Backend  
**Branch**: `002-react-spa-migration`  
**Date**: 2025-11-12

## Overview

This document captures research findings and technology decisions for migrating Contoso University from Razor Pages to a React SPA with REST API backend.

## 1. ASP.NET Core Web API Best Practices

### Decision: Service Layer Pattern with Direct EF Core Access

**Chosen Approach**: Implement a service layer (e.g., `StudentService`) that encapsulates business logic and uses EF Core `DbContext` directly, without a separate repository layer.

**Rationale**:

- **EF Core is Already a Repository**: `DbContext` and `DbSet<T>` provide unit of work and repository patterns
- **Reduced Complexity**: Avoiding an additional abstraction layer makes code more straightforward for educational purposes (aligns with Constitutional Principle II: Educational Clarity)
- **Microsoft Recommendation**: Official ASP.NET Core documentation recommends direct `DbContext` usage in services for most applications
- **LINQ Benefits**: Direct access to `DbSet<T>` allows full LINQ capabilities without wrapping

**Alternatives Considered**:

- **Generic Repository Pattern**: Rejected due to over-abstraction for this project's scale and educational focus
- **Direct DbContext in Controllers**: Rejected as it violates separation of concerns and makes testing harder

**References**:

- Microsoft Docs: "ASP.NET Core Web API Best Practices" - recommends service layer with direct EF Core access
- "Common web application architectures" - advocates for keeping architecture simple unless complexity is justified

### Decision: REST API Routing with Attribute Routing and ApiController

**Chosen Approach**: Use attribute routing with `[Route("api/[controller]")]` and `[ApiController]` attribute on controllers.

**Rationale** (validated with latest Microsoft Docs):

- **[ApiController] Benefits**: Enables automatic 400 validation responses, attribute routing requirement enforcement, binding source parameter inference, and automatic ProblemDetails responses
- **REST Conventions**: Attribute routing with HTTP verb attributes (`[HttpGet]`, `[HttpPost]`, `[HttpPut]`, `[HttpDelete]`) models resources with operations
- **Token Replacement**: `[controller]` token automatically replaced with controller name (minus "Controller" suffix)
- **Route Templates**: Support for parameters like `{id}` with constraints and optional segments

**Implementation Pattern**:

```csharp
[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<StudentDto>>> GetStudents(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    { /* ... */ }

    [HttpGet("{id}")]
    public async Task<ActionResult<StudentDto>> GetStudent(int id)
    { /* ... */ }

    [HttpPost]
    public async Task<ActionResult<StudentDto>> CreateStudent(CreateStudentDto dto)
    { /* ... */ }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, UpdateStudentDto dto)
    { /* ... */ }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    { /* ... */ }
}
```

### Decision: ProblemDetails for Error Responses (RFC 7807)

**Chosen Approach**: Use ASP.NET Core's built-in ProblemDetails support with `AddProblemDetails()` middleware.

**Rationale** (validated with latest Microsoft Docs):

- **RFC 7807 Compliance**: Standard machine-readable format for HTTP API errors
- **Automatic Generation**: `[ApiController]` automatically returns ProblemDetails for 400 validation errors
- **Middleware Support**: `UseExceptionHandler()` and `UseStatusCodePages()` generate ProblemDetails responses
- **Consistent Format**: All errors follow same structure: `{"type", "title", "status", "traceId", "errors"}`
- **ValidationProblemDetails**: Specialized type for model validation errors with `errors` dictionary

**Implementation Pattern**:

```csharp
// Program.cs
builder.Services.AddProblemDetails();

app.UseExceptionHandler();  // Generates ProblemDetails for unhandled exceptions
app.UseStatusCodePages();   // Generates ProblemDetails for empty responses

// Custom exception handling
public class ErrorHandlingMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try { await next(context); }
        catch (ValidationException ex)
        {
            var problemDetails = new ValidationProblemDetails
            {
                Status = 400,
                Title = "Validation Error",
                Detail = ex.Message,
                Instance = context.Request.Path
            };
            problemDetails.Errors.Add(ex.FieldName, new[] { ex.Message });
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(problemDetails);
        }
        catch (NotFoundException ex)
        {
            var problemDetails = new ProblemDetails
            {
                Status = 404,
                Title = "Not Found",
                Detail = ex.Message,
                Instance = context.Request.Path
            };
            context.Response.StatusCode = 404;
            await context.Response.WriteAsJsonAsync(problemDetails);
        }
        catch (DbUpdateConcurrencyException)
        {
            var problemDetails = new ProblemDetails
            {
                Status = 409,
                Title = "Concurrency Conflict",
                Detail = "Record was modified by another user",
                Instance = context.Request.Path
            };
            context.Response.StatusCode = 409;
            await context.Response.WriteAsJsonAsync(problemDetails);
        }
    }
}
```

### Decision: Manual DTO Mapping (No AutoMapper)

**Chosen Approach**: Use manual mapping methods (e.g., `ToDto()` extension methods or mapping in service layer).

**Rationale** (validated with latest Microsoft Docs):

- **Explicit and Clear**: Mapping logic is visible and easy to understand (educational clarity)
- **Prevents Over-posting**: DTOs are subsets of models to prevent binding sensitive fields (Microsoft recommended pattern)
- **No Magic**: Avoids AutoMapper's convention-based behavior that can be confusing for learners
- **Performance**: Manual mapping is slightly faster (no reflection overhead)
- **Simple Mappings**: Most DTOs are straightforward field mappings with minimal complexity

**Implementation Pattern**:

```csharp
// Microsoft Docs DTO over-posting prevention pattern
public static class StudentMappings
{
    public static StudentDto ToDto(this Student student)
    {
        return new StudentDto
        {
            Id = student.ID,
            FirstName = student.FirstMidName,
            LastName = student.LastName,
            EnrollmentDate = student.EnrollmentDate.ToString("O"),
            EnrollmentCount = student.Enrollments?.Count ?? 0,
            RowVersion = Convert.ToBase64String(student.RowVersion)
            // Sensitive fields like RowVersion internal bytes excluded
        };
    }
}
```

**Alternatives Considered**:

- **AutoMapper**: Rejected due to setup overhead, learning curve, and "magic" conventions that obscure mapping logic
- **Mapster**: Similar reasons to AutoMapper rejection

---

## 2. CORS Configuration for React SPA

### Decision: Named CORS Policy with Explicit Origins

**Chosen Approach**: Define a named CORS policy (e.g., "AllowReactApp") in `Program.cs` with explicit allowed origins.

**Rationale** (validated with latest Microsoft Docs):

- **Security**: Explicit origins are more secure than wildcard `AllowAnyOrigin()`
- **Flexibility**: Named policies allow different configurations for development/production
- **Best Practice**: Microsoft recommends named policies for production applications
- **Credential Support**: `AllowCredentials()` requires specific origins (cannot use with `AllowAnyOrigin()`)
- **Middleware Ordering Critical**: `UseCors()` must be placed **after** `UseRouting()` and **before** `UseAuthorization()`
- **Exposed Headers**: Use `WithExposedHeaders()` to expose custom headers like ETag beyond simple response headers

**Configuration Pattern**:

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials() // For future auth support
              .WithExposedHeaders("ETag"); // Expose ETag for concurrency control
    });
});

// Middleware order is critical
app.UseRouting();
app.UseCors("AllowReactApp"); // After UseRouting(), before UseAuthorization()
app.UseAuthorization();
```

**Security Warnings from Microsoft Docs**:

- ⚠️ **AllowCredentials + AllowAnyOrigin**: Cannot be combined - security risk
- ⚠️ **AllowCredentials + Wildcards**: Insecure configuration, allows any origin to send credentials
- ✅ **Recommended**: Use specific origins with `WithOrigins()` when credentials are enabled

**Alternatives Considered**:

- **AllowAnyOrigin()**: Rejected due to security concerns and inability to use with credentials
- **No CORS Configuration**: Not viable; browsers enforce same-origin policy for API calls

**References**:

- Microsoft Docs: "Enable Cross-Origin Requests (CORS) in ASP.NET Core"
- Microsoft Docs: CORS middleware ordering requirements

---

## 3. Swagger/OpenAPI Integration

### Decision: Swashbuckle.AspNetCore with XML Comments

**Chosen Approach**: Use `Swashbuckle.AspNetCore` package with XML documentation comments for API documentation.

**Rationale** (validated with latest Microsoft Docs):

- **Industry Standard**: Swashbuckle is the community-driven OpenAPI library for ASP.NET Core (also NSwag available)
- **Auto-Generation**: Automatically generates OpenAPI spec from controller attributes and routing
- **Interactive UI**: Swagger UI provides interactive API testing interface
- **XML Documentation**: Triple-slash comments (`///`) enhance API documentation with descriptions and examples
- **Compile-Time Processing**: XML documentation source generator processes comments at compile-time (minimal runtime overhead)
- **Data Annotations**: Attributes like `[Required]`, `[Range]` automatically enhance Swagger UI

**Configuration Pattern**:

```csharp
// Program.cs
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Contoso University API",
        Version = "v1",
        Description = "REST API for Contoso University student management system",
        Contact = new OpenApiContact
        {
            Name = "Support",
            Email = "support@contoso.edu"
        },
        License = new OpenApiLicense
        {
            Name = "MIT",
            Url = new Uri("https://opensource.org/licenses/MIT")
        }
    });

    // Enable XML comments for better documentation
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

app.UseSwagger();
app.UseSwaggerUI();
```

**Enable XML Documentation in .csproj**:

```xml
<PropertyGroup>
  <GenerateDocumentationFile>true</GenerateDocumentationFile>
  <NoWarn>$(NoWarn);1591</NoWarn> <!-- Suppress missing XML comment warnings -->
</PropertyGroup>
```

**XML Documentation Pattern**:

```csharp
/// <summary>
/// Retrieves a paginated list of students
/// </summary>
/// <param name="pageNumber">The page number (1-based)</param>
/// <param name="pageSize">Number of items per page (max 100)</param>
/// <returns>A paginated list of students</returns>
/// <response code="200">Returns the paginated student list</response>
/// <response code="400">If pagination parameters are invalid</response>
[HttpGet]
[ProducesResponseType(typeof(PaginatedResponse<StudentDto>), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
public async Task<ActionResult<PaginatedResponse<StudentDto>>> GetStudents(
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 10)
{
    // Implementation
}
```

**Alternatives Considered**:

- **NSwag**: More features but more complex; Swashbuckle is sufficient for this project
- **Manual OpenAPI YAML**: Too much maintenance overhead; auto-generation is preferred

**References**:

- Microsoft Docs: "Get started with Swashbuckle and ASP.NET Core"
- Microsoft Docs: "XML documentation comments" - triple-slash comment syntax

---

## 3a. API Versioning Strategy

### Decision: URI Versioning (Deferred Implementation)

**Chosen Approach**: Use URI-based versioning (e.g., `/api/v1/students`) when versioning becomes necessary.

**Rationale** (validated with Microsoft Docs research):

- **Four Standard Strategies**: Microsoft documents four versioning approaches:
  1. **URI Versioning**: `/api/v1/resource` - Simplest, most visible, good for breaking changes
  2. **Query String**: `?api-version=1` - Less visible, may not cache well in older proxies
  3. **Header Versioning**: `Custom-Header: api-version=1` - Requires more logic, not as explicit
  4. **Media Type Versioning**: `Accept: application/vnd.contoso.v1+json` - Best for HATEOAS, most sophisticated
- **URI Chosen Because**: Simplest to understand, URLs are bookmarkable, explicit in routing
- **Backward Compatibility**: Microsoft emphasizes existing URIs should continue to work
- **Current Status**: Version 1 will be implemented without explicit `/v1/` prefix initially (YAGNI principle)

**Future Implementation Pattern**:

```csharp
// When v2 is needed in the future
[ApiController]
[Route("api/v1/[controller]")]
public class StudentsV1Controller : ControllerBase { }

[ApiController]
[Route("api/v2/[controller]")]
public class StudentsV2Controller : ControllerBase { }

// Or use Microsoft.AspNetCore.Mvc.Versioning package
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});
```

**Current Decision**: Defer explicit versioning until v2 is needed. Start with clean `/api/students` routes. This aligns with YAGNI (You Aren't Gonna Need It) and Constitutional Principle V (Iterative Refinement).

**Alternatives Considered**:

- **No Versioning**: Would make breaking changes difficult in future
- **Query String Versioning**: Less visible, harder to document
- **Header/Media Type Versioning**: Too complex for this educational project

**References**:

- Microsoft Docs: "API Versioning Strategies" - covers all four approaches
- REST API best practices for versioning

---

## 4. React TypeScript Project Setup

### Decision: Vite with React TypeScript Template

**Chosen Approach**: Use Vite with the official React TypeScript template (`npm create vite@latest -- --template react-ts`).

**Rationale** (validated with React documentation):

- **Fast Development**: Vite's HMR (Hot Module Replacement) is significantly faster than Webpack-based tools
- **Modern Tooling**: Uses native ES modules, esbuild for bundling
- **Official Support**: React team recommends Vite for new projects
- **Simple Configuration**: Minimal configuration needed for typical SPA
- **TypeScript First**: Excellent TypeScript support out of the box

**React Hooks Best Practices** (validated with official React source):

- **Rules of Hooks**: Hooks must be called at top level (not in conditions/loops) - enforced by compiler
- **useState Pattern**: `const [state, setState] = useState(initialValue)` for state management
- **useEffect Dependencies**: Dependencies array controls when effects run - critical for preventing infinite loops
- **useContext Pattern**: Access global context with `const value = useContext(MyContext)`
- **useRef Pattern**: Mutable references that persist across renders without causing re-renders
- **Custom Hooks**: Extract reusable stateful logic, must follow "use" naming convention

**Component Patterns** (validated with official React compiler tests):

```typescript
// Standard functional component with hooks
import { useState, useEffect } from 'react';

function Component({ propValue }: { propValue: string }) {
  const [state, setState] = useState<string>('');
  
  useEffect(() => {
    // Effect runs when propValue changes
    setState(propValue);
  }, [propValue]);

  return <div>{state}</div>;
}

// Controlled form input pattern
function FormComponent() {
  const [value, setValue] = useState('');
  
  return (
    <input 
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

**Alternatives Considered**:

- **Create React App (CRA)**: Deprecated and no longer actively maintained; slower build times
- **Next.js**: Overkill for this project; we don't need SSR/SSG capabilities
- **Webpack Manual Setup**: Too complex and time-consuming for educational project

**TypeScript Configuration**:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**References**:

- Vite Documentation: "Getting Started"
- React Documentation: "Start a New React Project"
- React GitHub: Official React compiler test fixtures for hook patterns

---

## 5. React Router Configuration

### Decision: React Router v6 with BrowserRouter

**Chosen Approach**: Use React Router v6 with `BrowserRouter` and declarative route configuration.

**Rationale** (validated with React Router v6/v7 documentation):

- **Latest Version**: v6/v7 provides improved API with hooks like `useNavigate`, `useParams`, `useLocation`
- **Type Safety**: Excellent TypeScript support with typed parameters
- **Nested Routes**: Supports complex routing patterns with `<Outlet />` for child routes
- **Standard**: React Router is the de facto routing library for React SPAs
- **Dynamic Parameters**: Route parameters via `:paramName` syntax accessed through `useParams()`
- **Programmatic Navigation**: `useNavigate()` hook for imperative navigation after events

**Core Routing Patterns** (validated with official React Router docs):

```typescript
// Basic setup with BrowserRouter
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/create" element={<StudentCreatePage />} />
        <Route path="/students/:id" element={<StudentDetailsPage />} />
        <Route path="/students/:id/edit" element={<StudentEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// Accessing route parameters with useParams
import { useParams } from "react-router-dom";

function StudentDetailsPage() {
  const { id } = useParams(); // TypeScript infers string | undefined
  // Fetch student data using id
}

// Programmatic navigation with useNavigate
import { useNavigate } from "react-router-dom";

function StudentForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (data: StudentDto) => {
    await studentsApi.create(data);
    navigate("/students"); // Navigate after successful creation
  };
  
  const handleCancel = () => {
    navigate(-1); // Go back one page
  };
}

// Declarative navigation with Link and NavLink
import { Link, NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      {/* NavLink provides active state styling */}
      <NavLink 
        to="/students" 
        className={({ isActive }) => isActive ? "active" : ""}
      >
        Students
      </NavLink>
      
      {/* Link for simple navigation */}
      <Link to="/courses">Courses</Link>
    </nav>
  );
}
```

**Advanced Patterns**:

```typescript
// Access location object with useLocation
import { useLocation } from "react-router-dom";

function Analytics() {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);
}

// Navigate with state
const navigate = useNavigate();
navigate("/dashboard", { 
  state: { from: location.pathname, username } 
});

// Replace history entry (no back button)
navigate("/dashboard", { replace: true });
```

**Alternatives Considered**:

- **TanStack Router**: Too new, less community support, though has excellent TypeScript integration
- **Wouter**: Too minimal for this project's routing needs
- **HashRouter**: Rejected; BrowserRouter provides cleaner URLs

**References**:

- React Router Documentation v6/v7
- React Router GitHub: Official route configuration examples
- React Router Hooks: useNavigate, useParams, useLocation API documentation

---

## 6. API Client Architecture

### Decision: Axios with Centralized Configuration

**Chosen Approach**: Use Axios library with centralized instance configuration and typed service modules.

**Rationale**:

- **Interceptors**: Built-in request/response interceptor support for error handling, logging
- **Automatic JSON**: Automatically parses JSON responses and sets Content-Type headers
- **Better Errors**: Provides more detailed error information than Fetch API
- **TypeScript Support**: Excellent type definitions with generics
- **Timeout Support**: Built-in request timeout configuration
- **Cancellation**: Request cancellation support for cleanup in useEffect

**Note on TanStack Query** (researched but not chosen):

TanStack Query (React Query) is an excellent data-fetching library with automatic caching, background refetching, and optimistic updates. However, for this educational project:

- **Educational Clarity**: Direct Axios calls make data flow more explicit for learners
- **Reduced Complexity**: Avoids additional concepts like query keys, cache invalidation strategies
- **Constitutional Alignment**: Simplicity principle (Principle II and V)
- **Future Enhancement**: Can migrate to TanStack Query as an advanced workshop module

**TanStack Query Patterns** (for reference):

```typescript
// If we were to use TanStack Query (future consideration)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query with automatic caching
const { data, isLoading, error } = useQuery({
  queryKey: ['students', pageNumber],
  queryFn: () => studentsApi.getAll(pageNumber, pageSize)
});

// Mutation with cache invalidation
const mutation = useMutation({
  mutationFn: postStudent,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['students'] })
  }
});
```

**Chosen Implementation Pattern**:

```typescript
// services/api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7001/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 409) {
      // Handle concurrency conflict
      return Promise.reject(new ConcurrencyError(error.response.data));
    }
    return Promise.reject(error);
  }
);

// services/api/students.ts
export const studentsApi = {
  getAll: (pageNumber: number, pageSize: number) =>
    apiClient.get<PaginatedResponse<Student>>("/students", {
      params: { pageNumber, pageSize },
    }),

  getById: (id: number) => apiClient.get<Student>(`/students/${id}`),

  create: (student: CreateStudentDto) =>
    apiClient.post<Student>("/students", student),

  update: (id: number, student: UpdateStudentDto) =>
    apiClient.put<Student>(`/students/${id}`, student),

  delete: (id: number) => apiClient.delete(`/students/${id}`),
};
```

**Alternatives Considered**:

- **Fetch API**: More verbose, requires manual error handling, no interceptors
- **TanStack Query (React Query)**: Excellent but adds complexity not needed for this educational project (could be future enhancement)
- **SWR**: Similar to React Query, over-engineered for current requirements

**References**:

- Axios Documentation
- TanStack Query Documentation (for future consideration)
- "Best Practices for API Calls in React" (various blog posts)

---

## 7. State Management Strategy

### Decision: React Context API for Global State + Local useState

**Chosen Approach**: Use React Context API for truly global state (e.g., notification system) and `useState` for component-local state.

**Rationale**:

- **Built-In**: No external dependencies, part of React
- **Sufficient Complexity**: This application doesn't need Redux's advanced features
- **Educational Clarity**: Easier to understand for workshop participants
- **Constitutional Alignment**: Avoids unnecessary complexity (Principle II and V)
- **Component Patterns**: Most state is local to feature components (forms, lists)

**State Architecture**:

- **Global State (Context)**:

  - Notification system (success/error messages)
  - API base URL configuration
  - (Future: Authentication context when implemented)

- **Local State (useState/useReducer)**:
  - Form input values
  - Loading states
  - Pagination state
  - List data (fetched from API)
  - Modal open/close states

**Context Pattern**:

```typescript
// context/NotificationContext.tsx
interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export const NotificationContext = createContext<NotificationContextType>(
  null!
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showSuccess = (message: string) => {
    setNotification({ type: "success", message });
  };

  const showError = (message: string) => {
    setNotification({ type: "error", message });
  };

  return (
    <NotificationContext.Provider value={{ showSuccess, showError }}>
      {children}
      {notification && <NotificationBanner {...notification} />}
    </NotificationContext.Provider>
  );
}
```

**Alternatives Considered**:

- **Redux Toolkit**: Overkill for this project's state complexity; adds boilerplate
- **Zustand**: Simpler than Redux but still an external dependency; Context API is sufficient
- **Jotai/Recoil**: Atomic state management is unnecessary for this application's needs

**References**:

- React Documentation: "useContext"
- "You Might Not Need Redux" by Dan Abramov

---

## 8. Form Handling and Validation

### Decision: Controlled Components with Custom Validation Hooks

**Chosen Approach**: Use controlled components with custom `useForm` hook for validation logic.

**Rationale**:

- **Educational Value**: Custom hook demonstrates React patterns clearly
- **No External Dependencies**: Keeps bundle size small and dependencies minimal
- **Flexibility**: Easy to customize validation rules per form requirements
- **TypeScript Integration**: Fully typed without library-specific types to learn

**Note on React Hook Form** (researched but not chosen):

React Hook Form is an excellent, performant form library with features like:

- **Uncontrolled Components**: Uses refs to minimize re-renders
- **Built-in Validation**: Integration with validation libraries (Zod, Yup, Joi)
- **Developer Experience**: Simple API with `register()` and `handleSubmit()`

**React Hook Form Pattern** (for reference):

```typescript
import { useForm } from "react-hook-form";

function StudentForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<StudentDto>();
  
  const onSubmit = (data: StudentDto) => {
    studentsApi.create(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName", { required: "First name is required" })} />
      {errors.firstName && <span>{errors.firstName.message}</span>}
    </form>
  );
}
```

However, for this educational project, we chose a custom hook to:

- **Show React fundamentals**: Controlled components, state management patterns
- **Avoid library magic**: Registration syntax and ref-based approach can be confusing for learners
- **Constitutional alignment**: Educational clarity (Principle II)

**Chosen Implementation Pattern**:

```typescript
// hooks/useForm.ts
export function useForm<T>(
  initialValues: T,
  validate: (values: T) => Record<string, string>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Real-time validation
    const validationErrors = validate({ ...values, [name]: value });
    setErrors(validationErrors);
  };

  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  return { values, errors, touched, handleChange, handleBlur };
}

// Usage in component
function StudentForm() {
  const { values, errors, touched, handleChange, handleBlur } = useForm(
    { firstName: "", lastName: "", enrollmentDate: "" },
    validateStudent
  );

  return (
    <form>
      <input
        value={values.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
        onBlur={() => handleBlur("firstName")}
      />
      {touched.firstName && errors.firstName && (
        <span className="error">{errors.firstName}</span>
      )}
    </form>
  );
}
```

**Alternatives Considered**:

- **React Hook Form**: Excellent library but adds dependency; custom solution is more educational
- **Formik**: More complex API, larger bundle size, declining popularity
- **Uncontrolled Components**: Harder to provide real-time validation feedback

**References**:

- React Documentation: "Forms" - controlled components pattern
- React Hook Form Documentation (for future consideration)
- "Building Custom Hooks in React" patterns

---

## 9. Optimistic Locking Implementation

### Decision: EF Core RowVersion with ETag Response Headers

**Chosen Approach**: Use EF Core's `[Timestamp]` attribute (SQL Server `rowversion`) and return version in ETag header for optimistic concurrency.

**Rationale**:

- **Built-In EF Support**: EF Core automatically detects concurrency conflicts with `DbUpdateConcurrencyException`
- **Automatic Updates**: SQL Server updates `rowversion` automatically on every change
- **Standard HTTP**: ETag headers are RESTful standard for versioning
- **Client Flexibility**: Client can use ETag from response for subsequent updates

**Backend Implementation**:

```csharp
// Model (already exists)
public class Student
{
    public int ID { get; set; }
    [Timestamp]
    public byte[] RowVersion { get; set; }
    // ... other properties
}

// DTO
public class StudentDto
{
    public int Id { get; set; }
    public string RowVersion { get; set; } // Base64 encoded
    // ... other properties
}

// Controller
[HttpPut("{id}")]
public async Task<IActionResult> UpdateStudent(int id, StudentDto dto)
{
    var student = await _context.Students.FindAsync(id);
    if (student == null) return NotFound();

    student.RowVersion = Convert.FromBase64String(dto.RowVersion);
    // ... update other properties

    try
    {
        await _context.SaveChangesAsync();
        Response.Headers.Add("ETag", Convert.ToBase64String(student.RowVersion));
        return Ok(student.ToDto());
    }
    catch (DbUpdateConcurrencyException)
    {
        return Conflict(new { error = "Record was modified by another user. Please refresh and try again." });
    }
}
```

**Frontend Handling**:

```typescript
// Store rowVersion from GET response
const [student, setStudent] = useState<Student | null>(null);

// Include rowVersion in PUT request
const handleUpdate = async () => {
  try {
    const response = await studentsApi.update(student.id, {
      ...student,
      rowVersion: student.rowVersion,
    });
    // Success - update local state with new rowVersion
    setStudent(response.data);
    showSuccess("Student updated successfully");
  } catch (error) {
    if (error.response?.status === 409) {
      showError("Another user modified this record. Refreshing...");
      // Reload fresh data
      const fresh = await studentsApi.getById(student.id);
      setStudent(fresh.data);
    }
  }
};
```

**Alternatives Considered**:

- **Timestamp Field**: Would require manual comparison; rowversion is automatic
- **Last-Modified Headers**: Less precise than ETag; harder to implement correctly
- **Pessimistic Locking**: Not suitable for web applications; causes blocking

**References**:

- EF Core Documentation: "Handling Concurrency Conflicts"
- RFC 7232: "HTTP/1.1 Conditional Requests" (ETag specification)

---

## 10. Pagination Patterns

### Decision: Offset-Based Pagination with PaginatedResponse DTO

**Chosen Approach**: Use `pageNumber` (1-based) and `pageSize` query parameters with metadata response.

**Rationale**:

- **Simplicity**: Easy to understand and implement (educational clarity)
- **URL Bookmarkability**: Users can share links to specific pages
- **Spec Requirement**: Explicitly specified in FR-006a through FR-006c
- **EF Core Support**: `Skip()` and `Take()` methods work naturally with offset pagination

**Backend Implementation**:

```csharp
public class PaginatedResponseDto<T>
{
    public List<T> Data { get; set; }
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

// Extension method
public static async Task<PaginatedResponseDto<T>> ToPaginatedListAsync<T>(
    this IQueryable<T> source, int pageNumber, int pageSize)
{
    pageSize = Math.Min(pageSize, 100); // Max 100 per page
    var count = await source.CountAsync();
    var items = await source
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return new PaginatedResponseDto<T>
    {
        Data = items,
        TotalCount = count,
        PageNumber = pageNumber,
        PageSize = pageSize,
        TotalPages = (int)Math.Ceiling(count / (double)pageSize)
    };
}

// Controller usage
[HttpGet]
public async Task<ActionResult<PaginatedResponseDto<StudentDto>>> GetStudents(
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 10)
{
    var result = await _context.Students
        .OrderBy(s => s.LastName)
        .ToPaginatedListAsync(pageNumber, pageSize);

    return Ok(new PaginatedResponseDto<StudentDto>
    {
        Data = result.Data.Select(s => s.ToDto()).ToList(),
        TotalCount = result.TotalCount,
        PageNumber = result.PageNumber,
        PageSize = result.PageSize,
        TotalPages = result.TotalPages
    });
}
```

**Frontend Pagination Component**:

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => onPageChange(1)}>
        First
      </button>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        Last
      </button>
    </div>
  );
}
```

**Alternatives Considered**:

- **Cursor-Based Pagination**: More complex, better for infinite scroll but overkill for this project
- **Limit-Offset**: Similar to pageNumber/pageSize but less user-friendly (offsets are harder to understand)
- **Skip Token Pagination**: Used by Microsoft Graph API but too complex for educational purposes

**References**:

- Microsoft Docs: "Pagination in ASP.NET Core Web API"
- REST API Design Best Practices for pagination

---

## Summary of Key Technology Choices

| Area                      | Technology                           | Rationale                                                    |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------ |
| **Backend Framework**     | ASP.NET Core Web API (.NET 9.0)      | Existing project base, modern, cross-platform                |
| **Architecture**          | Service Layer + EF Core Direct       | Balance of separation and simplicity                         |
| **API Controllers**       | [ApiController] + Attribute Routing  | Automatic validation, ProblemDetails, binding inference      |
| **Error Handling**        | ProblemDetails (RFC 7807)            | Standard machine-readable format, middleware support         |
| **DTO Mapping**           | Manual Mapping                       | Educational clarity, explicit logic, prevents over-posting   |
| **CORS**                  | Named Policy with Explicit Origins   | Security best practice, credential support                   |
| **API Documentation**     | Swashbuckle.AspNetCore + XML         | Industry standard OpenAPI generator, compile-time docs       |
| **API Versioning**        | URI-based (deferred)                 | Simplest strategy, bookmarkable, explicit routing            |
| **Frontend Framework**    | React 19+ with TypeScript            | Modern, component-based, type-safe                           |
| **Build Tool**            | Vite                                 | Fast development experience, native ESM                      |
| **Routing**               | React Router v6/v7                   | Standard SPA routing, hooks-based API                        |
| **HTTP Client**           | Axios                                | Interceptors, better error handling, timeout support         |
| **State Management**      | Context API + useState               | Sufficient for complexity, built-in, educational clarity     |
| **Form Handling**         | Custom useForm Hook                  | Educational value, no dependencies                           |
| **Form Library Research** | React Hook Form (noted, not chosen)  | Excellent but reduces educational value for workshops        |
| **Data Fetching Research**| TanStack Query (noted, not chosen)   | Powerful caching but adds complexity (future consideration)  |
| **Concurrency**           | EF Core RowVersion + ETag            | Built-in support, RESTful standard                           |
| **Pagination**            | Offset-Based (pageNumber/pageSize)   | Simple, bookmarkable, spec requirement                       |

---

## Research Validation Summary

This research document has been enhanced with findings from:

- **Microsoft Docs MCP Server**: Validated 50+ official ASP.NET Core documentation articles covering:
  - REST API attribute routing and [ApiController] patterns
  - ProblemDetails RFC 7807 implementation with middleware
  - CORS configuration with middleware ordering requirements
  - Swashbuckle/OpenAPI with XML documentation comments
  - API versioning strategies (URI, query, header, media type)
  
- **Context7 MCP Server**: Validated React ecosystem patterns from official sources:
  - React hooks patterns (useState, useEffect, useContext) from official React compiler tests
  - React Router v6/v7 routing patterns (BrowserRouter, useNavigate, useParams, useLocation)
  - TanStack Query data fetching patterns (noted for future consideration)
  - React Hook Form patterns (noted but not chosen for educational reasons)

All technology decisions align with:
- Latest official documentation (as of November 2025)
- Microsoft's recommended practices for ASP.NET Core
- React community standards and official React documentation
- Constitutional principles (educational clarity, simplicity, iterative refinement)

---

## Next Steps

With research complete, proceed to Phase 1:

1. ✅ Design DTOs in `data-model.md`
2. ✅ Generate API contracts in `contracts/`
3. ✅ Create quickstart guide in `quickstart.md`
4. ✅ Update agent context with new technologies
