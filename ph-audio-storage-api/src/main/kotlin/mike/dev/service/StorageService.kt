package mike.dev.audioservice.service

import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.core.io.InputStreamResource
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest
import software.amazon.awssdk.services.s3.model.GetObjectRequest
import software.amazon.awssdk.services.s3.model.GetUrlRequest
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.*

interface StorageService {
    fun store(file: MultipartFile): String
    fun load(location: String): Resource?
    fun delete(location: String): Boolean
}

@Service
class S3StorageService(
    @Value("\${cloud.aws.s3.bucket}")
    private val bucketName: String,
    private val s3Client: S3Client
) : StorageService {
    private val logger = KotlinLogging.logger {}

    override fun store(file: MultipartFile): String {
        val key = "audio/${UUID.randomUUID()}${getFileExtension(file.originalFilename)}"
        try {
            val putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.contentType)
                .build()

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.inputStream, file.size))
            return key
        } catch (e: Exception) {
            logger.error(e) { "Failed to store file in S3: ${e.message}" }
            throw StorageException("Failed to store file in S3", e)
        }
    }
    override fun load(location: String): Resource? {
        try {
            val getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(location)
                .build()

            val response = s3Client.getObject(getObjectRequest)
            return InputStreamResource(response)
        } catch (e: Exception) {
            logger.error(e) { "Failed to load file from S3: ${e.message}" }
            return null
        }
    }

    override fun delete(location: String): Boolean {
        return try {
            val deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(location)
                .build()

            s3Client.deleteObject(deleteObjectRequest)
            true
        } catch (e: Exception) {
            logger.error(e) { "Failed to delete file from S3: ${e.message}" }
            false
        }
    }

    private fun getFileExtension(filename: String?): String {
        return filename?.let {
            if (it.contains(".")) {
                it.substring(it.lastIndexOf("."))
            } else {
                ""
            }
        } ?: ""
    }

    private fun getObjectUrl(key: String): String {
        return s3Client.utilities().getUrl(
            GetUrlRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build()).toString()
    }
}

@Service
@ConditionalOnProperty(name = ["storage.type"], havingValue = "local", matchIfMissing = true)
class LocalStorageService(
    @Value("\${storage.location}")
    private val storageLocation: String
) : StorageService {
    private val logger = KotlinLogging.logger {}
    private val root: Path = Paths.get(storageLocation)

    init {
        Files.createDirectories(root)
    }

    override fun store(file: MultipartFile): String {
        val filename = UUID.randomUUID().toString() + getFileExtension(file.originalFilename)
        val targetPath = root.resolve(filename)
        
        try {
            Files.copy(file.inputStream, targetPath)
            return filename
        } catch (e: Exception) {
            logger.error(e) { "Failed to store file locally: ${e.message}" }
            throw StorageException("Failed to store file locally", e)
        }
    }

    override fun load(location: String): Resource? {
        val path = root.resolve(location)
        val resource = UrlResource(path.toUri())

        return if (resource.exists() || resource.isReadable) {
            resource
        } else {
            null
        }
    }

    override fun delete(location: String): Boolean {
        return try {
            Files.deleteIfExists(root.resolve(location))
            true
        } catch (e: Exception) {
            logger.error(e) { "Failed to delete file locally: ${e.message}" }
            false
        }
    }

    private fun getFileExtension(filename: String?): String {
        return filename?.let {
            if (it.contains(".")) {
                it.substring(it.lastIndexOf("."))
            } else {
                ""
            }
        } ?: ""
    }
}

class StorageException : RuntimeException {
    constructor(message: String) : super(message)
    constructor(message: String, cause: Throwable) : super(message, cause)
} 