# Lab 9: Personalized Semester View (Optional)

## Overview

Create a personalized semester view that shows students their enrolled courses in an intuitive, visual format. This dashboard includes upcoming assignments, grade tracking, and schedule visualization - building a complete student portal experience.

## Learning Objectives

- Build user-specific dashboards with Spec-Kit
- Implement data aggregation and visualization
- Create responsive calendar/schedule views
- Use GitHub Copilot for UI-heavy features
- Apply modern dashboard design patterns

## Prerequisites

- Completed Lab 1 (basic setup)
- GitHub Copilot enabled in your IDE
- Completed Lab 8 (or at least have enrollments working)
- Completed Lab 5 (recommended for UI components)

## Duration

Approximately 90-120 minutes

---

## Part 1: Planning with Spec-Kit

### Step 1: Create Feature Branch

```bash
git checkout main
git pull
git checkout -b feature/semester-view
```

### Step 2: Create Dashboard Specification

Ask GitHub Copilot Chat:

```
Help me create a specification for a personalized student semester dashboard.
Save it as specs/009-semester-view/spec.md.

Include:

1. **User Stories**:
   - As a student, I want to see all my courses for the current semester at a glance
   - As a student, I want a visual weekly schedule
   - As a student, I want to see my current grades and GPA
   - As a student, I want quick access to course materials
   - As a student, I want to see upcoming deadlines (if assignments exist)

2. **Dashboard Components**:
   - Header with student info and semester selector
   - Visual weekly schedule (calendar grid)
   - Course cards showing: title, instructor, time, room, current grade
   - GPA calculator (current and projected)
   - Quick actions (add/drop, email instructor, etc.)
   - Academic progress tracker

3. **Data Requirements**:
   - Student enrollments for selected semester
   - Course details (from Lab 7 if completed)
   - Grade information
   - Calculated statistics (total credits, GPA)

4. **UI/UX Requirements**:
   - Mobile-first, responsive design
   - Print-friendly schedule view
   - Dark mode support (optional)
   - Fast loading with skeleton loaders
   - Accessible (keyboard navigation, screen readers)

5. **Success Criteria**

Follow spec-kit methodology.
```

### Step 3: Design Research

```
Research modern student dashboard designs and patterns:

1. Review dashboards from: Canvas, Blackboard, Google Classroom
2. Identify best UX patterns for:
   - Schedule visualization
   - Grade display
   - Course navigation
3. Find accessible calendar component libraries
4. Research dashboard performance optimization techniques

Document findings and mockups in specs/009-semester-view/research.md
```

---

## Part 2: Data Layer

### Step 1: View Models / DTOs

Ask GitHub Copilot:

```
Create view models/DTOs for the semester dashboard:

1. StudentDashboardViewModel:
   - Student info (name, ID, classification)
   - Semester info
   - List of enrolled courses with details
   - Calculated statistics (total credits, GPA)
   - Weekly schedule data

2. CourseCardViewModel:
   - Course title and code
   - Instructor name and email
   - Meeting times and location
   - Current grade (letter and percentage)
   - Credits

3. WeeklyScheduleViewModel:
   - Data structure for calendar rendering
   - Time slots with course info

Show me the complete model classes with appropriate properties.
```

### Step 2: Dashboard Service

```
Create a StudentDashboardService class with methods:

1. Task<StudentDashboardViewModel> GetDashboardAsync(int studentId, int? semesterId = null)
   - Loads all dashboard data efficiently
   - Defaults to current semester if not specified
   - Includes calculated fields (GPA, credit hours)

2. Task<WeeklyScheduleViewModel> GetWeeklyScheduleAsync(int studentId, int semesterId)
   - Returns structured schedule data
   - Optimized for calendar rendering

3. Task<List<Semester>> GetSemestersForStudentAsync(int studentId)
   - Returns semesters where student has enrollments

Use efficient database queries with appropriate Includes.
Show me the service implementation.
```

---

## Part 3: API Endpoints (If Lab 2 Completed)

### Create Dashboard API

```
Help me create REST API endpoints for the student dashboard:

GET /api/dashboard/student/{studentId}?semester={semesterId}
    - Returns complete dashboard data
    - Defaults to current semester

GET /api/dashboard/student/{studentId}/schedule?semester={semesterId}
    - Returns weekly schedule data

GET /api/dashboard/student/{studentId}/semesters
    - Returns list of available semesters

GET /api/dashboard/student/{studentId}/gpa
    - Returns GPA statistics (current, cumulative, projected)

Include:
- Proper DTOs
- Response caching for performance
- Error handling
- Swagger documentation

Show me the controller implementation.
```

