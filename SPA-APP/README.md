🎓 Course Events App - SPA 

This is a Single Page Application (SPA) built with plain HTML, CSS, and JavaScript using a simple file structure. It simulates a course event system for students, where users can register as either Admin or User, and interact with courses through different roles.
📁 Project Structure

/SPA-APP
│
├── index.html           # Main HTML file with all SPA sections
├── script.js            # All JavaScript logic (login, CRUD, reservations)
├── style.css            # Custom CSS file for UI
├── router.js            # Route guard to protect views
└── db.json              # Mock database for JSON Server

🚀 Features
🔐 Authentication

    Login and register as:
        admin
        user
    Role-based views and permissions

👨‍🏫 Admin Capabilities

    Add new courses
    Edit or delete existing courses
    View all available courses

👨‍🏫 User Capabilities

    View available courses
    Reserve a course (if seats are available)
    View their own reservation history

🧠 Simulated Backend

    Uses JSON Server to simulate a REST API with:
        /usuarios (users)
        /cursos (courses)
        /reservas (user reservations)

🔧 Setup Instructions
1. Install JSON Server (if not already)

npm install -g json-server

2. Run the server

Make sure your terminal is in the project folder where db.json exists:

json-server --watch db.json

JSON Server will be available at http://localhost:3000
3. Open the App

Just open index.html in your browser. No bundler or server is needed.
📆 Sample Data in db.json

{
  "usuarios": [
    { "id": 1, "nombre": "Admin", "email": "admin@test.com", "password": "1234", "rol": "admin" },
    { "id": 2, "nombre": "Student", "email": "user@test.com", "password": "1234", "rol": "usuario" }
  ],
  "cursos": [
    { "id": 1, "nombre": "JavaScript Basics", "descripcion": "Intro course", "fecha": "2025-07-20", "cupos": 10 }
  ],
  "reservas": []
}

✅ Requirements

    Node.js
    JSON Server (npm install -g json-server)
    Modern browser (Chrome, Firefox, Edge)

🧑‍💻 Author

This project was developed by a student growing as a junior developer. The logic and structure are intentionally kept simple to help understand basic CRUD, roles, and state management in a front-end SPA using JavaScript.

David Estevan Rendon Sanchez

Clan: Lovelace

Email: davidrex114@hotmail.com

ID: 1035235989

📌 Notes

    This project does not use any frameworks.
    Styling is clean and custom CSS is included.
    