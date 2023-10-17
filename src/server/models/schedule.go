package models

import (
	"errors"
	"time"
)

const minOffset int = -12
const maxOffset int = 14

type Schedule struct {
	UserId   int        `json:"userid"`
	Username string     `json:"username"`
	Times    []TimePair `json:"times"`
}

func (s *Schedule) ConvertTimesToUTC(offset int) {
	for _, v := range s.Times {
		v.StartTime.Add(time.Duration(-offset) * time.Hour)
		v.EndTime.Add(time.Duration(-offset) * time.Hour)
	}
}

func (s *Schedule) ConvertTimesFromUTC(offset int) {
	for _, v := range s.Times {
		v.StartTime.Add(time.Duration(-offset) * time.Hour)
		v.EndTime.Add(time.Duration(-offset) * time.Hour)
	}
}

type TimePair struct {
	StartTime time.Time `json:"startTime"`
	EndTime   time.Time `json:"endTime"`
}

func ValidateOffset(offset int) error {
	if offset < minOffset || offset > maxOffset {
		return errors.New("Offset is not a valid timezone offset")
	}

	return nil
}
