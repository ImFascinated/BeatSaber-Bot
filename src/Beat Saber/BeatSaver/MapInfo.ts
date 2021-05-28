/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */
import {MapMetadata} from "./MapMetadata";
import {MapStats} from "./MapStats";
import {MapUploader} from "./MapUploader";

export interface MapInfo {
    metadata: MapMetadata
    stats: MapStats
    description: string
    deletedAt: any
    _id: string
    key: string
    name: string
    uploader: MapUploader[]
    hash: string
    uploaded: string
    directDownload: string
    downloadURL: string
    coverURL: string
}