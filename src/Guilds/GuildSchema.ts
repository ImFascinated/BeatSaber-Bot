/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 30/05/2021
 */

import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    _id: String,
    prefix: String,
    embedColor: String
});

export default mongoose.model('guilds', Schema);