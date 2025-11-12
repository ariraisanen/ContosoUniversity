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

### Decision: Middleware for Global Error Handling

**Chosen Approach**: Create custom `ErrorHandlingMiddleware` to catch exceptions globally and return consistent error responses.

**Rationale**:
- **Single Responsibility**: Centralized error handling in one place
- **Consistent Responses**: Ensures all errors return the same JSON format: `{"error": "message", "field": "fieldName"}`
- **Exception Details Control**: Can differentiate development vs. production error details
- **Framework Alignment**: ASP.NET Core middleware pipeline is the recommended approach

**Alternatives Considered**:
- **Exception Filters**: Rejected because middleware executes earlier in the pipeline and can catch more error types
- **Try-Catch in Each Controller**: Rejected due to code duplication and inconsistency risk

**Implementation Pattern**:
```csharp
public class ErrorHandlingMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try { await next(context); }
        catch (ValidationException ex) { /* Return 400 with field errors */ }
        catch (NotFoundException ex) { /* Return 404 */ }
        catch (DbUpdateConcurrencyException ex) { /* Return 409 */ }
        catch (Exception ex) { /* Return 500 with safe message */ }
    }
}
```

### Decision: Manual DTO Mapping (No AutoMapper)

**Chosen Approach**: Use manual mapping methods (e.g., `ToDto()` extension methods or mapping in service layer).

**Rationale**:
- **Explicit and Clear**: Mapping logic is visible and easy to understand (educational clarity)
- **No Magic**: Avoids AutoMapper's convention-based behavior that can be confusing for learners
- **Performance**: Manual mapping is slightly faster (no reflection overhead)
- **Simple Mappings**: Most DTOs are straightforward field mappings with minimal complexity

**Alternatives Considered**:
- **AutoMapper**: Rejected due to setup overhead, learning curve, and "magic" conventions that obscure mapping logic
- **Mapster**: Similar reasons to AutoMapper rejection

**Implementation Pattern**:
```csharp
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
        };
    }
}
```

---

## 2. CORS Configuration for React SPA

### Decision: Named CORS Policy with Explicit Origins

**Chosen Approach**: Define a named CORS policy (e.g., "AllowReactApp") in `Program.cs` with explicit allowed origins.

**Rationale**:
- **Security**: Explicit origins are more secure than wildcard `AllowAnyOrigin()`
- **Flexibility**: Named policies allow different configurations for development/production
- **Best Practice**: Microsoft recommends named policies for production applications
- **Credential Support**: Allows for future authentication implementation with cookies/tokens

**Configuration Pattern**:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // For future auth support
    });
});

app.UseCors("AllowReactApp"); // After UseRouting(), before UseAuthorization()
```

**Alternatives Considered**:
- **AllowAnyOrigin()**: Rejected due to security concerns and inability to use with credentials
- **No CORS Configuration**: Not viable; browsers enforce same-origin policy for API calls

**References**:
- Microsoft Docs: "Enable Cross-Origin Requests (CORS) in ASP.NET Core"

---

## 3. Swagger/OpenAPI Integration

### Decision: Swashbuckle.AspNetCore with XML Comments

**Chosen Approach**: Use `Swashbuckle.AspNetCore` package with XML documentation comments for API documentation.

**Rationale**:
- **Industry Standard**: Swashbuckle is the de facto OpenAPI library for ASP.NET Core
- **Auto-Generation**: Automatically generates OpenAPI spec from controller attributes
- **Interactive UI**: Swagger UI provides interactive API testing interface
- **Documentation**: XML comments enhance API documentation with descriptions and examples

**Configuration Pattern**:
```csharp
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Contoso University API",
        Version = "v1",
        Description = "REST API for Contoso University student management system"
    });
    
    // Include XML comments for better documentation
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

