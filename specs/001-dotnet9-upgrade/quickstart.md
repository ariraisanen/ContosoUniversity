# Quickstart: .NET 9 Framework Upgrade

**Feature**: 001-dotnet9-upgrade  
**Time Required**: 30-45 minutes  
**Skill Level**: Intermediate

## Prerequisites

Before starting, ensure you have:

- [x] .NET 9 SDK installed ([Download here](https://dotnet.microsoft.com/download/dotnet/9.0))
- [x] SQL Server container running (Docker or Podman)
- [x] Repository cloned and on branch `001-dotnet9-upgrade`
- [x] Current application working on .NET 6

### Verify Prerequisites

```bash
# Verify .NET 9 SDK is installed
dotnet --list-sdks
# Should show: 9.0.xxx

# Verify SQL Server container is running
docker ps
# or
podman ps
# Should show: sql2022 container running

# Verify current branch
git branch --show-current
# Should show: 001-dotnet9-upgrade
```

## Step 1: Capture Performance Baseline (Optional but Recommended)

**Time**: 5-10 minutes

Start the existing .NET 6 application and measure page load times:

```bash
cd ContosoUniversity
dotnet run
```

Visit these pages and note load times using browser DevTools (Network → DOMContentLoaded):

- Students Index: _______ ms
- Courses Index: _______ ms
- Instructors Index: _______ ms
- Student Details (any student): _______ ms
- Course Edit (any course): _______ ms

**Why**: Success criteria require performance within 10% of baseline.

## Step 2: Update Target Framework

**Time**: 2 minutes

Edit `ContosoUniversity/ContosoUniversity.csproj`:

**Before:**
```xml
<TargetFramework>net6.0</TargetFramework>
```

**After:**
```xml
<TargetFramework>net9.0</TargetFramework>
```

**💡 Tip**: Use GitHub Copilot to assist with this change:
- Open `ContosoUniversity.csproj`
- Select the TargetFramework line
- In Copilot Chat: "Update this to .NET 9"

## Step 3: Update Package References

**Time**: 5 minutes

Update all Microsoft.* packages in `ContosoUniversity/ContosoUniversity.csproj`:

**Before:**
```xml
<ItemGroup>
  <PackageReference Include="Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore" Version="6.0.2" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="6.0.2" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="6.0.2">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
  </PackageReference>
  <PackageReference Include="Microsoft.VisualStudio.Web.CodeGeneration.Design" Version="6.0.2" />
</ItemGroup>
```

**After:**
```xml
<ItemGroup>
  <PackageReference Include="Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore" Version="9.0.0" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="9.0.0" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="9.0.0">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
  </PackageReference>
  <PackageReference Include="Microsoft.VisualStudio.Web.CodeGeneration.Design" Version="9.0.0" />
</ItemGroup>
```

**💡 Tip**: Use GitHub Copilot:
- Select all PackageReference lines
- Copilot Chat: "Update all Microsoft package versions to 9.0.0"

## Step 4: Restore Packages

**Time**: 2-3 minutes

```bash
dotnet restore
```

**Expected Output:**
```
Determining projects to restore...
Restored /path/to/ContosoUniversity/ContosoUniversity.csproj (in X ms).
```

**⚠️ Troubleshooting**: If restore fails:
- Verify .NET 9 SDK is installed: `dotnet --version`
- Clear NuGet cache: `dotnet nuget locals all --clear`
- Try restore again

## Step 5: Build the Application

**Time**: 2-3 minutes

```bash
dotnet build
```

**Expected Output:**
```
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

**⚠️ Troubleshooting**: If build fails with errors:

### Common Error 1: Implicit Usings
```
Error CS0246: The type or namespace name 'X' could not be found
```

**Solution**: .NET 9 may have different implicit usings. Add explicit using statements:
```csharp
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
```

### Common Error 2: Nullable Reference Types
```
Warning CS8618: Non-nullable property 'X' must contain a non-null value
```

**Solution**: This is a warning, not an error. Can be ignored or:
```xml
<Nullable>enable</Nullable>
```
Then add null-forgiving operators or nullable annotations as needed.

### Common Error 3: Obsolete APIs
```
Warning CS0618: 'X' is obsolete
```

**Solution**: Check migration guide for replacement API. Use GitHub Copilot:
- Right-click on obsolete member
- "Explain this problem"
- "Suggest a fix"

## Step 6: Update Database Migrations Snapshot

**Time**: 2 minutes

```bash
dotnet ef migrations list
```

**Expected Output:**
```
20220226005057_InitialCreate
20220226012101_RowVersion
```

The migrations should list successfully. EF Core 9 will automatically update the snapshot metadata.

**⚠️ Note**: No new migration is needed. The existing migrations are compatible.

## Step 7: Test Database Connectivity

**Time**: 3 minutes

Drop and recreate the database to ensure clean slate:

```bash
dotnet ef database drop --force
dotnet ef database update
```

**Expected Output:**
```
Dropping database 'ContosoUniversity'...
Done.
Building...
Build succeeded.
Applying migration '20220226005057_InitialCreate'.
Applying migration '20220226012101_RowVersion'.
Done.
```

**⚠️ Troubleshooting**: If database connection fails:
- Verify container is running: `docker ps` or `podman ps`
- Verify connection string in `appsettings.json`
- Check container logs: `docker logs sql2022` or `podman logs sql2022`

## Step 8: Run the Application

**Time**: 2 minutes

```bash
dotnet run
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7054
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5054
info: Microsoft.Hosting.Lifetime[0]
      Application started.
```

Navigate to `https://localhost:7054` (or the port shown in output).

**⚠️ Troubleshooting**: If application fails to start:
- Check for port conflicts: Close other applications on ports 5054/7054
- Check for unhandled exceptions in console output
- Verify database is accessible

## Step 9: Functional Testing

**Time**: 10-15 minutes

Test all major functionality:

### Students
- [ ] Navigate to Students
- [ ] View student list
- [ ] Click "Create New" and add a student
- [ ] Click "Details" on a student
- [ ] Click "Edit" and modify a student
- [ ] Click "Delete" and remove a student

### Courses
- [ ] Navigate to Courses
- [ ] View course list
- [ ] Create a new course
- [ ] View course details
- [ ] Edit a course
- [ ] Delete a course

### Instructors
- [ ] Navigate to Instructors
- [ ] View instructor list with courses and enrollments
- [ ] Create a new instructor
- [ ] Edit an instructor
- [ ] Delete an instructor

### Departments
- [ ] Navigate to Departments
- [ ] View department list
- [ ] Create a new department
- [ ] Edit a department (test concurrency token)
- [ ] Delete a department

### Other
- [ ] Navigate to About page (verify statistics display)
- [ ] Test search/filter functionality
- [ ] Test pagination (if enough data)

## Step 10: Performance Verification (Optional)

**Time**: 5-10 minutes

Measure page load times again using browser DevTools:

- Students Index: _______ ms (Baseline: _______ ms, Change: ___%)
- Courses Index: _______ ms (Baseline: _______ ms, Change: ___%)
- Instructors Index: _______ ms (Baseline: _______ ms, Change: ___%)
- Student Details: _______ ms (Baseline: _______ ms, Change: ___%)
- Course Edit: _______ ms (Baseline: _______ ms, Change: ___%)

**Success Criteria**: All changes should be within ±10% of baseline.

## Step 11: Cross-Platform Testing

**Time**: 15-20 minutes (if you have access to both platforms)

### On macOS

Test with both Podman and Docker:

```bash
# Test with Podman
podman stop sql2022 && podman rm sql2022
./run-sqlserver.sh
cd ContosoUniversity
dotnet ef database update
dotnet run
# Verify application works

# Test with Docker
podman stop sql2022 && podman rm sql2022
docker run --platform linux/amd64 -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd123" -p 1433:1433 --name sql2022 -d mcr.microsoft.com/mssql/server:2022-latest
dotnet ef database update
dotnet run
# Verify application works
```

### On Windows

Test with Docker:

```powershell
# Stop existing container
docker stop sql2022
docker rm sql2022

# Start new container
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd123" -p 1433:1433 --name sql2022 -d mcr.microsoft.com/mssql/server:2022-latest

# Test application
cd ContosoUniversity
dotnet ef database update
dotnet run
# Verify application works
```

## Step 12: Commit Changes

**Time**: 2 minutes

```bash
git add ContosoUniversity/ContosoUniversity.csproj
git commit -m "feat: upgrade to .NET 9.0

- Updated TargetFramework from net6.0 to net9.0
- Updated all Microsoft.* packages to version 9.0.0
- Verified all existing functionality works
- Tested on [macOS/Windows] with [Docker/Podman]

Follows spec: specs/001-dotnet9-upgrade/spec.md"
```

## Success Checklist

Before considering the upgrade complete, verify:

- [x] Application builds without errors
- [x] Application runs without exceptions
- [x] All CRUD operations work for all entities
- [x] Database migrations apply successfully
- [x] All pages load correctly
- [x] Navigation works
- [x] Search and pagination work
- [x] Performance is within acceptable range
- [x] Cross-platform compatibility verified (if applicable)
- [x] Changes committed to git

## Next Steps

With the .NET 9 upgrade complete, you can:

1. **Proceed to Lab 2**: UI Modernization with React
2. **Add Testing**: Create a test project with xUnit (separate feature)
3. **Explore .NET 9 Features**: Investigate new APIs and performance improvements
4. **Review**: Compare the upgrade process with the spec-driven approach

## Troubleshooting Resources

- [.NET 9 Release Notes](https://github.com/dotnet/core/tree/main/release-notes/9.0)
- [ASP.NET Core 9.0 Migration Guide](https://docs.microsoft.com/aspnet/core/migration/80-90)
- [EF Core 9.0 What's New](https://docs.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew)
- [Breaking Changes in .NET 9](https://docs.microsoft.com/dotnet/core/compatibility/9.0)

## Workshop Notes

**Learning Objectives Met:**
- ✅ Understood spec-driven development workflow
- ✅ Used GitHub Copilot for framework upgrade tasks
- ✅ Practiced incremental modernization
- ✅ Verified backward compatibility
- ✅ Maintained cross-platform support

**Time Saved with Copilot:**
Estimate time saved by using GitHub Copilot for:
- Package version updates: ~5 minutes
- Breaking changes resolution: ~10-20 minutes
- Documentation: ~15 minutes

**Discussion Points:**
- How does spec-driven approach compare to ad-hoc upgrades?
- What role did GitHub Copilot play in accelerating the work?
- How would this approach scale to larger applications?
- What would be different without automated testing?

---

**Congratulations!** 🎉 You've successfully upgraded Contoso University to .NET 9 using a spec-driven approach with GitHub Copilot assistance.
