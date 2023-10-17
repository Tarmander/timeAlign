create or replace function get_user_calendars(user_id bigint)
returns table (id bigint, name varchar(255), admin_id bigint) as $$
	select id, title, admin_id from calendars as c
	join user_calendars as uc on c.id = uc.cal_id
	where uc.user_id = user_id;
$$ language sql;