package controllers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"timeAlign/models"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserController struct {
	Db *pgxpool.Pool
}

func (uc *UserController) RegisterEndpoints(r *gin.Engine) {
	r.GET("/users/:userid", uc.getUser)
	r.POST("/users", uc.addUser)
	r.GET("/users/:userid/calendars", uc.getUserCalendars)
}

func (uc *UserController) getUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("userid"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": fmt.Sprintf("User ID: {%d} is not a valid id.", id)})
		log.Printf("Bad request, error: %s", err)
		return
	}

	var user models.User
	query := `select id, username, email, first_name, last_name 
	from users 
	where id=$1`
	err = uc.Db.QueryRow(context.Background(), query, id).Scan(&user.Id, &user.Username, &user.Email, &user.First, &user.Last)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": fmt.Sprintf("User ID: {%d} doesn't exist.", id)})
		log.Printf("Bad request, error: %s", err)
		return
	}

	c.JSON(http.StatusOK, user)
}

func (uc *UserController) addUser(c *gin.Context) {
	var newUser models.User
	err := c.Bind(newUser)

	if err != nil {
		log.Printf("Invalid request to add a new user")
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": err})
		return
	}

	query := `insert into users(username, pass, email, first_name, last_name)
	values ($1, $2, $3, $4, $5)`

	_, err = uc.Db.Exec(context.Background(), query, newUser.Username, newUser.Email, newUser.First, newUser.Last)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"Error": err})
		return
	}

	c.Status(http.StatusOK)
}

func (uc *UserController) getUserCalendars(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("userid"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": "Invalid user id"})
		return
	}

	query := `select id, name, admin_id from calendars 
	where id in (
		select distinct c.id
	from calendars as c
	join schedules as s on c.id = s.calendarid
	join users as u on u.id = s.user_id
	where u.id = $1
	)`
	rows, err := uc.Db.Query(context.Background(), query, id)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"Error": "User ID doesn't exist"})
		return
	}

	var calendars []models.Calendar
	for rows.Next() {
		var calendar models.Calendar
		err := rows.Scan(&calendar.Id, &calendar.Name, &calendar.Admin)
		if err != nil {
			log.Printf("Bad row in get user calendars query")
		}
		calendars = append(calendars, calendar)
	}

	c.JSON(http.StatusOK, calendars)
}
