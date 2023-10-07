package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CalendarController struct {
	Db *pgxpool.Pool
}

func (gc *CalendarController) RegisterEndpoints(r *gin.Engine) {
	r.GET("/Calendars/:Calendarid/", gc.getCalendarTimes)
	r.POST("/Calendars", gc.createCalendar)
	r.DELETE("/Calendars", gc.deleteCalendar)
	r.POST("/Calendars/:Calendarid", gc.updateCalendarTimes)
}

func (gc *CalendarController) getCalendarTimes(c *gin.Context) {
}

func (gc *CalendarController) createCalendar(c *gin.Context) {
}

func (gc *CalendarController) deleteCalendar(c *gin.Context) {

}

func (gc *CalendarController) updateCalendarTimes(c *gin.Context) {
}
