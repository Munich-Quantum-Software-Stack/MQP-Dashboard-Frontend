pipeline {
    agent any

    stages {
        stage('Verify tooling') {
            steps {
                echo 'Verifying tooling...'
                sh '''
                   npm -v
                   node -v
                   docker info
                   docker version
                   docker compose version
                   curl --version
                '''
            }
        }
        stage('Prune Docker data') {
            steps {
                echo 'Cleaning up...'
                sh 'docker system prune -a --volumes -f'
            }
        }
        stage('Start Containers') {
            steps {
                echo 'Starting containers...'
                sh 'docker compose up -d --no-colors --wait'
                sh 'docker compose ps'
            }
        }
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
    post {
        always {
            echo 'Cleaning up...'
            sh 'docker compose down --volumes --remove-orphans'
            sh 'docker compose ps'
        }
    }
}