create or replace function add_calendar(cal_title varchar(255), cal_admin bigint)
returns void as $$
	insert into calendars(title, admin_id)
	values (cal_title, cal_admin);
$$ language sql;