# Lab 3: Git Worktrees - Parallel Development with Spec-Kit

## Overview

Learn how to use Git worktrees combined with Spec-Kit to work on multiple feature variations simultaneously. This lab demonstrates a powerful workflow for comparing different implementation approaches, experimenting with UI variations, and working on features in parallel without losing context.

## Learning Objectives

- Understand Git worktrees for parallel development
- Use worktrees with Spec-Kit workflow for comparing implementations
- Run multiple VS Code instances with different branches
- Compare and evaluate different technical approaches side-by-side
- Clean up and merge selected implementations

## Prerequisites

- Git 2.5+ (worktrees feature)
- Completed Labs 1-2 (spec-kit basics and React if following that path)
- GitHub Copilot enabled in your IDE
- VS Code (or your preferred IDE that supports multiple windows)

## Duration

Approximately 60-90 minutes

---

## Part 1: Understanding the Worktree + Spec-Kit Workflow

### What Are Git Worktrees?

Git worktrees allow multiple working directories for the same repository, each on a different branch. Instead of switching branches and losing context, you can:

- Work on multiple feature branches simultaneously
- Compare implementations side-by-side
- Run different versions of the application at the same time
- Keep each feature's context intact (open files, terminal state, etc.)

### Combining with Spec-Kit

The power multiplies when you combine worktrees with Spec-Kit:

1. Create a spec for a feature
2. After planning, create multiple worktrees for different approaches
3. Implement each approach in parallel using `/speckit.implement`
4. Run and compare them side-by-side
5. Merge the best implementation

---

## Part 2: Create the Base Specification

### Context

Assuming you've completed Lab 2 and have React with Tailwind CSS and shadcn/ui set up, you now want to enhance the Students list page with better filtering and interactions. Instead of committing to one approach, you'll explore multiple design variations in parallel.

### Step 1: Create the Feature Spec

Start by creating a specification for the core feature (without mentioning multiple variations):

```bash
# In your main worktree
/speckit.specify Enhance the Students list page with improved filtering and user interactions. Add a search bar with real-time filtering, sortable columns, action buttons for edit/delete, and pagination. Use Tailwind CSS and shadcn/ui components for a modern, accessible interface.
```

This creates the initial spec in `specs/003-**/spec.md` and a new branch `003-**`.

### Step 2: Complete Planning and Tasks

Generate the implementation plan and tasks:

```bash
/speckit.plan Create a detailed implementation plan for the Students page enhancements including: search/filter UI, sorting functionality, action button placement, pagination controls, responsive layout, and accessibility features.

/speckit.tasks
```

Review the generated `specs/003-**/plan.md` and `specs/003-**/tasks.md`. At this point, you have a complete specification for the feature.

**Important**: Don't implement yet! We'll branch to explore different UI approaches.

---

## Part 3: Branch into Multiple Worktrees

### Step 1: Create Worktrees from the Spec Branch

Now that you have a complete spec, create multiple worktrees to explore different UI variations. Each worktree will branch from your `003-**` branch:

```bash
# Note the name of your spec branch (e.g., 003-enhance-students-list)
# Replace 003-enhance-students-list below with your actual branch name

# View current worktrees
git worktree list

# Create worktree for Variation A (traditional table layout)
git worktree add ../ContosoUniversity-003-variant-a -b 003-variant-a-table 003-enhance-students-list

# Create worktree for Variation B (card grid layout)
git worktree add ../ContosoUniversity-003-variant-b -b 003-variant-b-cards 003-enhance-students-list

# Create worktree for Variation C (compact with sidebar)
git worktree add ../ContosoUniversity-003-variant-c -b 003-variant-c-sidebar 003-enhance-students-list

# Verify all worktrees
git worktree list
```

You should now see:

```
/path/to/ContosoUniversity                [003-enhance-students-list] (your spec branch)
/path/to/ContosoUniversity-003-variant-a  [003-variant-a-table]
/path/to/ContosoUniversity-003-variant-b  [003-variant-b-cards]
/path/to/ContosoUniversity-003-variant-c  [003-variant-c-sidebar]
```

**Key Point**: Each worktree now has a copy of the specs directory and the same base code. They're isolated environments for different implementations.

---

## Part 4: Modify Specs and Implement in Parallel

### Step 1: Open VS Code for Each Worktree

Open a separate VS Code window for each worktree:

