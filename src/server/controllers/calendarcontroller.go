package controllers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
	"timeAlign/models"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CalendarController struct {
	Db *pgxpool.Pool
}

func (cc *CalendarController) RegisterEndpoints(r *gin.Engine) {
	r.GET("/calendars/:calendarid/schedule", cc.getCalendar)
	r.GET("/calendars/:calendarid/users/:userid", cc.addUser)
	r.POST("/calendars", cc.createCalendar)
	r.POST("/calendars/:calendarid/users/:userid", cc.updateTimes)
	r.DELETE("/calendars/:calendarid", cc.deleteCalendar)
	r.DELETE("/calendars/:calendarid/users/:userid", cc.deleteUser)
}

func (cc *CalendarController) getCalendar(c *gin.Context) {
	calId, err := strconv.Atoi(c.Param("calendarid"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": "Invalid calendar id"})
		return
	}

	var offset int
	offsetStr, exists := c.GetQuery("offset")
	if !exists {
		offset = 0

	} else {
		offset, err = strconv.Atoi(offsetStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": "Invalid time offset"})
			return
		}

		if err = models.ValidateOffset(offset); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": err})
			return
		}
	}

	query := `select * from get_calendar($1)`

	rows, err := cc.Db.Query(context.Background(), query, calId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": "Calendar doesn't exist"})
		return
	}
	defer rows.Close()

	calendar := models.Calendar{Id: calId, Title: "Temp"}
	dataModel := make(map[int]struct {
		username string
		times    []models.TimePair
	})

	for rows.Next() {
		var name string
		var startTime, endTime time.Time
		var userId int

		if err := rows.Scan(&userId, &name, &startTime, &endTime); err != nil {
			log.Printf("Error: %s", err)
			continue
		}

		startTime.Format(time.RFC3339)
		endTime.Format(time.RFC3339)

		if err != nil {
			log.Print(err)
		}

		pair := models.TimePair{StartTime: startTime, EndTime: endTime}
		if entry, ok := dataModel[userId]; !ok {
			dataModel[userId] = struct {
				username string
				times    []models.TimePair
			}{
				username: name,
				times:    []models.TimePair{pair}}
		} else {
			entry.times = append(entry.times, pair)
			dataModel[userId] = entry
		}
	}

	for k, v := range dataModel {
		sched := models.Schedule{UserId: k, Username: v.username, Times: v.times}
		sched.ConvertTimesFromUTC(offset)
		calendar.Schedules = append(calendar.Schedules, sched)
	}

	c.IndentedJSON(http.StatusOK, calendar)
}

func (cc *CalendarController) createCalendar(c *gin.Context) {
	var newCalendar models.Calendar
	err := c.Bind(newCalendar)

	if err != nil {
		log.Printf("Invalid request to add a new calendar")
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": err})
		return
	}

	query := `select from add_calendar($1, $2)`

	_, err = cc.Db.Exec(context.Background(), query, newCalendar.Title, newCalendar.Admin)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"Error": err})
		return
	}

	c.Status(http.StatusOK)
}

func (cc *CalendarController) deleteCalendar(c *gin.Context) {
	calId, err := strconv.Atoi(c.Param("calendarid"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": "Invalid calendar id"})
		return
	}

	query := `select delete_calendar($1)`

	_, err = cc.Db.Exec(context.Background(), query, calId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"Error": err})
		return
	}

	c.Status(http.StatusOK)
}

func (cc *CalendarController) addUser(c *gin.Context) {
	calId, err := strconv.Atoi(c.Param("calendarid"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": "Invalid calendar id"})
		return
	}

	userId, err := strconv.Atoi(c.Param("userid"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": "Invalid calendar id"})
		return
	}

	query := `select from add_user_to_calendar($1, $2)`

	_, err = cc.Db.Exec(context.Background(), query, userId, calId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"Error": err})
		return
	}

	c.Status(http.StatusOK)
}

func (cc *CalendarController) updateTimes(c *gin.Context) {
	var schedule models.Schedule
	err := c.Bind(schedule.Times)
	if err != nil {
		log.Printf("Invalid json body to update times request")
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": err})
		return
	}

	userId, err := strconv.Atoi(c.Param("userid"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": fmt.Sprintf("User ID: {%d} is not a valid id.", userId)})
		log.Printf("Bad request, error: %s", err)
		return
	}

	calId, err := strconv.Atoi(c.Param("calendar"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": fmt.Sprintf("User ID: {%d} is not a valid id.", calId)})
		log.Printf("Bad request, error: %s", err)
		return
	}

	schedule.ConvertTimesToUTC(0) //TODO this needs to be a legitimate offset

	var startTimes []time.Time
	var endTimes []time.Time

	for _, v := range schedule.Times {
		startTimes = append(startTimes, v.StartTime)
		endTimes = append(endTimes, v.EndTime)
	}

	query := `select from insert_user_times($1, $2, $3, $4)`

	_, err = cc.Db.Exec(context.Background(), query, userId, calId, startTimes, endTimes)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"Error": err})
		return
	}

	c.Status(http.StatusOK)
}

func (cc *CalendarController) deleteUser(c *gin.Context) {
	userId, err := strconv.Atoi(c.Param("userid"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": fmt.Sprintf("User ID: {%d} is not a valid id.", userId)})
		log.Printf("Bad request, error: %s", err)
		return
	}

	calId, err := strconv.Atoi(c.Param("calendar"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": fmt.Sprintf("User ID: {%d} is not a valid id.", calId)})
		log.Printf("Bad request, error: %s", err)
		return
	}

	query := `select from delete_user_from_calendar($1, $2)`

	_, err = cc.Db.Exec(context.Background(), query, userId, calId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"Error": err})
		return
	}

	c.Status(http.StatusOK)
}
