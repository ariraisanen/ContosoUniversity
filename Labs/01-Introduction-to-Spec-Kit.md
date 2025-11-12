# Lab 1: Introduction to Spec-Kit - Upgrading .NET Version

## Overview

In this lab, you'll learn how to use GitHub's Spec-Kit to plan and execute a modernization task: upgrading the Contoso University application from .NET 6.0 to the latest .NET version. This introduces you to Spec-Driven Development, where you define specifications first, then let AI tools help with implementation.

## Learning Objectives

- Understand the Spec-Kit workflow and principles
- Learn how to create effective specifications for modernization tasks
- Use GitHub Copilot with Spec-Kit for systematic code updates
- Practice validation and testing after major framework upgrades

## Prerequisites

- Completed the main setup from README.md
- [GitHub Copilot](https://github.com/features/copilot) enabled in your IDE (VS Code, Visual Studio, or JetBrains)
- Familiarity with .NET development

## Important Note

This lab uses **GitHub Copilot** as your AI coding assistant. Make sure you have:

- GitHub Copilot subscription activated
- Copilot extension installed in your editor
- Copilot enabled and signed in

## Duration

Approximately 60-90 minutes

---

## Part 1: Setting Up Spec-Kit

### Step 1: Install Spec-Kit

```bash
# Install the Spec-Kit CLI
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Verify installation
specify --version

# If that does not run, try the following command and restart your terminal
uv tool update-shell
```

### Step 2: Initialize Spec-Kit in Your Project

```bash
# From the repository root, use copilot with pwsh scripts, no need to init git as we already are in a repo
specify init . --ai copilot --script ps --no-git
```

This creates the `.specify/` directory with the following:

- `memory/constitution.md` for project rules and principles
- Context files for AI assistance (can be used with GitHub Copilot)
- Helper scripts in `scripts/powershell/`

The `specs` created by spec-kit will live in the repository root under the `specs` folder.

**Note:** The methodology and structure are AI-agnostic.

### Step 3: Review and update the Constitution

Open `memory/constitution.md` and familiarize yourself with the project's guiding principles. This file helps maintain consistency across all AI-assisted development.

In your Copilot Chat, ask it to review and update the Constitution, using the `/speckit.constitution` command.

```bash
/speckit.constitution Create the project constitution based on the ContosoUniversity Folder
```

---

## Part 2: Creating a Specification for .NET Upgrade

### Step 1: Use the speckit.specify command to create a new branch and the spec

We want to be able to upgrade the Contoso University application from .NET 6 to .NET 9. Spec-kit can help us create a specification for this task.
Focus on What and Why, not the technical details.

```bash
/speckit.specify Upgrade Contoso University to .NET 9
```

This will create the specs folder and a new branch with prefix `001-` and some reasonable name. Spec-kit will then also create checklists and the description of the spec inside that folder.

Review the generated spec at `specs/001-***/spec.md` to understand what it looks like

### Step 2: Use Spec-Kit to Plan

Now that our spec is created, we can use spec-kit to create a technical implementation plan. Here is where you would often specify your technical considerations, like library selections and architectural decisions.

**Note:** This is often more related for real greenfield projects where we have no existing codebase. In this case, as the codebase already exists, the plan step is less critical, but still useful to see how spec-kit can help.

**Note:** Here is also a good place to clarify any unspecified areas with the `/speckit.clarify` command if needed. In this case, we can proceed directly to planning.

Run the planning command:

```bash
/speckit.plan

# You can also write additional context after the command if needed. For example:
/speckit.plan Create a detailed plan to upgrade Contoso University from .NET 6 to .NET 9, including research on breaking changes, package updates, and testing strategy.
```

Review the generated plan at `specs/001-***/plan.md`.
Review the generated research at `specs/001-***/research.md`.
Review the generated data model at `specs/001-***/data-model.md`.

## Part 3: Implementation with AI Assistance

### Step 1: Generate Implementation Task List

Use the `/speckit.tasks` command to break down the upgrade into tasks:

```bash
/speckit.tasks
```

This creates `specs/001-upgrade-dotnet/tasks.md` with ordered tasks. You can review and adjust the tasks as needed.

After this has finished, you can run an analysis step to cross-check consistency and coverage of the artifacts and tasks created so far:

```bash
/speckit.analyze
```

### Step 2: Execute the Upgrade

In GitHub Copilot Chat, use the `/speckit.implement` command

```bash
/speckit.implement
```

### Step 3: Verify the Changes

GitHub Copilot should have updated the `.csproj` file with:

- `<TargetFramework>net9.0</TargetFramework>`
- Updated package versions (9.0.x)

### Step 4: Build and Test

```bash
cd ContosoUniversity

# Restore packages
dotnet restore

# Build the project
dotnet build

# Run the application
dotnet run
```

### Step 5: Test Database Operations

1. Navigate to Students page - verify listing works
2. Create a new student - verify creation
3. Edit a student - verify update
4. Delete a student - verify deletion
5. Repeat for Courses, Instructors, and Departments

---

## Part 4: Validation and Documentation

### Step 1: Validate Against Success Criteria

Review your spec's success criteria and verify each one:

- [ ] Application builds successfully with .NET 8 SDK
- [ ] All migrations run without errors
- [ ] All CRUD operations work
- [ ] No breaking changes in existing functionality
- [ ] Application runs on both platforms

### Step 2: (Optional) Update Documentation

You can either manually or use Copilot to update any relevant documentation, such as README.md, to reflect the upgrade to .NET 9.
This is something you can also think of to include in your spec or constitution for future upgrades.

### Step 3: Create a Pull Request

The implement step should have already committed the results. If not, you can do it manually:

```bash
git add .
git commit -m "Upgrade to .NET 9

- Updated target framework to net9.0
- Upgraded all NuGet packages to .NET 9 versions
- Verified all functionality works
- Updated documentation

Follows spec: specs/001-upgrade-dotnet/spec.md"
```

Then in your forked github repository, create a pull request to merge your feature branch into main / master branch.
You can also ask Copilot to do this locally, basically asking it to merge the branch into main.

```bash
# In copilot chat, you can write:
Please merge the current branch into main branch.
```

---

## Key Takeaways

1. **Spec-First Approach**: Writing specifications before coding ensures clarity and alignment
2. **AI as Assistant**: GitHub Copilot can execute well-defined specs systematically
3. **Documentation**: Specs serve as living documentation of decisions and changes
4. **Validation**: Success criteria ensure nothing is missed during implementation

## Challenge Extensions

1. **Performance Comparison**: Measure application startup time before and after upgrade
2. **Feature Exploration**: Research one new .NET 8 feature and add it to the application
3. **Migration Path**: Create a spec for upgrading from .NET 8 to .NET 9 (practice the process)

## Next Steps

Proceed to **Lab 2: UI Modernization** to learn how to use Spec-Kit for larger architectural changes, or explore the optional labs for additional features.

## Resources

- [.NET 8 Release Notes](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-8)
- [EF Core 8 Breaking Changes](https://learn.microsoft.com/ef/core/what-is-new/ef-core-8.0/breaking-changes)
- [Spec-Kit Documentation](https://github.com/github/spec-kit)
