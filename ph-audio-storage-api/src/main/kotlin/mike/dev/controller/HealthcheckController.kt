package mike.dev.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/health")
class HealthcheckController {
    @GetMapping
    fun healthcheck(): String {
        return "I'm healthy and ready to serve requests!"
    }
}