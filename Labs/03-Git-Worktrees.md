# Lab 3: Git Worktrees - Working on Multiple UI Iterations

## Overview

Learn how to use Git worktrees to work on multiple feature branches simultaneously without switching contexts. This is especially useful when experimenting with different UI approaches or working on features that need comparison side-by-side.

## Learning Objectives

- Understand Git worktrees and their benefits
- Set up multiple worktrees for parallel development
- Compare different UI implementations side-by-side
- Manage multiple running instances of the same application
- Clean up and merge worktree branches

## Prerequisites

- Git 2.5+ (worktrees feature)
- Completed Labs 1-2 (or familiar with the codebase)
- Basic Git knowledge

## Duration

Approximately 45-60 minutes

---

## Part 1: Understanding Git Worktrees

### What Are Worktrees?

Git worktrees allow you to have multiple working directories attached to the same repository. Each worktree can be on a different branch, enabling you to:

- Work on multiple features without stashing or committing incomplete work
- Run different versions of the application simultaneously
- Compare implementations side-by-side
- Quickly switch between branches without checkout overhead

### Traditional Workflow vs. Worktrees

**Traditional:**
```bash
git checkout feature-a
# Make changes, test
git checkout feature-b
# Make changes, test
# Repeat, losing context each time
```

**With Worktrees:**
```bash
# Both features available simultaneously
cd ../repo-feature-a  # Feature A running here
cd ../repo-feature-b  # Feature B running here
```

---

## Part 2: Setting Up Worktrees

### Step 1: View Current Worktrees

```bash
# From the main repository
git worktree list
```

You'll see your main worktree listed.

### Step 2: Create Worktrees for UI Iterations

Let's create worktrees for different UI approaches:

```bash
# From repository root

# Create worktree for Material-UI iteration
git worktree add ../ContosoUniversity-ui-material -b feature/ui-material-ui

# Create worktree for Tailwind CSS iteration
git worktree add ../ContosoUniversity-ui-tailwind -b feature/ui-tailwind

# Create worktree for Bootstrap 5 upgrade
git worktree add ../ContosoUniversity-ui-bootstrap5 -b feature/ui-bootstrap5
```

This creates three new directories at the same level as your main repository:
```
parent-directory/
  ContosoUniversity/              # Main worktree (main branch)
  ContosoUniversity-ui-material/  # Material-UI branch
  ContosoUniversity-ui-tailwind/  # Tailwind branch
  ContosoUniversity-ui-bootstrap5/ # Bootstrap 5 branch
```

### Step 3: Verify Worktrees

```bash
git worktree list
```

Expected output:
```
/path/to/ContosoUniversity              [main]
/path/to/ContosoUniversity-ui-material  [feature/ui-material-ui]
/path/to/ContosoUniversity-ui-tailwind  [feature/ui-tailwind]
/path/to/ContosoUniversity-ui-bootstrap5 [feature/ui-bootstrap5]
```

---

## Part 3: Working with Multiple UI Iterations

### Scenario: Comparing React UI Frameworks

Let's implement the same UI feature using different frameworks to compare them.

### Step 1: Material-UI Implementation

```bash
cd ../ContosoUniversity-ui-material
```

If you have the React app from Lab 2:
```bash
cd contoso-university-ui
npm install @mui/material @emotion/react @emotion/styled
```

**Using GitHub Copilot for Implementation:**

In GitHub Copilot Chat:
```
I want to convert the Students list component to use Material-UI. 
Help me refactor the component to use:
- MUI Table for the students list
- MUI Pagination
- MUI Button for actions  
- MUI Card for student details

Show me the implementation step by step.
```

Run the application:
```bash
# Terminal 1: Backend
cd ContosoUniversity
dotnet run --urls "https://localhost:7054"

# Terminal 2: Frontend
cd contoso-university-ui
PORT=3001 npm start
```

Access at `http://localhost:3001`

### Step 2: Tailwind CSS Implementation

Open a new terminal:

```bash
cd ../ContosoUniversity-ui-tailwind/contoso-university-ui
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Using GitHub Copilot for Configuration:**

In GitHub Copilot Chat:
```
I've installed Tailwind CSS. Help me:
1. Configure tailwind.config.js properly for React
2. Set up the main CSS file with Tailwind directives
3. Convert the Students list component to use Tailwind utility classes
4. Implement responsive design with Tailwind breakpoints
```

Run on a different port:
```bash
PORT=3002 npm start
```

Access at `http://localhost:3002`

### Step 3: Bootstrap 5 Implementation

Open another terminal:

```bash
cd ../ContosoUniversity-ui-bootstrap5/contoso-university-ui
npm install bootstrap@5 react-bootstrap
```

**Using GitHub Copilot:**

```
I've installed Bootstrap 5 and React Bootstrap. Help me:
1. Import Bootstrap CSS properly
2. Update the Students components to use React Bootstrap components
3. Use Bootstrap Table, Pagination, Modal, and Card components
4. Ensure responsive layout
```

Run on another port:
```bash
PORT=3003 npm start
```

Access at `http://localhost:3003`

### Step 4: Side-by-Side Comparison

Now you have three versions running simultaneously:
- Material-UI: `http://localhost:3001`
- Tailwind: `http://localhost:3002`
- Bootstrap 5: `http://localhost:3003`

Open them side-by-side in your browser and compare:
- Visual appearance
- User experience
- Code complexity
- Bundle size
- Developer experience

---

## Part 4: Using Worktrees with Spec-Kit

### Iteration A: Modern Minimalist Design

```bash
cd ../ContosoUniversity-ui-tailwind
```

**Using Spec-Kit with GitHub Copilot:**

