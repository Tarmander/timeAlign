create or replace function add_user(username varchar(255), email varchar(255), first_name varchar(255), last_name varchar(255))
returns void as $$
	insert into users(username, email, first_name, last_name)
	values(username, email, first_name, last_name)
$$ language sql; 