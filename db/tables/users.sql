create table if not exists users(
    id serial primary key,
    username varchar(255) not null,
    pass  varchar(255) not null,
    email varchar(255),
    first_name varchar(255),
    last_name varchar(255),
    created_at timestamp default now(),
    unique (username)
);