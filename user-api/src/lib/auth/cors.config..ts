import allowedOrigins from './origins.config'
import cors from 'cors'

const notAllowedError = 'Not allowed by CORS'

const corsConfig = cors({
    origin: function (origin, callback) {
        console.log("CORS origin: ", origin)
        if (!origin || allowedOrigins.includes("*"))
        {
            callback(null, true);
        } else
        {
            callback(new Error(notAllowedError));
        }
    },
    credentials: false,
})

export default corsConfig