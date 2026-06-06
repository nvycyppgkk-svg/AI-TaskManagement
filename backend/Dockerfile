FROM eclipse-temurin:25-jdk AS builder
WORKDIR /app
COPY gradle/ gradle/
COPY gradlew .
COPY settings.gradle .
COPY build.gradle .
RUN ./gradlew dependencies --no-daemon

COPY src/ src/
RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
