# Practical Work with Node.js

## Project Structure

```
docker-node-docker/
│
├── app.js
├── package.json
├── package-lock.json          # Generated automatically after `npm install`
├── Dockerfile
├── .dockerignore              # (Optional but recommended)
│
├── views/
│   └── temp_exemple.pug
│
├── public/
│   └── code/
│       └── jquery.min.js
│
└── node_modules/              # Generated automatically after `npm install`
```

## Setting Up the Project

1. **Create the Project Directories**:
   ```sh
   mkdir -p mon-projet/views
   mkdir -p mon-projet/public/code
   ```

2. **Add jQuery Library**: 
   - Download the jQuery file from: [jQuery 3.7.1](https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js) and save it in the `public/code/` directory.

3. **Initialize Node.js Project**:
   ```sh
   cd docker-node-docker/
   npm init -y
   ```

4. **Install Dependencies**:
   ```sh
   npm install express pug
   ```

## Docker Configuration

1. **Build Docker Image**:
   ```sh
   docker build -t docker-node-docker .
   ```

2. **Run Docker Container**:
   ```sh
   docker run -d -p 5121:5121 --name docker-node-docker-container docker-node-docker
   ```

3. **Access the Container** (optional, for debugging or inspection):
   ```sh
   docker exec -it docker-node-docker-container /bin/bash
   ```

## Branch Management

1. **Switch to Docker Environment Branch**:
   ```sh
   git checkout -b CreateTheDockerEnvironment origin/CreateTheDockerEnvironment
   ```
   
   This will set up a new branch `CreateTheDockerEnvironment` that tracks `origin/CreateTheDockerEnvironment`.

## Additional Notes

- Ensure that Docker is running on your system to build and run the container.
- The `views/` folder contains `.pug` files for templating, and the `public/` folder holds static files such as JavaScript.
- The `Dockerfile` should define how the Docker image is built and include the necessary configuration to expose port 5121.

## Useful Commands

- **Stop the Docker Container**:
  ```sh
  docker stop docker-node-docker-container
  ```

- **Remove the Docker Container**:
  ```sh
  docker rm docker-node-docker-container
  ```

- **Remove the Docker Image**:
  ```sh
  docker rmi docker-node-docker
  
