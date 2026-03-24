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
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}