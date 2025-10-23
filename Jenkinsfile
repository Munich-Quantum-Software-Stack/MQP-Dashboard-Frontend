pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'npm install env-cmd'
                sh 'npm run build:test'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                echo 'Test suite not implemented yet'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                sh 'whoami'
                sh 'rm -rf /var/jenkins_home/deployments/mqp-dashboard-frontend/*'
                sh 'cp -r build/* /var/jenkins_home/deployments/mqp-dashboard-frontend/'
            }
        }
    }
}