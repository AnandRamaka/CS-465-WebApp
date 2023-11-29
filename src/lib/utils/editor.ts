import type { Caption } from "./captions";
import { VideoController } from "./video";

export class Editor {
    private _video: VideoController;
    private _captions: Caption[];
    private _currentIdx: number;
    private _navigationListeners: ((currentIdx: number) => void)[];

    public constructor(captions: Caption[]) {
        this._video = new VideoController();
        this._captions = captions;
        this._currentIdx = 0;
        this._navigationListeners = [];
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

    next() {
        if (this._currentIdx < this._captions.length) {
            this._currentIdx += 1;
            while (this._currentIdx < this._captions.length) {
                if (this._captions[this._currentIdx].score > 0.8) {
                    this._currentIdx += 1;
                } else {
                    break;
                }
            }
        }
        for (const fn of this._navigationListeners) {
            fn(this._currentIdx);
        }
    }

    previous() {
        if (this._currentIdx > 0) {
            this._currentIdx -= 1;
            while (this._currentIdx < this._captions.length) {
                if (this._captions[this._currentIdx].score > 0.8) {
                    this._currentIdx -= 1;
                } else {
                    break;
                }
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
}
