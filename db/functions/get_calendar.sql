create or replace function get_calendar(cal_id bigint)
returns table (id bigint, username varchar(255), start_time timestamp, end_time timestamp) as $$
	select u.id, u.username, start_time, end_time
	from schedules as s 
	join users as u on s.user_id = u.id
	where s.cal_id = cal_id
	order by start_time;
$$ language sql;