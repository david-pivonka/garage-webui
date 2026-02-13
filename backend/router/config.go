package router

import (
	"khairul169/garage-webui/utils"
	"net/http"
	"os"
)

type Config struct{}

type ConfigResponse struct {
	S3API        interface{} `json:"s3_api"`
	S3Web        interface{} `json:"s3_web"`
	ShareBaseURL string      `json:"share_base_url,omitempty"`
}

func (c *Config) GetAll(w http.ResponseWriter, r *http.Request) {
	config := utils.Garage.Config
	resp := ConfigResponse{
		S3API:        config.S3API,
		S3Web:        config.S3Web,
		ShareBaseURL: os.Getenv("SHARE_BASE_URL"),
	}
	utils.ResponseSuccess(w, resp)
}
