FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy only what's needed to build
COPY pom.xml mvnw ./
COPY src ./src

# Build the application (skip tests for faster builds; remove -DskipTests for CI production)
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy jar from build
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
