package mike.dev.project_api.controller

import mike.dev.project_api.dto.*
import mike.dev.project_api.service.ProjectService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(
    origins = ["http://localhost:3000", "http://localhost:3003"],
    allowedHeaders = ["Authorization", "Content-Type", "X-User-Id"],
    exposedHeaders = ["X-User-Id"]
)
class ProjectController(
    private val projectService: ProjectService
) {
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    fun createProject(
        @RequestBody request: CreateProjectRequest,
        @RequestHeader("X-User-Id") userId: String
    ): ProjectDto {
        return projectService.createProject(request, userId)
    }

    @GetMapping("/{id}")
    fun getProject(@PathVariable id: Long): ProjectDto {
        return projectService.getProject(id)
    }

    @GetMapping
    fun getProjectsByUser(@RequestHeader("X-User-Id") userId: String): List<ProjectDto> {
        return projectService.getProjectsByUser(userId)
    }

    @PutMapping("/{id}")
    fun updateProject(
        @PathVariable id: Long,
        @RequestBody @Valid request: UpdateProjectRequest
    ): ProjectDto {
        return projectService.updateProject(id, request)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteProject(@PathVariable id: Long) {
        projectService.deleteProject(id)
    }

    @PostMapping("/{projectId}/channels")
    fun addChannel(
        @PathVariable projectId: Long,
        @RequestBody @Valid request: CreateChannelRequest
    ): ProjectDto {
        return projectService.addChannel(projectId, request)
    }

    @PutMapping("/{projectId}/channels/{channelId}")
    fun updateChannel(
        @PathVariable projectId: Long,
        @PathVariable channelId: Long,
        @RequestBody @Valid request: UpdateChannelRequest
    ): ProjectDto {
        return projectService.updateChannel(projectId, channelId, request)
    }

    @DeleteMapping("/{projectId}/channels/{channelId}")
    fun deleteChannel(
        @PathVariable projectId: Long,
        @PathVariable channelId: Long
    ): ProjectDto {
        return projectService.deleteChannel(projectId, channelId)
    }
} 