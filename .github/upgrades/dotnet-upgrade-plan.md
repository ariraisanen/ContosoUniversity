# .NET 9.0 Upgrade Plan

## Execution Steps

Execute steps below sequentially one by one in the order they are listed.

1. Validate that an .NET 9.0 SDK required for this upgrade is installed on the machine and if not, help to get it installed.
2. Ensure that the SDK version specified in global.json files is compatible with the .NET 9.0 upgrade.
3. Upgrade ContosoUniversity\ContosoUniversity.csproj

## Settings

This section contains settings and data used by execution steps.

### Excluded projects

| Project name | Description |
|:-----------------------------------------------|:---------------------------:|

### Aggregate NuGet packages modifications across all projects

NuGet packages used across all selected projects or their dependencies that need version update in projects that reference them.

| Package Name                                 | Current Version | New Version | Description                                   |
|:---------------------------------------------|:---------------:|:-----------:|:----------------------------------------------|
| Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore |   6.0.2         |  9.0.11     | Recommended for .NET 9.0                      |
| Microsoft.EntityFrameworkCore.SqlServer       |   6.0.2         |  9.0.11     | Recommended for .NET 9.0                      |
| Microsoft.EntityFrameworkCore.Tools           |   6.0.2         |  9.0.11     | Recommended for .NET 9.0                      |
| Microsoft.VisualStudio.Web.CodeGeneration.Design |   6.0.2         |  9.0.0      | Recommended for .NET 9.0                      |

### Project upgrade details

#### ContosoUniversity\\ContosoUniversity.csproj modifications

Project properties changes:
  - Target framework should be changed from `net6.0` to `net9.0`

NuGet packages changes:
  - Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore should be updated from `6.0.2` to `9.0.11` (*recommended for .NET 9.0*)
  - Microsoft.EntityFrameworkCore.SqlServer should be updated from `6.0.2` to `9.0.11` (*recommended for .NET 9.0*)
  - Microsoft.EntityFrameworkCore.Tools should be updated from `6.0.2` to `9.0.11` (*recommended for .NET 9.0*)
  - Microsoft.VisualStudio.Web.CodeGeneration.Design should be updated from `6.0.2` to `9.0.0` (*recommended for .NET 9.0*)

Other changes:
  - None specified
