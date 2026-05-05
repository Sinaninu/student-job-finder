# student-job-finder

## Environment Variables

The backend uses environment variables to keep private information out of the code.

Create a `.env` file inside the `backend` folder:

PORT=5000  
MONGODB_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  

Also create a `.env.example` file so group members know which variables are needed:

PORT=5000  
MONGODB_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  

The `.env` file must not be pushed to GitHub.  
Make sure `.env` is added to `.gitignore`.