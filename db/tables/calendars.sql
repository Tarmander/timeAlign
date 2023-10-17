create table if not exists calendars(
    id serial primary key,
    title varchar(255) not null,
    admin_id integer references users (id),
    created_at timestamp default now()
);