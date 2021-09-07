import 'reflect-metadata'
import express from 'express'
import * as http from 'http'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import cors from 'cors'
import config from 'config'
import Container from 'typedi'
// Custom declarations
import './db/connection'
import './extensions/request.extension'
import './controllers/users.controller'
import { Logger } from './logger/logger'
import { UsersMiddleware } from './middlewares/auth.middleware'
import { router } from './decorators/controller.decorator'

const app: express.Application = express()
const server: http.Server = http.createServer(app)
const serverConfig: { port: number } = config.get('server')
const logger: winston.Logger = Logger.getLogger

app.use(express.json())
app.use(cors())

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
}

if (process.env.NODE_ENV === 'development') {
    loggerOptions.meta = false
}
app.use(expressWinston.logger(loggerOptions))

const usersMiddleware = Container.get(UsersMiddleware)
app.use('/api', usersMiddleware.validateSession())
app.use(router)

server.listen(serverConfig.port, () => {
    logger.info(`Server running at http://localhost:${serverConfig.port}`)
})