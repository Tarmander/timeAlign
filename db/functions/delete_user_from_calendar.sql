create or replace function delete_calendar(user_id bigint, cal_id bigint)
returns void as $$
	delete from schedules as s
	where s.user_id = user_id and s.cal_id = cal_id
$$ language sql; 

