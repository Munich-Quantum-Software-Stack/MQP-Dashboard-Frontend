pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                npm run build:test
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