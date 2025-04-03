# To Run the Project:
- Set up an Oracle XE database, with an account that can access it. Put the login details in a .env file in proj_backend, formatted like .env_example is.
- Run db_init.sql in the database using the same account, to initialize the tables (they won't have any values in them to start with)
- Optional: Add some dummy values into the database using an external tool. NOTE: the tables have been slightly altered from the design document to
be valid Oracle XE/Oracle SQL commands, so if you're using the test data insertion commands included in the document you'll have to alter them to match.
- Run ```npm start``` while in the root folder, then do the same in another terminal while in the proj_backend folder. The first of these should eventually
open a window that will have the website running locally.