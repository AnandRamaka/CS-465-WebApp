import type { Caption } from "./captions";
import { VideoController } from "./video";

export class Editor {
    private _video: VideoController;
    private _captions: Caption[];
    private _currentIdx: number;
    private _navigationListeners: ((currentIdx: number) => void)[];
    private _settings: { [key: string]: any } = {};;

    public constructor(captions: Caption[], settings: { [key: string]: any }) {
        this._video = new VideoController();
        this._captions = captions;
        this._currentIdx = 0;
        this._navigationListeners = [];
        this._settings = settings;
    }

    get video(): VideoController {
        return this._video;
    }

    get captions(): Caption[] {
        return this._captions;
    }

    get currentIdx(): number {
        return this._currentIdx;
    }

    get currentCaption(): Caption {
        return this._captions[this._currentIdx];
    }

    get settings(): { [key: string]: any } {
        return this._settings;
    }

    next() {
        while (this._currentIdx < this._captions.length - 1) {
            this._currentIdx += 1;
            if (this._captions[this._currentIdx].score <= this._settings['mediumAccuracyThreshold']) {
                break;
            }
        }
        for (const fn of this._navigationListeners) {
            fn(this._currentIdx);
        }
    }

    previous() {
        while (this._currentIdx > 0) {
            this._currentIdx -= 1;
            if (this._captions[this._currentIdx].score <= this._settings['mediumAccuracyThreshold']) {
                break;
            } 
        }
        for (const fn of this._navigationListeners) {
            fn(this._currentIdx);
        }
    }

    addNavigationListener(fn: (currentIdx: number) => void) {
        this._navigationListeners.push(fn);
    }

    setCaption(caption: Caption, idx: number): void {
        this._captions[idx] = caption;
    }

    setSettings(settings: { [key: string]: any }): void {
        this._settings = settings;
    }
}
