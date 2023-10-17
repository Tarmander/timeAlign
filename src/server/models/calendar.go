package models

type Calendar struct {
	Id        int              `json:"id"`
	Title     string           `json:"title"`
	Admin     int              `json:"admin,omitempty"`
	Setttings CalendarSettings `json:"settings"`
	Schedules []Schedule       `json:"schedules"`
}

type CalendarSettings struct {
}