```bash
# From your main terminal
code ../ContosoUniversity-003-variant-a
code ../ContosoUniversity-003-variant-b
code ../ContosoUniversity-003-variant-c
```

You now have **three VS Code windows** open, each on a different branch!

### Step 2: Clarify the Approach in Each Worktree

In each VS Code window, ask Copilot to modify the plan for that specific variation. **Copilot doesn't know about the other variants** - each worktree has its own isolated context.

**Variant A window** (Traditional Table Layout):

```bash
# In the copilot chat, you can write:
For the UI layout, use a traditional table approach: shadcn/ui Table component for the data, search bar at the top with shadcn/ui Input, action buttons using shadcn/ui Button with icons (Edit/Delete) in the rightmost column, column headers with sort indicators, and standard pagination controls at the bottom. Update the tasks in tasks.md accordingly, plan, data model etc. accordingly.
```

**Variant B window** (Card Grid Layout):

```bash
# In the copilot chat, you can write:
For the UI layout, use a card-based grid approach: shadcn/ui Card components in a responsive grid (3 columns on desktop, 2 on tablet, 1 on mobile), each card displaying student information. Include inline filter controls using shadcn/ui Select and Input at the top, rounded pill-style action buttons within each card, and load-more button at bottom. Update the tasks in tasks.md accordingly, plan, data model etc. accordingly.
```

**Variant C window** (Compact Sidebar Layout):

```bash
# In the copilot chat, you can write:
For the UI layout, use a compact sidebar approach: compact table with condensed spacing, shadcn/ui Sheet component as a fixed sidebar containing all filter controls, icon-only action buttons with shadcn/ui Tooltip for accessibility, sticky table header that remains visible on scroll, and minimal visual chrome for information density. Update the tasks in tasks.md accordingly, plan, data model etc. accordingly.
```

### Step 3: Implement Each Variation

Now in each VS Code window, implement the feature with that variation's approach:

In each VS Code window, start implementation:

```bash
/speckit.implement
```

GitHub Copilot will implement according to each branch's modified plan. You can:

- **Switch between windows** to see progress on different variations
- **Guide each implementation** with specific feedback on layout/styling
- **Test each variant** as it develops

---

## Part 5: Run and Compare Side-by-Side

### Step 1: Run Each Variation on Different Ports

You can run all three UI variations simultaneously:

**Terminal in Variant A worktree**:

```bash
cd contoso-university-ui
PORT=3001 npm start
```

**Terminal in Variant B worktree**:

```bash
cd contoso-university-ui
PORT=3002 npm start
```

**Terminal in Variant C worktree**:

```bash
cd contoso-university-ui
PORT=3003 npm start
```

### Step 2: Open All in Browser Tabs

Open three browser tabs:

- `http://localhost:3001` - Table layout with advanced filters
- `http://localhost:3002` - Card grid layout
- `http://localhost:3003` - List with sidebar filters

**Compare them side-by-side!**

### Step 3: Evaluate Against Criteria

Create an evaluation document in your main worktree:

```bash
# In main worktree
/speckit.clarify Create an evaluation matrix comparing the three UI layout approaches based on: user experience, information density, mobile responsiveness, development complexity, and how well they meet the requirements for filtering/sorting/searching students. Use insights from all three implementations.
```

---

## Part 6: Selecting and Merging the Winner

### Step 1: Make Your Decision

Based on your evaluation and user feedback, choose the best approach. Let's say **the card grid layout (Variant B)** wins.

### Step 2: Merge the Selected Implementation

From the main worktree:

```bash
cd /path/to/ContosoUniversity  # Main worktree

# Merge the selected branch
git merge 003-variant-b-cards

# Push to remote
git push origin main
```

### Step 3: Clean Up Unneeded Worktrees

Remove worktrees you're not using:

```bash
# Remove Variant A worktree
git worktree remove ../ContosoUniversity-variant-a
git branch -D 003-variant-a-table

# Remove Variant C worktree
git worktree remove ../ContosoUniversity-variant-c
git branch -D 003-variant-c-sidebar

# Optionally remove Variant B worktree (branch is already merged)
git worktree remove ../ContosoUniversity-variant-b
```

Verify cleanup:

```bash
git worktree list
git branch -a
```

---

## Part 7: Advanced Workflow - Iterating on the Winner

### Scenario: Refining the Selected Variation

You can use worktrees to try refinements of your chosen design:

```bash
# Create worktrees for Card Grid refinements
git worktree add ../ContosoUniversity-cards-animated -b 003-cards-animated
git worktree add ../ContosoUniversity-cards-condensed -b 003-cards-condensed
```

