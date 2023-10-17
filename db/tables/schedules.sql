create table if not exists schedules(
    user_id integer  not null,
    cal_id integer not null,
    start_time timestamp not null,
    end_time timestamp not null,
    created_at timestamp default now(),
    primary key (user_id, cal_id, start_time),
    foreign key (user_id, cal_id) references user_calendars(user_id, cal_id)
);