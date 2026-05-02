## 💻 Tech Stack
- **Frontend:** React 18 (Vite), Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database & Auth:** MongoDB, JWT (HTTP-only cookies), Bcrypt.js

## ⚙️ How It Works
1. **Admin Setup:** An Admin logs in, creates a new project, and assigns specific tasks to registered team members.
2. **Member Execution:** Team members log into their isolated dashboards where they only see projects and tasks assigned to them.
3. **Progress Tracking:** Members update their task status (`Not Started` ➡️ `Processing` ➡️ `Done`). These updates instantly reflect on the Admin's master board for seamless team tracking.


📂 Folder Structure
                               Backend

backend/
├── config/         # Database connection
├── controllers/    # Route logic (auth, projects, tasks)
├── middlewares/    # Authentication & Role guards
├── models/         # Mongoose schemas
├── routes/         # Express routing definitions
├── .env            # Environment variables
└── index.js        # Main server entry point
                              
                              Frontend
frontend/
├── src/
│   ├── pages/      # Home, Auth, and Dashboard pages
│   ├── App.jsx     # Routing and global config
│   ├── main.jsx    # React DOM render
│   └── index.css   # Tailwind configuration
└── tailwind.config.js



🌐 Live Deployment
Deploy Link: 