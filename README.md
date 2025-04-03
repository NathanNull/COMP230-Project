# To Run the Project:
- Set up an Oracle XE database, with an account that can access it. Put the login details in a .env file in proj_backend, formatted like .env_example is.
- Run db_init.sql in the database using the same account, to initialize the tables (they won't have any values in them to start with)
- Run ```npm start``` while in the root folder, then do the same in another terminal while in the proj_backend folder. The first of these should eventually
open a window that will have the website running locally.