import winston from "winston";
import config from "config";

export class Logger {
    private static logger: winston.Logger
    private constructor() {
    }

    public static get getLogger() {
        if (!this.logger) {
            const loggerConfig: { level: string } = config.get('logger')
            const loggerOptions: winston.LoggerOptions = {
                level: loggerConfig.level || 'info',
                transports: [new winston.transports.Console()],
                format: winston.format.combine(
                    winston.format.json(),
                    winston.format.prettyPrint(),
                    winston.format.colorize({ all: true })
                ),
            }
            this.logger = winston.createLogger(loggerOptions)
        }
        return this.logger
    }
}
