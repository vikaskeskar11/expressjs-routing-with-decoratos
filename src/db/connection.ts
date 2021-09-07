// put these lines in a separate file
import config from 'config'
import { createConnection } from 'typeorm'
import fs, { PathOrFileDescriptor } from 'fs'
import winston from 'winston'
import { Logger } from '../logger/logger'
import { LoadData } from '../pre-load-data/scripts/load-data'

const logger: winston.Logger = Logger.getLogger

const ormConfig: any = Object.assign({}, config.get('db'))
const password = fs.readFileSync(<PathOrFileDescriptor>ormConfig.password, 'utf-8')
const database = fs.readFileSync(<PathOrFileDescriptor>ormConfig.database, 'utf-8')

ormConfig.password = password
ormConfig.database = database

createConnection(ormConfig).then(() => {
    logger.info('DB Connected', { timestamp: Date.now() })
    new LoadData()
})