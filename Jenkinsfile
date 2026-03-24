pipeline {
    agent any

    environment {
        SONARQUBE_ENV = 'SonarQube'   // Make sure this matches the SonarQube config in Jenkins
    }

    stages {

        stage('Prepare Workspace') {
            steps {
                echo 'Cleaning workspace'
                sh 'rm -rf node_modules package-lock.json coverage'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies'
                sh 'npm install'
            }
        }

        stage('Run Tests with Coverage') {
            steps {
                echo 'Running tests with coverage'
                sh 'npm test -- --coverage --watchAll=false'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube analysis'
                withSonarQubeEnv("${SONARQUBE_ENV}") {
                    sh '''
                        npx sonar-scanner \
                        -Dsonar.projectKey=my-react-app \
                        -Dsonar.sources=src \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo 'Waiting for SonarQube Quality Gate result'
                timeout(time: 6, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Building the project'
                sh 'npm run build'
            }
        }
    }

    post {
        always {
            echo 'Cleaning workspace after pipeline run'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}