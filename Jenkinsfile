pipeline {
    agent any

    stages {
        stage('Prepare Workspace') {
            steps {
                echo 'Cleaning workspace'
                sh 'rm -rf node_modules package-lock.json'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo 'Skipping tests for now'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}