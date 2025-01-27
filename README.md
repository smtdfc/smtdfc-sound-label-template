# smtdfc Sound Label Template

## Setup Guide

### Prerequisites:
- **Node.js** >= 14
- **PostgreSQL**
- **Cloudinary** (for image storage)
- **Supabase Storage** (for music storage)

**Tip:** If you don't have the resources to set up your own database server, we recommend using Supabase's PostgreSQL service, which also includes storage options.

### Database Setup:
1. Run the `setup/db.sql` script to create the required tables in your PostgreSQL database.

### Server Setup:
1. Create a `.env` file in the root directory and configure the necessary environment variables as follows:
    ```bash
    DB_URL=your-database-url
    ACCESS_TOKEN_SECRET=your-access-token-secret
    REFRESH_TOKEN_SECRET=your-refresh-token-secret
    CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
    CLOUDINARY_API_KEY=your-cloudinary-api-key
    CLOUDINARY_API_SECRET=your-cloudinary-api-secret
    SUPABASE_API_KEY=your-supabase-api-key
    SUPABASE_PROJECT_URL=your-supabase-project-url
    ```

2. Open a terminal in the project directory and install the required dependencies:
    ```bash
    npm install
    ```

### Client Configuration:
1. Navigate to `client/configs/app.js` and edit the necessary information for your frontend application:
    ```javascript
    export const Configurations = {
      APP_NAME: "your-app-name", // Your application name
      AUTH_REQUIRE: true, // Keep this as true
      BACKEND_HOST: "your-backend-url" // Provide your backend server URL
    }
    ```

### Build and Launch:
1. Run the following command to build and start the application:
    ```bash
    npm start
    ```

**Note:** By default, the server will run on port 3000. You can change this in the `server/configs/server.js` file.

---

This setup will get your smtdfc sound label template up and running efficiently. Be sure to fill out all required environment variables and configure the backend URL for seamless integration between your frontend and backend.