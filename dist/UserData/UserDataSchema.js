"use strict";
/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 30/05/2021
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('users', Schema);
