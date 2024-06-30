Just Note Lit
=============

A full stack CRUD web application that allows users to take and update notes 


Run with docker compose
===========

Prerequisites:

Docker: Ensure that Docker and Docker Compose is installed on your system. 

Steps to Run the Application
===========================

1. ``git clone git@github.com:Jarae-MacyMan/JustNoteLit.git`` 
2. ``cd NotesApp``
3. Create a .env file in the root directory of the project and add the required environment variables. Below is an example of what the .env file should look like:
   ``SQLALCHEMY_DATABASE_URI=sqlite:///mydatabase.db
     REDIS_HOST=redis
     REDIS_PORT=6379``
4. Use Docker Compose to pull the images from Docker Hub and start the containers. ``docker-compose up``
5. Open a web browser and navigate to "http://localhost:3000"
6. To stop containers ``docker-compose down``


