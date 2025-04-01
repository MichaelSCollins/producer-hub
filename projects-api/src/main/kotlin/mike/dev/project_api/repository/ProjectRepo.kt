package mike.dev.project_api.repository

import mike.dev.project_api.model.Project
import org.springframework.data.jpa.repository.JpaRepository

interface ProjectRepo : JpaRepository<Project, Long> {
    fun findByCreatedBy(createdBy: String): List<Project>
} 