In GitHub Copilot Chat:
```
Following spec-kit methodology, help me create a specification 
for a minimalist UI design in specs/003-ui-minimalist/spec.md with:
- Clean typography
- Lots of whitespace
- Subtle animations
- Muted color palette

Then help me implement it using /speckit.implement
```

### Iteration B: Data-Dense Dashboard

```bash
cd ../ContosoUniversity-ui-material
```

In GitHub Copilot Chat:
```
Create a specification in specs/003-ui-dashboard/spec.md for a 
data-dense dashboard UI with:
- Charts and visualizations
- Multiple data tables
- Dense information display
- Quick actions sidebar

Then implement using /speckit.implement
```

---

## Part 5: Selecting and Merging

### Step 1: Evaluate Implementations

Create a comparison document:

```markdown
# UI Framework Comparison

## Material-UI
**Pros:**
- Rich component library
- Good TypeScript support
- Accessible by default

**Cons:**
- Large bundle size
- Opinionated styling
- Learning curve

**Bundle Size:** X MB

## Tailwind CSS
**Pros:**
- Small bundle size
- Highly customizable
- Fast development

**Cons:**
- Verbose HTML
- Need to build components
- Purging configuration

**Bundle Size:** Y MB

## Bootstrap 5
**Pros:**
- Familiar to team
- Good documentation
- Battle-tested

**Cons:**
- Generic look
- Heavier than Tailwind
- Less modern

**Bundle Size:** Z MB

## Decision: [Selected Framework]

**Rationale:** [Your reasoning]
```

### Step 2: Merge the Selected Implementation

Let's say you choose Material-UI:

```bash
cd ../ContosoUniversity  # Main worktree

# Merge the selected branch
git merge feature/ui-material-ui

# Push to remote
git push origin main
```

### Step 3: Clean Up Worktrees

Remove worktrees you're not using:

```bash
# Remove the worktree
git worktree remove ../ContosoUniversity-ui-tailwind

# Delete the branch (if not needed)
git branch -D feature/ui-tailwind

# Repeat for other worktrees
git worktree remove ../ContosoUniversity-ui-bootstrap5
git branch -D feature/ui-bootstrap5
```

Keep the Material-UI worktree if you want to continue work there, or remove it:

```bash
git worktree remove ../ContosoUniversity-ui-material
git branch -D feature/ui-material-ui  # Only if fully merged and not needed
```

### Step 4: Verify Cleanup

```bash
git worktree list
```

Should show only the main worktree.

---

## Part 6: Advanced Worktree Workflows

### A/B Testing Features

```bash
# Create worktrees for A/B test variations
git worktree add ../ContosoUniversity-variant-a -b feature/variant-a
git worktree add ../ContosoUniversity-variant-b -b feature/variant-b

# Implement different approaches
# Deploy both for user testing
# Collect metrics
# Merge the winning variant
```

### Bug Fix Without Context Switch

```bash
# You're working on a feature in main worktree
# Critical bug reported

# Create worktree from production branch
git worktree add ../ContosoUniversity-hotfix -b hotfix/critical-bug

cd ../ContosoUniversity-hotfix
# Fix the bug
# Test
# Commit and push

# Back to your feature work - no context lost
cd ../ContosoUniversity
```

### Code Review Workflow

```bash
# Reviewer creates worktree of PR branch
git worktree add ../ContosoUniversity-pr-123 -b review/pr-123

cd ../ContosoUniversity-pr-123
# Review code
# Run application
# Test changes

# Leave comments
# Remove worktree when done
cd ..
git worktree remove ContosoUniversity-pr-123
```

---

## Key Takeaways

1. **Parallel Development**: Work on multiple features without losing context
2. **Easy Comparison**: Run multiple versions side-by-side for A/B testing
3. **No Stashing**: Keep work-in-progress without commits or stashes
4. **Review Efficiency**: Checkout PR branches without disrupting current work
5. **Experimentation**: Try different approaches with easy rollback

## Best Practices

1. **Naming Convention**: Use descriptive worktree directory names
   ```bash
   ../project-feature-name
   ../project-hotfix-issue-123
   ```

2. **Cleanup Regularly**: Remove worktrees you're done with
   ```bash
   git worktree prune
   ```

3. **Port Management**: Use different ports for simultaneous running apps
   ```bash
   # .env.local in each React worktree
   PORT=3001  # worktree 1
   PORT=3002  # worktree 2
   ```

4. **Branch Protection**: Don't delete branches with active worktrees
   ```bash
   # Git prevents this by default
   ```

5. **Documentation**: Keep notes on what each worktree is for

## Challenge Extensions

1. **Multi-Backend Worktrees**: Test different database providers in parallel
2. **Performance Testing**: Compare build times and bundle sizes across worktrees
3. **Feature Flags**: Implement feature flags and test variations
4. **CI/CD Integration**: Set up CI to test multiple worktree branches

## Troubleshooting

### Can't Create Worktree

**Error:** `fatal: 'branch-name' is already checked out`

**Solution:** A branch can only be checked out in one worktree at a time.

### Worktree Not Removed

```bash
# Force remove if directory was deleted manually
git worktree prune
```

### Port Conflicts

Make sure each running instance uses a unique port:
```bash
# Backend
dotnet run --urls "https://localhost:7054;https://localhost:7055"

# Frontend
PORT=3001 npm start
```

## Resources

- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree)
- [Pro Git Book - Worktrees](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging)
- [Git Worktree Tutorial](https://morgan.cugerone.com/blog/workarounds-to-git-worktree-using-bare-repository-and-cannot-fetch-remote-branches/)

---

## Next Steps

Explore the optional feature labs (Labs 4-9) to add new functionality to Contoso University using the Spec-Kit and worktree workflows you've learned!

