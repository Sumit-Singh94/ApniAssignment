#APNIASSIGNMENT



1. Why did you choose the frontend stack you used?

I chose Vite + React + Tailwind CSS because it provides a fast, modern, and lightweight development experience that fits well with the scope of this assignment.

React allows clear separation of UI and logic using components and hooks.

Vite offers extremely fast dev startup and builds, which is ideal for rapid iteration.

Tailwind CSS helps build a clean and responsive UI quickly without managing large CSS files or design systems.

This stack avoids unnecessary complexity while still being production-ready and widely used in startups.

2. Explain your Firestore data structure

I used a single main collection called issues.

Each issue document contains:

title – short summary of the issue

description – detailed explanation

priority – Low / Medium / High

status – Open / In Progress / Done

assignedTo – email or name of the assignee

createdBy – email of the user who created the issue

createdAt – timestamp used for sorting

Structure example:

issues
 └── issueId
     ├── title
     ├── description
     ├── priority
     ├── status
     ├── assignedTo
     ├── createdBy
     └── createdAt


This structure is simple, easy to query, and works well with Firestore’s real-time updates.

3. Explain how you handled similar issues

When creating a new issue, the app checks existing issues for similar titles using a simple text comparison.

If a similar issue is found:

The user is shown a warning

The issue is not created immediately

This approach avoids accidental duplicates while keeping the logic simple and understandable.
It can be improved later using better text matching or AI-based similarity detection.

4. What was confusing or challenging?

The most challenging part was deciding how much to build without over-engineering, especially around:

Similar issue detection

Firestore security rules

Status transition constraints

Since the requirements were intentionally open-ended, I focused on making reasonable, practical decisions that could be easily explained and extended later.

5. What would you improve next?

If given more time, I would:

Improve similar-issue detection using better string matching or embeddings

Add better error and loading feedback in the UI

Add role-based permissions (e.g., only assignees can change status)

Improve mobile responsiveness further

Add basic analytics or activity logs