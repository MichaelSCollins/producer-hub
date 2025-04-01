package mike.dev.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http.authorizeHttpRequests { auth ->
                auth
                    .requestMatchers(
                        "/api/audio/**",
                        "/api/audio/update",
                        "/api/audio/healthcheck",
                        "/api/healthcheck"
                    ).permitAll()
                    .anyRequest().permitAll() // Public access for these endpoints
            }
            .cors { corsConfigurationSource() } // Enable CORS with custom configuration
            .csrf { it.disable() } // Disable CSRF (configure as needed)

        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:3000", "http://localhost:3003") // No wildcard
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf(
            "Authorization", 
            "Content-Type",
            "x-user-id"
        )
        configuration.allowCredentials = true
        configuration.exposedHeaders = listOf("x-user-id")

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}
