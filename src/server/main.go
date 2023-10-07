package main

import (
	"context"
	"log"
	"os"
	"timeAlign/controllers"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	dbPool, err := pgxpool.New(context.Background(), "postgres://root:borpamojito@localhost:5432/ta_local_db")
	if err != nil {
		log.Printf("Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	router := gin.Default()

	userController, calendarController := controllers.UserController{Db: dbPool}, controllers.CalendarController{Db: dbPool}
	userController.RegisterEndpoints(router)
	calendarController.RegisterEndpoints(router)

	router.Run(":8080")
}

type User struct {
}