**First worktree**: Add subtle hover animations and transitions to cards
**Second worktree**: Try a more condensed card layout with smaller text

Implement both in parallel, test, then merge the best elements from each.

### Scenario: Apply the Pattern to Other Pages

Once you've chosen the best Students page design, apply it to other entities:

```bash
# Create worktrees for Courses and Instructors using the same pattern
git worktree add ../ContosoUniversity-courses-ui -b 003-courses-enhanced-list
git worktree add ../ContosoUniversity-instructors-ui -b 003-instructors-enhanced-list
```

Work on both simultaneously, ensuring consistent design across all entity list pages.

---

## Part 8: Worktrees for Bug Fixes During Development

### Scenario: Critical Bug While Working on Feature

You're working on the UI in a worktree when a critical bug is reported in production:

```bash
# You're in ../ContosoUniversity-variant-b working on UI

# Create a hotfix worktree from main
git worktree add ../ContosoUniversity-hotfix -b hotfix/critical-bug

# Open in new VS Code window
code ../ContosoUniversity-hotfix
```

In the hotfix window:

1. Fix the bug
2. Test thoroughly
3. Commit and push
4. Merge to main
5. Remove hotfix worktree

Meanwhile, your feature work remains untouched in the other worktree!

---

## Part 9: Worktrees for Code Review

### Reviewing Pull Requests Without Disrupting Work

```bash
# Someone opens a PR you need to review
# Create a worktree to check it out

git worktree add ../ContosoUniversity-pr-review -b review/pr-123

# Open in VS Code
code ../ContosoUniversity-pr-review

# Review, test, leave comments
# When done, remove worktree
cd ..
git worktree remove ContosoUniversity-pr-review
```

Your main development work stays intact!

---

## Key Takeaways

1. **Parallel Experimentation**: Worktrees enable trying multiple approaches without commit/stash churn
2. **Context Preservation**: Each worktree maintains its own state (open files, terminals, etc.)
3. **Side-by-Side Comparison**: Run multiple implementations simultaneously for real-time comparison
4. **Spec-Kit with Worktrees**: Create a base spec first, then modify it independently in each worktree for different approaches
5. **Clean Workflow**: Easy to merge winners and discard experiments

## Best Practices

1. **Naming Convention**: Use descriptive worktree directory names with consistent prefixes

   ```bash
   ../project-variant-a
   ../project-variant-b
   ```

2. **Port Management**: Use different ports for simultaneous running

   ```bash
   PORT=3001 npm start  # Worktree 1
   PORT=3002 npm start  # Worktree 2
   ```

3. **Clean Up Regularly**: Remove worktrees when done

   ```bash
   git worktree prune
   git worktree list
   ```

4. **Document Decisions**: Keep evaluation notes in your spec
   ```bash
   /speckit.clarify Document why we chose the card grid layout over the table and sidebar approaches, including usability insights and trade-offs considered.
   ```

## Challenge Extensions

1. **A/B Testing**: Create worktrees for user-facing variations and deploy both for real user testing
2. **Performance Comparison**: Benchmark different UI implementations objectively (load time, bundle size, render performance)
3. **Responsive Design Variations**: Try different mobile layouts in parallel worktrees
4. **Accessibility Experiments**: Test different approaches to keyboard navigation and screen reader support

## Troubleshooting

### Can't Create Worktree - Branch Already Checked Out

**Error**: `fatal: 'branch-name' is already checked out`

**Solution**: A branch can only be checked out in one worktree at a time. Use a different branch name or remove the existing worktree.

### Worktree Directory Deleted Manually

If you deleted the directory without using `git worktree remove`:

```bash
git worktree prune
```

This cleans up references to deleted worktrees.

### Spec Changes Not Reflected in Other Worktrees

Specs are per-worktree. If you update a spec in one worktree and want it in others:

```bash
# From worktree with updated spec
cp -r specs ../other-worktree/
```

Or commit and pull in each worktree.

## Resources

- [Spec-Kit Quickstart Guide](https://github.github.io/spec-kit/quickstart.html)
- [Spec-Kit Documentation](https://github.com/github/spec-kit)
- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree)
- [Pro Git Book - Worktrees](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging)

---

## Next Steps

Continue to the optional feature labs (Labs 4-9) to add new functionality using the Spec-Kit and worktree workflows you've mastered!
