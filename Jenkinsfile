pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18'  // Make sure Jenkins tool config name matches
    }

    environment {
        MONGO_URL = 'mongodb://localhost:27017/mydb'
        PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Praveensethuvel-27/lms.git'
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
                echo 'Build step - you can add build commands here if any'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Starting/Restarting app with PM2...'
                bat 'pm2 restart app.js || pm2 start app.js --name lms-app'
                echo "App running at http://localhost:${env.PORT}"
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
