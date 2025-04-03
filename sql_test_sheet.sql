select *
  from tutoringsession
 where sessionid = 'SES53548';

update tutoringsession
   set
   notes = 'Bio lab work'
 where sessionid = 'SES53548';

commit;

-- REMEMBER TO COMMIT IF YOU CHANGE ANYTHING, THIS DROVE ME NUTS FOR ALMOST HALF AN HOUR