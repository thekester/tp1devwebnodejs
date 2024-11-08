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
├── actions-runner/             # For the github workflow
├── bdd/
│   └── tavenel.db
├── views/
│   └── 404.pug
│   └── achats.pug
│   └── admin.pug
│   └── index.pug
│   └── product.pug
│
├── public/
│   └── code/
│       └── jquery.min.js
│   └── images/
│       └── clavier-zeta.png
│       └── favicon.ico
│       └── montre-zeta.png
│       └── ordinateurbeta.png
│       └── smarthpone-alpha.png
│       └── souris-eta.png
│   └── style/
│       └── 404.css
│       └── admin.css
│       └── index.css
│       └── produit.css
│
├── images/
│   └── listdesproduitstp1ex1.png # Image for ex1q1
│
├── gifs/
│   └── ex1q2.gif                # GIF for ex1q2 

│
└── node_modules/              # Generated automatically after `npm install`
```

## Setting Up the Project

1. **Create the Project Directories**:
   ```sh
   mkdir -p docker-node-docker/views
   mkdir -p docker-node-docker/public/code
   mkdir -p docker-node-docker/images
   mkdir -p docker-node-docker/gifs
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
   npm install express pug sqlite3 dotenv
   ```

5. **Optional Install Nodemon as a Development Dependency**:
   ```sh
      npm install --save-dev nodemon
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

## Alternative Method with Docker Compose

1. **Build and Run Using Docker Compose**:
   ```sh
   docker-compose build
   docker-compose up -d
   ```

2. **View Logs**:
   ```sh
   docker-compose logs -f
   ```

## Simple Method to Start the Application

1. **Run Node Application Directly**:
   ```sh
   node app.js
   ```

## Another Method: Using GitHub Self-Hosted Runner

1. **Set up a self-hosted GitHub Runner** to test the application during a CI/CD pipeline.
   - Configure the runner to test the application for 40 seconds before completing the pipeline.
   
2. **Reference for Setup**: [GitHub Actions and PM2 Auto-Deploy](https://medium.com/@realshamshod01/set-up-auto-deploy-for-node-js-app-just-in-4-steps-using-github-actions-and-pm2-7d192fbd2c37)

## Example Branch Management

1. **Switch to Docker Environment Branch**:
   ```sh
   git checkout -b CreateTheDockerEnvironment origin/CreateTheDockerEnvironment
   ```
   
   This will set up a new branch `CreateTheDockerEnvironment` that tracks `origin/CreateTheDockerEnvironment`.

## My Progress

In this section, you can track progress made throughout the project.

### Exercise 1, Question 1 (ex1q1)
![Example 1 - Question 1](images/listedesproduitstp1ex1.png)

### Exercise 1, Question 2 (ex1q2) and question3 (ex1q3)
![Example 1 - Question 2](gifs/ex1q2.gif)
![Example 1 - Question 2](gifs/listedesproduitsex1q2.mp4)

### Exercise 1, Question 4 (ex1q4)
![Exercise 1 - Question 4](gifs/ex1q4.gif)
![Exercise 1 - Question 4](gifs/ex1q4.mp4)

### Exercise 1, Question 5 (ex1q5)
![Exercise 1 - Question 5](gifs/ex1q5.gif)
![Exercise 1 - Question 5](gifs/ex1q5.mp4)

### Exercise 1, Question 6 (ex1q6)
![Exercise 1 - Question 6](gifs/ex1q6.gif)
![Exercise 1 - Question 6](gifs/ex1q6.mp4)

### Exercise 2, Question 1 (ex2q1)
### Exercise 2, Question 2 (ex2q2)
![Exercise 2 - Question 2](gifs/ex2q2.mp4)

### Exercise 2, Question 3 (ex2q3)
![Exercise 2 - Question 2](gifs/ex2q3.mp4)

### Exercise 2, Question 4 (ex2q4)
![Exercise 2 - Question 2](gifs/ex2q4.mp4)

### Execution of the CI/CD pipeline with self-host runner in github

https://youtu.be/FfZZgWvjeGA

## Additional Notes

- Ensure that Docker is running on your system to build and run the container.
- The `views/` folder contains `.pug` files for templating, and the `public/` folder holds static files such as JavaScript.
- The `images/` folder contains images that can be used in your application.
  - Image for `ex1q1` is `listdesproduitstp1ex1.png`.
- The `gifs/` folder contains animations that can be used for visual effect.
  - GIF for `ex1q2` is `ex1q2.gif`.
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
  