"use strict";
/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 25/05/2021
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
class Utils {
    isClass(obj) {
        const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === 'class';
        if (obj.prototype === undefined) {
            return isCtorClass;
        }
        const isPrototypeCtorClass = obj.prototype.constructor && obj.prototype.constructor.toString && obj.prototype.constructor.toString().substring(0, 5) === 'class';
        return isCtorClass || isPrototypeCtorClass;
    }
    get directory() {
        if (require.main === undefined)
            return;
        return `${path_1.default.dirname(require.main.filename)}${path_1.default.sep}`;
    }
    formatTime(milliseconds, minimal = false) {
        if (!milliseconds || isNaN(milliseconds) || milliseconds <= 0) {
            return "00:00";
            //throw new RangeError("Utils#formatTime(milliseconds: number) Milliseconds must be a number greater than 0");
        }
        const times = {
            years: 0,
            months: 0,
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
        while (milliseconds > 0) {
            if (milliseconds - 31557600000 >= 0) {
                milliseconds -= 31557600000;
                times.years++;
            }
            else if (milliseconds - 2628000000 >= 0) {
                milliseconds -= 2628000000;
                times.months++;
            }
            else if (milliseconds - 604800000 >= 0) {
                milliseconds -= 604800000;
                times.weeks += 7;
            }
            else if (milliseconds - 86400000 >= 0) {
                milliseconds -= 86400000;
                times.days++;
            }
            else if (milliseconds - 3600000 >= 0) {
                milliseconds -= 3600000;
                times.hours++;
            }
            else if (milliseconds - 60000 >= 0) {
                milliseconds -= 60000;
                times.minutes++;
            }
            else {
                times.seconds = Math.round(milliseconds / 1000);
                milliseconds = 0;
            }
        }
        const finalTime = [];
        let first = false;
        for (const [k, v] of Object.entries(times)) {
            if (minimal) {
                if (v === 0 && !first) {
                    continue;
                }
                finalTime.push(v < 10 ? `0${v}` : `${v}`);
                first = true;
                continue;
            }
            if (v > 0) {
                finalTime.push(`${v} ${v > 1 ? k : k.slice(0, -1)}`);
            }
        }
        if (minimal && finalTime.length === 1) {
            finalTime.unshift("00");
        }
        let time = finalTime.join(minimal ? ":" : ", ");
        if (time.includes(",")) {
            const pos = time.lastIndexOf(",");
            time = `${time.slice(0, pos)} and ${time.slice(pos + 1)}`;
        }
        return time;
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.default = Utils;
