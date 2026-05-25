# Student Job Finder

Student Job Finder is a full-stack MERN web application designed to connect students with internships, part-time jobs, and entry-level job opportunities.

The platform supports three user roles:
- Students
- Companies
- Administrators

Students can browse jobs, save listings, apply for positions, upload CVs, and track their applications. Companies can create job posts, manage applicants, and update application statuses. Admin users can manage users, jobs, applications, and monitor platform activity through dashboard statistics.

---

# Live Deployment

Frontend deployed on Vercel:

https://student-job-finder-3bqka5u17-student-job-finder.vercel.app

---

# Features

## Student Features

- Register and log in as a student
- Browse available jobs
- Search and filter jobs
- View detailed job information
- Save and unsave jobs
- Apply for jobs with optional messages
- Track submitted applications
- Withdraw applications
- Upload, view, and delete CV/resume files
- Edit student profile information

## Company Features

- Register and log in as a company
- Create job posts
- View company job listings
- Review student applications
- View applicant CVs/resumes
- Update application statuses
- Delete job posts
- Edit company profile information

## Admin Features

- Log in through the admin portal
- View platform statistics
- Manage users
- Manage jobs
- Manage applications
- Delete non-admin users
- Dashboard with analytics and charts

---

# Tech Stack

## Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Multer
- dotenv
- CORS
- Nodemon

---

# How to Run the Project

## 1. Clone the Repository

```bash
git clone https://github.com/Sinaninu/student-job-finder
cd student-job-finder
```

---

## 2. Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
DNS_SERVERS=8.8.8.8,1.1.1.1
```

The project also includes a backend `.env.example` file which can be copied as a starting point:

```bash
cd backend
cp .env.example .env
```

Then update the values in `.env` with your own MongoDB connection string and JWT secret.

---

## 4. Run the Backend Server

Inside the backend folder:

```bash
npm run dev
```

Backend runs at:

```txt
http://localhost:5000
```

---

## 5. Run the Frontend

Open a second terminal and run:

```bash
cd frontend
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

---

# Backend Scripts

From the `backend` folder:

```bash
npm run dev
```

Starts the backend server using nodemon.

```bash
npm start
```

Starts the backend server using Node.

```bash
npm run create-admin
```

Creates or updates an admin account.

---

# Creating an Admin User

Run:

```bash
cd backend
npm run create-admin
```

Default admin account:

```txt
Email: admin@studentjobfinder.com
Password: Admin123!
```

You can also override the default credentials:

```bash
ADMIN_NAME="Your Name" ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="StrongPass123!" npm run create-admin
```

---

# Project Structure

```txt
student-job-finder/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# API Overview

## Authentication Routes

Base route:

```txt
/api/auth
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a student or company account |
| POST | `/login` | Log in and receive JWT token |
| GET | `/profile` | Get logged-in user profile |
| PUT | `/profile` | Update profile |
| POST | `/resume` | Upload CV/resume |
| DELETE | `/resume` | Delete uploaded CV/resume |

---

## Job Routes

Base route:

```txt
/api/jobs
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all jobs |
| GET | `/:id` | Get one job |
| GET | `/company/my-jobs` | Get company jobs |
| POST | `/` | Create a job |
| PUT | `/:id` | Update a job |
| DELETE | `/:id` | Delete a job |

---

## Application Routes

Base route:

```txt
/api/applications
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Submit application |
| GET | `/my-applications` | Get student applications |
| GET | `/company` | Get company applications |
| PATCH | `/:id/status` | Update application status |
| DELETE | `/:id` | Withdraw application |

---

## Saved Job Routes

Base route:

```txt
/api/saved-jobs
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get saved jobs |
| POST | `/:jobId` | Save a job |
| DELETE | `/:jobId` | Remove saved job |

---

## Admin Routes

Base route:

```txt
/api/admin
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats` | Get platform statistics |
| GET | `/users` | Get all users |
| GET | `/jobs` | Get all jobs |
| GET | `/applications` | Get all applications |
| DELETE | `/users/:id` | Delete non-admin user |
| DELETE | `/applications/:id` | Delete application |

---

# Authentication

The backend uses JWT authentication.

After login, the frontend stores the token in `localStorage` and sends it through the Authorization header:

```txt
Authorization: Bearer <token>
```

---

# Resume Uploads

Students can upload resumes in:

```txt
.pdf, .doc, .docx
```

Uploaded files are stored in:

```txt
backend/uploads/resumes
```

---

# Common Issues

## Backend Cannot Connect to MongoDB

Check that:
- `MONGODB_URI` is correct
- MongoDB Atlas allows your IP address
- Database credentials are correct
- `.env` exists inside the backend folder

---

## Frontend Cannot Reach Backend

Check that:
- Backend server is running
- Backend runs on port `5000`
- `CLIENT_URL=http://localhost:5173` is set
- Frontend API URL matches backend URL

---

## Resume Links Do Not Open

Check that:
- Backend server is running
- Uploaded files still exist
- Resume URL matches backend port

---

# Build Frontend for Production

Inside the frontend folder:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# System Description

Student Job Finder was developed to simplify the process of connecting students with companies offering internships, part-time jobs, and entry-level opportunities.

The platform includes:
- Role-based authentication
- Job posting and management
- Student applications
- Saved jobs functionality
- Resume uploads
- Admin dashboard with statistics and charts
- Responsive layouts for desktop and mobile devices

The application follows a MERN stack architecture using React on the frontend and Node.js/Express with MongoDB on the backend.

---

# Team Members

- **Ayisha Omer** — Backend development, jobs, applications, saved jobs integration, dashboards, and UI improvements
- **Sina Estifanos** — Database, backend architecture, authentication, security, and UI improvements
- **Sadia Omer** — Frontend development, routing, responsive UI design, and styling

---

# Future Improvements

Possible future improvements include:
- Email notifications
- Password reset functionality
- Improved form validation
- Pagination
- External API integration
- Better mobile responsiveness
- Real-time updates

---

# License

This project is licensed under the ISC License.
