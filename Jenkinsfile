pipeline {
    agent any

    environment {
        SONARQUBE_SERVER = "SonarQube"
        AWS_REGION = "us-east-1"
        ACCOUNT_ID = "102080400716"
        IMAGE_NAME = "my-react-app"
        REPO_URI = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_NAME}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

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
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    sh '''
                    npx sonar-scanner \
                    -Dsonar.projectKey=my-react-app \
                    -Dsonar.sources=src \
                    -Dsonar.host.url=http://43.204.145.245:9000/ \
                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo 'Waiting for SonarQube Quality Gate result'
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image'
                sh 'docker build -t my-react-app .'
                echo 'Docker Image Created Successfully'
                sh 'docker images | grep my-react-app'
            }
        }

        stage('Push to ECR') {
            steps {
                echo 'Pushing image to ECR'
                sh '''
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

                docker tag $IMAGE_NAME:latest $REPO_URI:latest

                docker push $REPO_URI:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully'
        }
        failure {
            echo 'Pipeline failed'
        }
        always {
            echo 'Cleaning workspace after pipeline run'
            cleanWs()
        }
    }
}