# A MERN stack project with Google Maps API

-   This is a project that's been made for trying/using Google Maps API in a MERN Stack environment.
-   Its functionalities are quite simple. First of all, to be authorized, users must create an account. After that, they can add new places; list users and also their respective places.
-   Application stores images in the backend server.
-   Authentication is maintained with JSON Web Tokens. After logging/signing in, these tokens are stored in the browser's local storage.
-   Currently the app isn't deployed online but it can be viewed in local environment. To do that, you must define some environment variables such as:
    1. For frontend: REACT_APP_GOOGLE_API_KEY (for Maps API), REACT_APP_API_URL (for example: http://localhost:5000/api) and REACT_APP_BACKEND_URL (http://localhost:5000)
    2. For backend: API_KEY (the same API key), MONGO_URI (you MongoDB connection string) and JWT_SECRET (for creating JWT tokens)
