/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 30/05/2021
 */

import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    _id: String,
    scoreSaberId: String,
    lastScore: Array,
    scoreFeedChannelId: String,

    playerInfo: {
        personal: {
            age: Number,
            height: Number,
            weight: Number,
            Gender: String,
        },
        hardware: {
            headset: String,
            controllers: String
        },
        settings: {
            sabers: String,
            favouriteMods: Array,
            customNotes: String,
            avatar: String,
            height: Number,
            noteColor: {
                left: String,
                right: String
            },
            desc: String,
            leftController: {
                position: {
                    x: Number,
                    y: Number,
                    z: Number,
                },
                rotation: {
                    x: Number,
                    y: Number,
                    z: Number,
                }
            },
            rightController: {
                position: {
                    x: Number,
                    y: Number,
                    z: Number,
                },
                rotation: {
                    x: Number,
                    y: Number,
                    z: Number,
                }
            }
        }
    }
});

export default mongoose.model('users', Schema);