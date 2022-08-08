# DATN - Restaurant Management

Building a website for managing restaurant business activties with ordering and table reservation functionalities for customers using ReactJS and NodeJS

## Dependencies

- Node (14+)
- MySQL Server

## Installation

### Frontend

- Cd into **_/frontend_** directory
- Run command `npm install` to install dependencies
- Add **_.env_** file inside root directory (see **_env.example_** for reference) and fill environment variables with backend url (usually http://localhost:5000)

### Backend

- Cd into **_/frontend_** directory
- Run command `npm install` to install dependencies
- Add **_.env_** file inside root directory (see **_env.example_** for reference) and fill environment variables
- Set up AWS bucket with private permission and create an IAM user with put/get/delete permission. After successful setup on AWS, store IAM credentials in **_.env_** file
- Set up Twillio account and get a trial phone number for testing. Make sure to set up a messaging service and add the acquired phone number to the service. Then store access credentials and messaging service SID in **_.env_** file
- To initialize and seed database, run command `npm run db-init`. Make sure to turn on MySQL Server before running the command and replace credentials in **_.env_** file with your credentials to connect to MySQL Server

### Usage

- Cd into **_/backend_** and run command `npm start` (production mode) or `npm run dev` (development mode) to start backend server
- Cd into **_/frontend_** and run command `npm start` to run frontend server and start using the website
- The website has 2 groups of domains: one for restaurant staff with /admin prefix, and the other for customer. For example: http://localhost:5000 vs http://localhost:5000/admin. For referencing routes available, see paths in **appRoutes.js** file

## Project structure

- **_/frontend_**: Contains UI and logic code for frontend
- **_/backend_**: Contains API code
