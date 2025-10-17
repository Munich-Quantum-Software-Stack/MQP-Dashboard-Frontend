pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                npm run build:production
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}