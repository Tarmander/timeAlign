create table if not exists users(
    id serial primary key,
    username varchar(255) not null,
    pass  varchar(255) not null,
    email varchar(255),
    first_name varchar(255),
    last_name varchar(255),
    created_at timestamp default now()
);

create table if not exists calendars(
    id serial primary key,
    name varchar(255) not null,
    admin_id integer references users (id) not null,
    created_at timestamp default now()
);

create table if not exists schedules(
    id bigserial primary key,
    user_id integer references users (id) not null,
    calendarid integer references calendars (id) not null,
    start_time timestamp not null,
    end_time timestamp not null,
    created_at timestamp default now()
);


insert into users(username, pass, email, first_name, last_name)
values ('Tarmander', 'bigbootymix69!', 'kevdawg@yahoo.io', 'Kevin', 'Tarhan'),
('Whitetop7', 'tannershreds420xx$', 'tanman@john.legend', 'Tanner', 'Lee'),
('Reese', 'SizeDoesntMatterSheStillThinksImFly', 'rtb@crypto.com', 'Reese', 'Tobaben');

insert into calendars(name, admin_id)
values ('TestCalendar', 1);

insert into schedules(user_id, calendarid, start_time, end_time)
values (1, 1, NOW() - interval '1 hour', NOW()),
(1, 1, NOW() - interval '3 hour', NOW() - interval '1.5 hour'),
(1, 1, NOW() - interval '12 hour', NOW() - interval '8 hour'),
(2, 1, NOW() - interval '5 hour', NOW() - interval '2 hour'),
(2, 1,NOW() - interval '16 hour', NOW() - interval '15 hour'),
(2, 1, NOW() - interval '1 day' - interval '2 hours', NOW() - interval '1 day'),
(3, 1, NOW() - interval '16 hour', NOW() - interval '2 hour'),
(3, 1, NOW() - interval '2 days', NOW() - interval '1 day' - interval '16 hour'),
(3, 1, NOW() - interval '3 hour', NOW() - interval '1.5 hour');
