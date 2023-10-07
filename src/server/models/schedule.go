package models

import "time"

type Schedule struct {
	Id        int                `json:"id"`
	Setttings ScheduleSettings   `json:"settings"`
	Users     []User             `json:"users"`
	Times     map[int][]TimePair `json:"times"`
}

type ScheduleSettings struct {
}

type TimePair struct {
	StartTime time.Time `json:"startTime"`
	EndTime   time.Time `json:"endTime"`
}