---

## Part 4: Frontend Implementation

### Option A: Razor Pages Implementation

Ask GitHub Copilot:

```
Create a Razor Page for the student semester dashboard.
File: Pages/Students/Dashboard.cshtml and Dashboard.cshtml.cs

The page should have:

1. **Header Section**:
   - Welcome message with student name
   - Semester selector dropdown
   - Print schedule button

2. **Statistics Cards** (grid layout):
   - Total enrolled courses
   - Total credit hours
   - Current GPA
   - Credit hours to graduation (if trackable)

3. **Weekly Schedule Grid**:
   - Monday-Friday columns
   - Time rows (8 AM - 6 PM)
   - Course blocks with color coding
   - Click course for details

4. **Course Cards Section**:
   - Card for each enrolled course
   - Shows: title, instructor, time, room, grade
   - Quick actions (email instructor, view details)

5. **Mobile Responsive**:
   - Stack elements vertically on mobile
   - Simplify schedule to list view

Use modern UI from Lab 5 if completed (shadcn/ui styling or Tailwind).
Show me the page model and view implementation.
```

### Option B: React Implementation

```
Create React components for the student dashboard:

1. StudentDashboard (main container)
2. DashboardHeader (student info, semester selector)
3. StatisticsCards (enrollment stats, GPA)
4. WeeklySchedule (calendar grid)
5. CourseCard (individual course display)
6. SemesterSelector (dropdown with term selection)

Use:
- React Query for data fetching
- shadcn/ui components if Lab 5 completed
- Responsive design
- Loading skeletons

Show me the component structure and key implementations.
```

### Step 2: Schedule Calendar Component

```
Help me create a visual weekly schedule calendar component:

**Requirements**:
- Grid layout: Days (columns) × Times (rows)
- Display course blocks in appropriate time slots
- Color-code by department or manually
- Tooltip showing full course details on hover
- Handle courses that meet multiple days (e.g., MWF)
- Handle courses with overlapping times
- Responsive: switch to list view on mobile

**Suggested approach**:
- CSS Grid for layout
- Absolute positioning for course blocks
- Calculate block height based on duration

Show me the implementation (React component or Razor partial view).
```

---

## Part 5: Features Implementation

### Feature 1: GPA Calculator

Ask GitHub Copilot:

```
Implement a GPA calculator that shows:

1. Current semester GPA (from enrolled courses with grades)
2. Cumulative GPA (all past semesters)
3. Projected GPA (if hypothetical grades entered)

Create:
- GpaCalculatorService class with calculation logic
- UI component showing GPA with visual indicator (progress bar, gauge)
- "What-if" calculator (change grades to see impact)

Grade scale: A=4.0, B=3.0, C=2.0, D=1.0, F=0.0
Show me the implementation.
```

### Feature 2: Print-Friendly Schedule

```
Create a print-friendly version of the schedule:

1. Add a "Print Schedule" button
2. CSS print media query to:
   - Remove navigation and unnecessary elements
   - Optimize layout for 8.5x11" paper
   - Ensure schedule grid fits on one page
   - Add student name and semester header

Show me the CSS and any required JavaScript.
```

### Feature 3: Semester Comparison

```
Add ability to compare schedules across semesters:

- Side-by-side view of two semesters
- Highlight changes (dropped courses, new courses)
- Compare credit hours and course load
- Visual diff of schedules

Show me the implementation approach.
```

---

## Part 6: Data Visualization (Optional)

### Add Charts and Graphs

```
Help me add data visualizations to the dashboard using a charting library.

Suggested library:
- React: recharts, Chart.js, or visx
- Razor Pages: Chart.js (vanilla JS)

Visualizations to add:

1. **Grade Distribution**:
   - Bar chart showing count of A's, B's, C's, etc.

2. **GPA Trend**:
   - Line chart showing GPA across semesters

3. **Credit Hours Over Time**:
   - Bar chart showing credits per semester

4. **Department Distribution**:
   - Pie chart showing courses by department

Show me how to integrate and implement these charts.
```

---

## Part 7: Performance Optimization

### Optimize Dashboard Loading

Ask GitHub Copilot:

```
The dashboard loads a lot of data. Help me optimize:

1. **Database Queries**:
   - Use efficient EF Core includes
   - Add appropriate indexes
   - Consider compiled queries

2. **Caching**:
   - Cache dashboard data (changes infrequently)
   - Cache for 5 minutes with invalidation on enrollment changes

3. **Lazy Loading**:
   - Load schedule separately from course cards
   - Lazy load detailed course info

4. **Frontend**:
   - Use skeleton loaders during fetch
   - Implement infinite scroll for course history
   - Code splitting for charts

Show me the implementation for each optimization.
```

