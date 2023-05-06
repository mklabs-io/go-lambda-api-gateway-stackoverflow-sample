package main

import (
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"log"
)

func main() {
	lambda.Start(handler)
}

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	log.Printf("hello world")
	response := events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       "hello world",
	}
	return response, nil
}

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type ResponseBody struct {
	Message string `json:"username"`
}
