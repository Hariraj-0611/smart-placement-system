# 🎓 Smart Placement Management System

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django">
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
</div>

<div align="center">
  <h3>A full-stack web application for college placement management</h3>
  <p>Streamline your campus placement process with this comprehensive system</p>
</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
  - [Student Features](#student-features)
  - [Placement Officer Features](#placement-officer-features)
- [Screenshots](#-screenshots)
- [Usage Guide](#-usage-guide)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### 👨‍🎓 For Students
- ✅ **User Registration** - Create account with personal and academic details
- ✅ **Profile Management** - Upload profile photo and resume (PDF/DOC)
- ✅ **Dashboard** - View available drives, applied drives, and selection status
- ✅ **Company Drives** - Browse and filter available placement drives
- ✅ **Apply Online** - Apply for drives with single click
- ✅ **Track Applications** - Real-time status (Pending/Shortlisted/Selected/Rejected)
- ✅ **Skills Management** - Add and update technical skills
- ✅ **JWT Authentication** - Secure login/logout

### 👨‍💼 For Placement Officers
- ✅ **Separate Login** - Admin-created credentials
- ✅ **Dashboard** - Statistics overview (total students, drives, applications)
- ✅ **Drive Management** - Create, update, delete company drives
- ✅ **Student Management** - View all registered students
- ✅ **Advanced Filtering** - Filter students by CGPA and skills
- ✅ **Shortlisting** - Shortlist students for drives
- ✅ **Status Updates** - Update application status
- ✅ **Application Review** - Review and manage applications

### 🔧 Technical Features
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-based Access** - Different dashboards for students and officers
- ✅ **File Upload** - Resume and profile photo upload with validation
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Pagination** - Efficient handling of large data sets
- ✅ **RESTful API** - Well-structured API endpoints
- ✅ **Toast Notifications** - User-friendly feedback messages
- ✅ **Loading States** - Spinners and loaders for better UX

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Styling and responsive design |
| **Axios** | HTTP client for API calls |
| **React Router DOM** | Navigation and routing |
| **React Hot Toast** | Toast notifications |
| **Headless UI** | Accessible UI components |
| **Heroicons** | SVG icons |
| **React Paginate** | Pagination component |
| **JWT Decode** | Token decoding |

### Backend
| Technology | Purpose |
|------------|---------|
| **Django 4.2** | Web framework |
| **Django REST Framework** | REST API building |
| **SimpleJWT** | JWT authentication |
| **MySQL** | Database |
| **PyMySQL** | MySQL connector |
| **Pillow** | Image processing |
| **Django CORS Headers** | CORS management |

---

## 🏗 System Architecture
