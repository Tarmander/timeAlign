select * from calendars 
where id in (
	select distinct c.id
from calendars as c
join schedules as s on c.id = s.calendarid
join users as u on u.id = s.user_id
where u.id = 1
)