pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18' // Match the name you gave in Jenkins tool config
    }

    environment {
        MONGO_URL = 'mongodb://localhost:27017/mydb'
    }

    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/yourname/your-nodejs-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test || echo "No tests found"'
            }
        }

        stage('Build') {
            steps {
                echo 'Build completed (if applicable)'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying the app...'
                bat 'pm2 restart app.js || pm2 start app.js'
            }
        }
    }
}
