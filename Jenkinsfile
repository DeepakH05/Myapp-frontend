pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
               // sh 'npm test -- --passWithNoTests'
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