app.UseSwagger();
app.UseSwaggerUI();
```

**Alternatives Considered**:
- **NSwag**: More features but more complex; Swashbuckle is sufficient for this project
- **Manual OpenAPI YAML**: Too much maintenance overhead; auto-generation is preferred

**References**:
- Microsoft Docs: "Get started with Swashbuckle and ASP.NET Core"

---

## 4. React TypeScript Project Setup

### Decision: Vite with React TypeScript Template

**Chosen Approach**: Use Vite with the official React TypeScript template (`npm create vite@latest -- --template react-ts`).

**Rationale**:
- **Fast Development**: Vite's HMR (Hot Module Replacement) is significantly faster than Webpack-based tools
- **Modern Tooling**: Uses native ES modules, esbuild for bundling
- **Official Support**: React team recommends Vite for new projects
- **Simple Configuration**: Minimal configuration needed for typical SPA
- **TypeScript First**: Excellent TypeScript support out of the box

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

---

## 5. React Router Configuration

### Decision: React Router v6 with BrowserRouter

**Chosen Approach**: Use React Router v6 with `BrowserRouter` and declarative route configuration.

**Rationale**:
- **Latest Version**: v6 provides improved API with hooks like `useNavigate`, `useParams`
- **Type Safety**: Excellent TypeScript support
- **Nested Routes**: Supports complex routing patterns if needed in future
- **Standard**: React Router is the de facto routing library for React SPAs

**Routing Pattern**:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/create" element={<StudentCreatePage />} />
        <Route path="/students/:id" element={<StudentDetailsPage />} />
        <Route path="/students/:id/edit" element={<StudentEditPage />} />
        {/* ... more routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

**Alternatives Considered**:
- **TanStack Router**: Too new, less community support
- **Wouter**: Too minimal for this project's routing needs
- **HashRouter**: Rejected; BrowserRouter provides cleaner URLs

**References**:
- React Router Documentation v6

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

**Implementation Pattern**:
```typescript
// services/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7001/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
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
    apiClient.get<PaginatedResponse<Student>>('/students', {
      params: { pageNumber, pageSize }
    }),
  
  getById: (id: number) =>
    apiClient.get<Student>(`/students/${id}`),
  
  create: (student: CreateStudentDto) =>
    apiClient.post<Student>('/students', student),
  
  update: (id: number, student: UpdateStudentDto) =>
    apiClient.put<Student>(`/students/${id}`, student),
  
  delete: (id: number) =>
    apiClient.delete(`/students/${id}`)
};
```

**Alternatives Considered**:
- **Fetch API**: More verbose, requires manual error handling, no interceptors
- **SWR/React Query**: Over-engineered for this project; adds caching complexity we don't need

**References**:
- Axios Documentation
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

export const NotificationContext = createContext<NotificationContextType>(null!);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);
  
  const showSuccess = (message: string) => {
    setNotification({ type: 'success', message });
  };
  
  const showError = (message: string) => {
    setNotification({ type: 'error', message });
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

**Implementation Pattern**:
```typescript
// hooks/useForm.ts
export function useForm<T>(initialValues: T, validate: (values: T) => Record<string, string>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Real-time validation
    const validationErrors = validate({ ...values, [name]: value });
    setErrors(validationErrors);
  };
  
  const handleBlur = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };
  
  return { values, errors, touched, handleChange, handleBlur };
}

// Usage in component
function StudentForm() {
  const { values, errors, touched, handleChange, handleBlur } = useForm(
    { firstName: '', lastName: '', enrollmentDate: '' },
    validateStudent
  );
  
  return (
    <form>
      <input
        value={values.firstName}
        onChange={e => handleChange('firstName', e.target.value)}
        onBlur={() => handleBlur('firstName')}
      />
      {touched.firstName && errors.firstName && (
        <span className="error">{errors.firstName}</span>
      )}
    </form>
  );
}
```

**Alternatives Considered**:
- **React Hook Form**: Excellent library but adds dependency; custom solution is educational
- **Formik**: More complex API, larger bundle size, not necessary for our form complexity
- **Uncontrolled Components**: Harder to provide real-time validation feedback

**References**:
- React Documentation: "Forms"
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
      rowVersion: student.rowVersion
    });
    // Success - update local state with new rowVersion
    setStudent(response.data);
    showSuccess('Student updated successfully');
  } catch (error) {
    if (error.response?.status === 409) {
      showError('Another user modified this record. Refreshing...');
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

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => onPageChange(1)}>
        First
      </button>
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next
      </button>
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)}>
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

| Area | Technology | Rationale |
|------|------------|-----------|
| **Backend Framework** | ASP.NET Core Web API (.NET 9.0) | Existing project base, modern, cross-platform |
| **Architecture** | Service Layer + EF Core Direct | Balance of separation and simplicity |
| **Error Handling** | Custom Middleware | Centralized, consistent error responses |
| **DTO Mapping** | Manual Mapping | Educational clarity, explicit logic |
| **CORS** | Named Policy with Explicit Origins | Security best practice |
| **API Documentation** | Swashbuckle.AspNetCore | Industry standard OpenAPI generator |
| **Frontend Framework** | React 19+ with TypeScript | Modern, component-based, type-safe |
| **Build Tool** | Vite | Fast development experience |
| **Routing** | React Router v6 | Standard SPA routing library |
| **HTTP Client** | Axios | Interceptors, better error handling |
| **State Management** | Context API + useState | Sufficient for complexity, built-in |
| **Form Handling** | Custom useForm Hook | Educational value, no dependencies |
| **Concurrency** | EF Core RowVersion + ETag | Built-in support, RESTful standard |
| **Pagination** | Offset-Based (pageNumber/pageSize) | Simple, bookmarkable, spec requirement |

---

## Next Steps

With research complete, proceed to Phase 1:
1. ✅ Design DTOs in `data-model.md`
2. ✅ Generate API contracts in `contracts/`
3. ✅ Create quickstart guide in `quickstart.md`
4. ✅ Update agent context with new technologies
