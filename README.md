# Student Job Finder Student Job Finder is a full-stack MERN web application designed to connect students with internships, part-time jobs, and entry-level job opportunities. The platform supports three user roles: students, companies, and administrators. Students can browse jobs, save listings, apply for roles, upload their CV, and track their applications. Companies can create job posts, manage applicants, and update application statuses. Admin users can manage users, jobs, applications, and view platform statistics. --- ## Live Deployment Frontend deployed on Vercel:
txt
https://student-job-finder-3bqka5u17-student-job-finder.vercel.app
--- ## Features ### Student Features - Register and log in as a student - Browse available jobs - Search and filter jobs by keyword, location, job type, category, industry, and major - View detailed job information - Save and unsave jobs - Apply for jobs with an optional message - Track submitted applications - Withdraw applications - Upload, view, and delete a CV/resume - Edit student profile information ### Company Features - Register and log in as a company - Create new job posts - View company job listings - See applicant counts for each job - Review student applications - View or download applicant CVs - Update application status - Delete job postings - Edit company profile information ### Admin Features - Log in through the admin portal - View platform statistics - View users, jobs, and applications - Delete non-admin users - Delete applications - Review job and application activity across the platform - Dashboard with charts and analytics --- ## Tech Stack ### Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS
- Vercel configuration for single-page application routing

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token authentication
- bcryptjs for password hashing
- Multer for resume uploads
- CORS
- dotenv
- Nodemon for development --- ## How to Run the Project ### 1. Clone the Repository
bash
git clone https://github.com/Sinaninu/student-job-finder
cd student-job-finder
--- ### 2. Install Dependencies Install backend dependencies:
bash
cd backend
npm install
Install frontend dependencies:
bash
cd ../frontend
npm install
--- ### 3. Environment Variables

Create a .env file inside the backend folder.

env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
DNS_SERVERS=8.8.8.8,1.1.1.1


The project also includes backend/.env.example, which can be copied as a starting point:

