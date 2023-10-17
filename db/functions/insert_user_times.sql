create or replace function insert_user_times(user_id bigint, cal_id bigint, _start_times timestamp[], _end_times timestamp[])
returns void as $$
	insert into schedules(user_id, cal_id, start_time, end_time)
    select user_id, cal_id, unnest(_start_times), unnest(_end_times);
$$ language sql;