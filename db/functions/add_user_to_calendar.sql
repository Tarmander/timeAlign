create or replace function add_user_to_calendar(user_id bigint, cal_id bigint)
returns void as $$
	insert into user_calendars(user_id, cal_id)
	values (user_id, cal_id);
$$ language sql;