bash
cd backend
cp .env.example .env
Then update the values in .env with your own MongoDB connection string and JWT secret. > Note: The frontend API service defaults to http://localhost:5000/api, so using PORT=5000 is recommended unless you also update the frontend API URL. --- ### 4. Run the Backend Server Inside the backend folder:
bash
npm run dev
The backend API will run at:
txt
http://localhost:5000
--- ### 5. Run the Frontend Open a second terminal and run:
bash
cd frontend
npm run dev
The frontend will usually run at:
txt
http://localhost:5173
--- ## Backend Scripts From the backend folder, you can run:
bash
npm run dev
Starts the backend server with nodemon.
bash
npm start
Starts the backend server with Node.
bash
npm run create-admin
Creates or updates an admin account. --- ## Creating an Admin User The backend includes a script for creating an admin account.
bash
cd backend
npm run create-admin
By default, it creates or updates this admin user:
txt
Email: admin@studentjobfinder.com
Password: Admin123!
You can override the default admin details with environment variables:
bash
ADMIN_NAME="Your Name" ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="StrongPass123!" npm run create-admin
After creating the admin account, log in from the Admin Login page. --- ## Project Structure
txt
student-job-finder/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── savedJobController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Application.js
│   │   ├── Job.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── savedJobRoutes.js
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── uploads/
│   │   └── resumes/
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
--- ## API Overview ### Authentication Routes Base route:
txt
/api/auth
| Method | Endpoint | Description | Access | | --- | --- | --- | --- | | POST | /register | Register a student or company account | Public | | POST | /login | Log in and receive a JWT token | Public | | GET | /profile | Get the logged-in user profile | Private | | PUT | /profile | Update student or company profile | Private | | POST | /resume | Upload student CV/resume | Student | | DELETE | /resume | Delete uploaded CV/resume | Student | --- ### Job Routes Base route:
txt
/api/jobs
| Method | Endpoint | Description | Access | | --- | --- | --- | --- | | GET | / | Get active jobs with optional filters | Public | | GET | /:id | Get one job by ID and increase view count | Public | | GET | /company/my-jobs | Get jobs posted by the logged-in company | Company/Admin | | POST | / | Create a job post | Company/Admin | | PUT | /:id | Update a job post | Company/Admin | | DELETE | /:id | Delete a job post and related applications | Company/Admin | Supported job filters include:
txt
keyword, location, jobType, category, industry, major
Example:
txt
/api/jobs?keyword=developer&location=Toronto&jobType=Internship
--- ### Application Routes Base route:
txt
/api/applications
| Method | Endpoint | Description | Access | | --- | --- | --- | --- | | POST | / | Submit a job application | Student | | GET | /my-applications | Get applications submitted by the logged-in student | Student | | GET | /company | Get applications for company jobs | Company/Admin | | PATCH | /:id/status | Update an application status | Company/Admin | | DELETE | /:id | Withdraw an application | Student | Application status values:
txt
submitted, reviewed, closed, withdrawn, accepted, rejected
--- ### Saved Job Routes Base route:
txt
/api/saved-jobs
| Method | Endpoint | Description | Access | | --- | --- | --- | --- | | GET | / | Get saved jobs for the logged-in student | Student | | POST | /:jobId | Save a job | Student | | DELETE | /:jobId | Remove a saved job | Student | --- ### Admin Routes Base route:
txt
/api/admin
| Method | Endpoint | Description | Access | | --- | --- | --- | --- | | GET | /test | Test admin route availability | Public | | GET | /stats | Get platform statistics | Admin | | GET | /users | Get all users, optionally filtered by role | Admin | | GET | /jobs | Get all jobs with applicant counts | Admin | | GET | /applications | Get all applications | Admin | | DELETE | /users/:id | Delete a non-admin user | Admin | | DELETE | /applications/:id | Delete an application | Admin | --- ## User Roles The application supports three roles:
txt
student
company
admin
Students and companies can register through the frontend. Admin users are created through the backend script. --- ## Resume Uploads Students can upload resumes in the following formats:
txt
.pdf, .doc, .docx
Uploaded files are stored in:
txt
backend/uploads/resumes
The backend/uploads folder is ignored by Git, so uploaded files are not committed to the repository. --- ## Authentication The backend uses JWT authentication. After login, the frontend stores the token in localStorage and sends it with protected API requests using the Authorization header.
txt
Authorization: Bearer <token>
The frontend also includes an inactivity timeout that clears the session after the user has been inactive for a set period of time. --- ## Common Issues ### Backend cannot connect to MongoDB Check that: - MONGODB_URI is correct - Your MongoDB Atlas IP access list allows your current IP address - Your database username and password are correct - The .env file is inside the backend folder --- ### Frontend cannot reach backend Check that: - The backend server is running - The backend is running on port 5000 - CLIENT_URL=http://localhost:5173 is set in the backend .env - The frontend API base URL matches the backend URL --- ### Resume links do not open Check that: - The backend is running - The uploaded file still exists in backend/uploads/resumes - The frontend resume link URL matches the backend port --- ## Build Frontend for Production From the frontend folder:
bash
npm run build
Preview the production build:
bash
npm run preview
--- ## System Description Student Job Finder was developed to simplify the process of connecting students with companies offering internships, part-time jobs, and entry-level opportunities. The platform includes: - Role-based authentication and authorization - Job posting and management - Student applications - Saved jobs functionality - CV and resume uploads - Admin dashboard with statistics and analytics - Responsive layouts for desktop and mobile devices The application follows a MERN stack architecture with a React frontend and a Node.js/Express backend connected to MongoDB. The system was designed with maintainability, usability, and scalability in mind. --- ## Team Members - **Ayisha Omer** — Backend development, jobs, applications, saved jobs integration, dashboards, and UI improvements
- **Sina Estifanos** — Database, backend architecture, authentication, security, and UI improvements
- **Sadia Omer** — Frontend development, routing, responsive UI design, and styling --- ## Future Improvements Possible improvements for the project include: - Add email notifications for application updates - Add pagination for jobs, users, and applications - Add job editing from the company dashboard - Add company logo upload instead of logo URL only - Add password reset functionality - Add stronger form validation - Add deployment configuration for production hosting --- ## License This project is licensed under the ISC License.
