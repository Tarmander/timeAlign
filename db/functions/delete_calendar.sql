create or replace function delete_calendar(cal_id bigint)
returns void as $$
	delete from schedules as s where s.cal_id = cal_id;
	delete from calendars where id = cal_id;
$$ language sql; 