pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                bat 'npm install'
                bat 'pm2 start app.js --name lms-app || pm2 restart lms-app'
                echo '🔗 LMS App running at http://localhost:3000'
            }
        }
    }
}
