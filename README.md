# Job Portal Application

A robust, modular job application management system designed to streamline the hiring workflow for both applicants and internal teams (Admin/Bot).

## Features

- **Role-Based Access:** Secure login for **Applicant**, **Admin**, and **Bot**.
- **Application Submission & Tracking:** Applicants can view available jobs, submit applications once, and track their status in real-time.
- **Segregated Management:**
  - **Admin** manages and updates **non-technical roles**.
  - **Bot** automates and updates **technical roles**.
- **Audit Trail:** Detailed **Activity Log** for every application status change, including timestamps and user info.
- **Automation:** The **Bot** can be triggered manually or automatically every hour to process technical applications.
- **Secure Authentication:** Utilizes **JWT tokens** stored in secure, \`SameSite\` and **HTTPS-only cookies** for session management.

---

## Architecture Overview

The application follows a **Modular Architecture** consisting of three main components:

| Component    | Responsibility                                                               |
| :----------- | :--------------------------------------------------------------------------- |
| **Frontend** | User Interface and interactions (Applicant, Admin, and Bot dashboards).      |
| **Backend**  | Business logic, secure authentication, API routing, and database operations. |
| **Bot**      | Automated and manual logic for updating technical role applications.         |

**Architecture Diagram:** [View Architecture](https://app.eraser.io/workspace/x22VIrclP4x77orsMpa0?origin=share)

---

## Roles and Responsibilities

The system defines three distinct roles, each with specific permissions:

| Role          | Rank | Description                                              | Key Actions                                                                                        |
| :------------ | :--- | :------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| **Applicant** | 1    | Submits applications and tracks status.                  | Register, Login, View Jobs, **Submit Application**, View Status, Receive Notifications.            |
| **Admin**     | 2    | Manages non-technical applications and system oversight. | Login, Create New Jobs, View All Applications, **Update Non-Technical Roles**, View Activity Logs. |
| **Bot**       | 3    | Automates the process for technical roles.               | Login, **Update Technical Roles** (Manual or Hourly Automatic Trigger).                            |

---

## Default Credentials (Development Only)

Use these credentials for local setup and testing. **⚠️ Change these immediately in any production environment.**

| Role          | Email               | Password        |
| :------------ | :------------------ | :-------------- |
| **Applicant** | \`jeevi@gmail.com\` | \`qwerty\`      |
| **Admin**     | \`admin@gmail.com\` | \`admin\`       |
| **Bot**       | \`bot@gmail.com\`   | \`botpassword\` |

---

## Getting Started

### Project Setup

#### 1. Frontend Setup

\`\`\`bash
cd frontend/frontend
npm install
npm run dev
\`\`\`

#### 2. Backend Setup

\`\`\`bash
cd backend
npm install
npm run dev # or npm start depending on your setup
\`\`\`

---

## Database Schema

The database efficiently stores and manages all application data, user accounts, and job postings.

**Schema Diagram:** [View Database Schema](https://app.eraser.io/workspace/Eib7jvWvmkm3ty3oGdRd?origin=share)

---

## API Documentation and Testing

A Postman collection is provided to test the backend API endpoints.

**Postman Collection:** [View Postman Collection](https://jeevitharavikumarcsecs-1395723.postman.co/workspace/Jeevitha-Ravikumar's-Workspace~11b65d0c-7e22-4c3d-8059-93a099d24c36/request/49538842-044d5d05-08b8-454b-8f2f-b51e3ea37045?action=share&creator=49538842&ctx=documentation)

---

## Detailed Workflow

### 1. Authentication & Security

A **JWT token** is generated upon login and stored in a highly secure **cookie**. This cookie is configured with **\`SameSite\`** and **HTTPS-only** rules to mitigate common web vulnerabilities and ensure secure session management.

---

### 2. Applicant Workflow

The Applicant focuses on finding jobs and tracking their status.

- **Dashboard:** Displays all submitted applications and their current status.
- **Jobs:** Allows browsing of open roles and application submission.
- **Notifications:** Receives real-time updates when the Admin or Bot changes an application's status.
- **Restriction:** Applicants **cannot apply to the same job more than once**.

---

### 3. Admin Workflow

The Admin manages non-technical roles and oversees the entire system. **Admin login is static** (verified via \`.env\` variables); no registration is possible.

- **Dashboard:** Provides an overview of system activity, including charts, chat, and all applicant applications.
- **Jobs:** Lists all existing jobs and allows for the creation of new postings.
- **Manage Applications:** Updates status and adds comments for applications in **non-technical roles only**.
- **Activity Log:** Shows a detailed audit trail of all changes with timestamps and user information.
- **Restriction:** **Cannot update technical roles**.

---

### 4. Bot Workflow

The Bot automates the review and update process for technical applications. **Bot login is static** (verified via \`.env\` variables); no registration is possible.

- **Automatic Updates:** Automatically processes and updates applications every **hour** using \`setInterval\`.
- **Manual Triggers:** Includes a **"Trigger All"** button to process all applications immediately, and an **"Individual Trigger"** for a single application.
- **Restriction:** **Can update only technical roles**.
