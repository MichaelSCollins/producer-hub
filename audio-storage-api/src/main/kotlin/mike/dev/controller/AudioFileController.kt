package mike.dev.controller

import mike.dev.model.AudioFileResponse
import mike.dev.service.AudioFileService
import mu.KotlinLogging
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/audio")
class AudioFileController(private val audioFileService: AudioFileService) {
    private val logger = KotlinLogging.logger {}
    @GetMapping("/healthcheck")
    fun healthcheck(): ResponseEntity<String> {
        return ResponseEntity.ok("Audio Service is running")
    }
    @PostMapping("/upload")
    fun uploadFile(
        @RequestParam("file") file: MultipartFile,
        @RequestParam metadata: Map<String, Any> = mapOf()
    ): ResponseEntity<AudioFileResponse> {
        val response = audioFileService.store(file, metadata)
        return ResponseEntity.ok(response)
    }

    fun uploadFallback(
        file: MultipartFile,
        metadata: Map<String, Any>,
        e: Exception
    ): ResponseEntity<AudioFileResponse> {
        logger.error(e) { "Upload endpoint failed: ${e.message}" }
        return ResponseEntity
            .status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(null)
    }

    @GetMapping("/{id}/download")
    fun downloadFile(
        @PathVariable id: Long
    ): ResponseEntity<Resource> {
        val resource = audioFileService.load(id)
            ?: return ResponseEntity.notFound().build()

//        val audioFile = audioFileService.getMetadata(id)
//            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${resource.filename}\"")
            .body(resource)
    }

    fun downloadFallback(id: String, e: Exception): ResponseEntity<Resource> {
        logger.error(e) { "Download endpoint failed: ${e.message}" }
        return ResponseEntity
            .status(HttpStatus.SERVICE_UNAVAILABLE)
            .build()
    }

    @GetMapping("/{id}/metadata")
    fun getMetadata(@PathVariable id: Long): ResponseEntity<AudioFileResponse> {
        val metadata = audioFileService.getMetadata(id)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(metadata)
    }

    @GetMapping("/{userId}")
    fun listFiles(
        @PathVariable userId: String = "guest"
    ): ResponseEntity<List<AudioFileResponse>> {
        val files = audioFileService.listAll(userId)
        return ResponseEntity.ok(files)
    }

    @DeleteMapping("/{id}")
    fun deleteFile(@PathVariable id: Long): ResponseEntity<Unit> {
        return if (audioFileService.delete(id)) {
            ResponseEntity.ok().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    fun deleteFallback(id: String, e: Exception): ResponseEntity<Unit> {
        logger.error(e) { "Delete endpoint failed: ${e.message}" }
        return ResponseEntity
            .status(HttpStatus.SERVICE_UNAVAILABLE)
            .build()
    }

    @ExceptionHandler(Exception::class)
    fun handleException(e: Exception): ResponseEntity<Map<String, String>> {
        logger.error(e) {
            "Unhandled exception occurred: ${e.message}" }
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(mapOf("error" to (e.message ?: "An unexpected error occurred")))
    }
}
