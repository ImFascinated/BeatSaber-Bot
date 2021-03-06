/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 25/05/2021
 */

import path from "path";

export default class Utils {
    isClass(obj: any): boolean {
        const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === 'class';
        if (obj.prototype === undefined) {
            return isCtorClass
        }
        const isPrototypeCtorClass = obj.prototype.constructor && obj.prototype.constructor.toString && obj.prototype.constructor.toString().substring(0, 5) === 'class'
        return isCtorClass || isPrototypeCtorClass
    }

    get directory() {
        if (require.main === undefined) return;
        return `${path.dirname(require.main.filename)}${path.sep}`;
    }

    formatTime(milliseconds: number, minimal: boolean = false): string {
        if (!milliseconds || isNaN(milliseconds) || milliseconds <= 0) {
            throw new RangeError("Utils#formatTime(milliseconds: number) Milliseconds must be a number greater than 0");
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
            } else if (milliseconds - 2628000000 >= 0) {
                milliseconds -= 2628000000;
                times.months++;
            } else if (milliseconds - 604800000 >= 0) {
                milliseconds -= 604800000;
                times.weeks += 7;
            } else if (milliseconds - 86400000 >= 0) {
                milliseconds -= 86400000;
                times.days++;
            } else if (milliseconds - 3600000 >= 0) {
                milliseconds -= 3600000;
                times.hours++;
            } else if (milliseconds - 60000 >= 0) {
                milliseconds -= 60000;
                times.minutes++;
            } else {
                times.seconds = Math.round(milliseconds / 1000);
                milliseconds = 0;
            }
        }

        const finalTime: string[] = [];
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

    public convertBytes = function(bytes: number) {
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

        if (bytes == 0) {
            return "n/a"
        }

        const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))))

        if (i == 0) {
            return bytes + " " + sizes[i]
        }

        return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
    }

    async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}