---

## Part 8: Mobile Experience

### Responsive Design

```
Ensure excellent mobile experience:

1. **Mobile Schedule View**:
   - Switch from grid to list/agenda view
   - Group by day
   - Expand/collapse each day

2. **Touch Interactions**:
   - Swipe between semesters
   - Pull to refresh
   - Touch-friendly hit targets

3. **Progressive Web App** (optional):
   - Add manifest.json
   - Service worker for offline access
   - Add to home screen

Help me implement responsive breakpoints and mobile-specific features.
```

---

## Part 9: Accessibility

### Ensure WCAG Compliance

```
Help me ensure the dashboard is fully accessible:

1. **Keyboard Navigation**:
   - Tab through all interactive elements
   - Arrow keys for calendar navigation
   - Escape to close modals/tooltips

2. **Screen Readers**:
   - Proper ARIA labels
   - Announce dynamic content changes
   - Table semantics for schedule grid

3. **Visual Accessibility**:
   - High contrast mode support
   - Color not sole indicator
   - Sufficient font sizes
   - Focus indicators

Audit the dashboard and fix issues. Show me the improvements.
```

---

## Part 10: Testing

### Create Test Plan

```
Help me create a comprehensive test plan (specs/009-semester-view/test-plan.md):

**Functional Tests**:
1. Dashboard loads with current semester
2. Switch between semesters
3. Weekly schedule displays correctly
4. Course cards show accurate information
5. GPA calculates correctly

**UI Tests**:
6. Mobile layout switches appropriately
7. Print view renders correctly
8. Charts display when data available
9. Loading states show properly

**Performance Tests**:
10. Dashboard loads in < 2 seconds
11. Semester switch is < 500ms
12. No jankiness in animations

**Accessibility Tests**:
13. Keyboard navigation works
14. Screen reader announces content
15. Passes WAVE or axe DevTools audit

Include test data setup and expected results.
```

### Manual Testing

```bash
dotnet run
```

Test the complete dashboard:
1. Navigate to student dashboard
2. Verify current semester displays
3. Check all enrolled courses shown
4. Verify schedule grid accuracy
5. Check GPA calculation
6. Switch to past semester
7. Test on mobile device/viewport
8. Test print function
9. Verify accessibility with keyboard only

---

## Key Takeaways

1. **User-Centric Design**: Dashboards must be intuitive and information-dense
2. **Performance Matters**: Optimize queries and use caching for data-heavy views
3. **Mobile First**: Schedule views must work on all devices
4. **Visualization**: Charts make data more understandable
5. **Accessibility**: Critical for educational software

## Challenge Extensions

1. **Course Materials Integration**: Link to syllabi, assignments, announcements
2. **Calendar Export**: iCal/Google Calendar integration
3. **Study Groups**: Show classmates and form study groups
4. **Advisor View**: Dashboard for advisors to see advisee schedules
5. **Degree Progress**: Visual degree audit showing requirements
6. **AI Recommendations**: Suggest courses for next semester based on history
7. **Social Features**: See anonymous classmate grade distributions

## Troubleshooting

### Schedule Grid Not Displaying

```
Ask GitHub Copilot:
"My weekly schedule grid isn't displaying courses correctly. 
The time slots are off and courses aren't showing in the right positions.
Help me debug the layout calculation."
```

### Performance Issues with Multiple Semesters

```
"Loading a student's dashboard is slow when they have many past semesters.
Help me implement pagination or lazy loading for historical data."
```

### Mobile Schedule Cramped

```
"The schedule grid is unusable on mobile devices. Help me create an 
alternative mobile-friendly view that shows the same information."
```

## Resources

- [Full Calendar](https://fullcalendar.io/) - Popular calendar library
- [React Big Calendar](https://github.com/jquense/react-big-calendar) - React calendar component
- [Recharts](https://recharts.org/) - React charting library
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility standards
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/) - For schedule layouts

---

## Congratulations!

You've completed all the Contoso University labs! You've learned how to:

- Use GitHub Spec-Kit for spec-driven development
- Leverage GitHub Copilot for rapid feature implementation
- Modernize applications with current best practices
- Build complex, user-facing features systematically
- Work with multiple branches using git worktrees

**Next Steps:**
- Apply these techniques to your own projects
- Explore the GitHub Spec-Kit repository for more patterns
- Share your learnings with your team
- Continue experimenting with AI-assisted development

Thank you for participating in the Migrate and Modernize MicroHack! 🚀

