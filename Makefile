VERSION=0.1
BUILD_DIR=bin
BINARY_NAME=timeAlign_$(VERSION)

build:
	@if [ ! -d $(BUILD_DIR) ]; then mkdir $(BUILD_DIR); fi
	go build -o $(BUILD_DIR)/$(BINARY_NAME) src/server/main.go

run: build
	./$(BUILD_DIR)/$(BINARY_NAME)

test:
	go test -v ./...

clean:
	rm -rf $(BUILD_DIR)

up:
	docker-compose down
	docker-compose up

down:
	docker-compose down