pipeline {
    agent any

    stages {
        stage('Prepare Workspace') {
            steps {
                echo 'Fixing permissions and cleaning workspace'
                sh '''
                sudo chown -R $(whoami):$(whoami) .
                rm -rf node_modules package-lock.json
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies'
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo 'Skipping tests for now'
                // sh 'npm test -- --passWithNoTests'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the React app'
                sh 'npm run build'
            }
        }
    }
}