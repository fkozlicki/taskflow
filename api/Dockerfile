FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
COPY target/api-0.0.1-SNAPSHOT.jar api.jar
ENTRYPOINT ["java", "-jar", "/api.jar"]