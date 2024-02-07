FROM openjdk:17-jdk-oraclelinux7
#FROM openjdk:17

RUN yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm && \
    yum install -y https://download1.rpmfusion.org/free/el/rpmfusion-free-release-7.noarch.rpm && \
    yum install -y ffmpeg

ARG JAR_FILE=/build/libs/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]