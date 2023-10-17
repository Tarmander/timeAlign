create or replace function get_user(user_id bigint)
returns table (id bigint, username varchar(255), email varchar(255), first_name varchar(255), last_name varchar(255)) as $$
	select id, username, email, first_name, last_name
	from users
	where id=user_id;
$$ language sql;