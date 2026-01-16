# Developer Notes & Demo Guide

## Project Overview
This project is a construction safety SaaS prototype built with Next.js, Tailwind CSS, and shadcn/ui.

## Demo Guide

### 1. Role Simulation
- **Goal**: Show how the interface adapts to different user roles.
- **Steps**:
  1. Click the "Role" dropdown in the top header (Shield icon).
  2. Select **Field Worker**. Notice:
     - "Admin" disappears from sidebar.
     - "Edit" buttons on Incidents disappear.
  3. Select **Admin**. Notice everything returns.
  4. Select **Contractor**. Notice limited visibility.

### 2. Linking Records
- **Goal**: Demonstrate interconnected safety data.
- **Steps**:
  1. Go to **Incidents**.
  2. Click on the first incident ("Near miss with crane...").
  3. Click the **Linked Records** tab.
  4. Observe linked JSA and Permit.
  5. Click "Link Record" to simulate adding a new link.

### 3. Module Configuration (Admin)
- **Goal**: Show system flexibility.
- **Steps**:
  1. Go to **Admin & Configuration**.
  2. Click **Module Configuration**.
  3. Toggle a module off (e.g., "Training").
  4. Notice the sidebar updates immediately (if role is Admin).

### 4. Admin Dashboard
- **Goal**: Show comprehensive management.
- **Steps**:
  1. Navigate to `/admin`.
  2. Explore **User Management** (mock) and **System Logs** (mock).

## key Commands
- `npm run dev`: Start development server.
