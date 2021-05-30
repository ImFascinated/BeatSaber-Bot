/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 30/05/2021
 */

import mongoose, { Connection } from 'mongoose'

import Events from '../Enums/Events'
import BSBotClient from "../Client/BSBotClient";

const results: {
    [name: number]: string
} = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
}

const mongo = async (
    mongoPath: string,
    instance: BSBotClient,
    dbOptions = {}
) => {
    await mongoose.connect(mongoPath, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        ...dbOptions,
    })

    const { connection } = mongoose
    const state = results[connection.readyState] || 'Unknown'
    instance.emit(Events.DATABASE_CONNECTED, connection, state)
}

export const getMongoConnection = (): Connection => {
    return mongoose.connection
}

export default mongo