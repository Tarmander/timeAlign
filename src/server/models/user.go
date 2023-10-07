package models

type User struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	First    string `json:"first"`
	Last     string `json:"last"`
}
