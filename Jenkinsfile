timeout(time: 20, unit: 'MINUTES') {
node() {
stage('Code Checkout') {
    sh " rm -rf *" 
    sh " docker system prune -af"
    sh 'git clone https://github.com/srijondasgit/elearning-core.git'
    
}
dir('elearning-core') {
stage('Copy prod configuration') {
    sh " pwd"
    sh "cp /opt/appsecrets/application.yml.prod ./src/main/resources/application.yml"
}

stage('Docker Login') {
    withCredentials([string(credentialsId: 'dhub_user', variable: 'USERID'),string(credentialsId: 'dhub_pwd', variable: 'PASSWORD')]) {
        sh "docker login -u ${USERID} -p ${PASSWORD}"

    }
}

stage('Docker Build') {
    sh "docker build -t core-gitanjali ."
}
stage('Tag Image') {
    sh "docker tag core-gitanjali:latest srijondas/production-core-gitanjali:latest"
}
stage('Pushing Image To DockerHub') {
 sh " docker push srijondas/production-core-gitanjali:latest"
}
}
}
}