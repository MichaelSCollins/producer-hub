package mike.dev.project_api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ProjectStorageApplication

fun main(args: Array<String>) {
    runApplication<ProjectStorageApplication>(*args)
} 