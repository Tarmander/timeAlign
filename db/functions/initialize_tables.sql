insert into users(username, pass, email, first_name, last_name)
values ('Tarmander', 'bigbootymix69!', 'kevdawg@yahoo.io', 'Kevin', 'Tarhan'),
('Whitetop7', 'tannershreds420xx$', 'tanman@john.legend', 'Tanner', 'Lee'),
('Reese', 'SizeDoesntMatterSheStillThinksImFly', 'rtb@crypto.com', 'Reese', 'Tobaben');

insert into calendars(title, admin_id)
values ('TestCalendar', 1);

insert into user_calendars(user_id, cal_id)
values (1, 1),
(2, 1),
(3, 1);

insert into schedules(user_id, cal_id, start_time, end_time)
values (1, 1, NOW() - interval '1 hour', NOW()),
(1, 1, NOW() - interval '3 hour', NOW() - interval '1.5 hour'),
(1, 1, NOW() - interval '12 hour', NOW() - interval '8 hour'),
(2, 1, NOW() - interval '5 hour', NOW() - interval '2 hour'),
(2, 1,NOW() - interval '16 hour', NOW() - interval '15 hour'),
(2, 1, NOW() - interval '1 day' - interval '2 hours', NOW() - interval '1 day'),
(3, 1, NOW() - interval '16 hour', NOW() - interval '2 hour'),
(3, 1, NOW() - interval '2 days', NOW() - interval '1 day' - interval '16 hour'),
(3, 1, NOW() - interval '3 hour', NOW() - interval '1.5 hour');