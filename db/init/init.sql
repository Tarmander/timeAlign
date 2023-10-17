-- tables
\i ./docker-entrypoint-initdb.d/tables/users.sql
\i ./docker-entrypoint-initdb.d/tables/calendars.sql
\i ./docker-entrypoint-initdb.d/tables/user_calendars.sql
\i ./docker-entrypoint-initdb.d/tables/schedules.sql

-- functions
\i ./docker-entrypoint-initdb.d/functions/get_user.sql
\i ./docker-entrypoint-initdb.d/functions/add_user.sql
\i ./docker-entrypoint-initdb.d/functions/delete_user.sql
\i ./docker-entrypoint-initdb.d/functions/get_calendar.sql
\i ./docker-entrypoint-initdb.d/functions/add_calendar.sql
\i ./docker-entrypoint-initdb.d/functions/delete_calendar.sql
\i ./docker-entrypoint-initdb.d/functions/get_user_calendars.sql
\i ./docker-entrypoint-initdb.d/functions/add_user_to_calendar.sql
\i ./docker-entrypoint-initdb.d/functions/insert_user_times.sql

-- intialize tables
\i ./docker-entrypoint-initdb.d/functions/initialize_tables.sql