package mike.dev.project_api.repository

import mike.dev.project_api.model.Project
import org.springframework.data.jpa.repository.JpaRepository

interface ProjectRepository : JpaRepository<Project, Long> {
    fun findByCreatedBy(createdBy: String): List<Project>
} 