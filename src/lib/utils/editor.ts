import type { Caption } from "./captions";
import { VideoController } from "./video";

export class Editor {
    private _video: VideoController;
    private _captions: Caption[];
    private _currentIdx: number;
    private _prevIdx: number;
    private _navigationListeners: ((currentIdx: number, prevIdx: number) => void)[];
    private _advancedMode: boolean;
    private _uncertaintyThreshold: number;

    public constructor(captions: Caption[]) {
        this._video = new VideoController();
        this._captions = captions;
        this._currentIdx = 0;
        this._prevIdx = this.currentIdx;
        this._navigationListeners = [];
        this._advancedMode = false;
        this._uncertaintyThreshold = 0.7;
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

    get prevIdx(): number {
        return this._prevIdx;
    }

    get currentCaption(): Caption {
        return this._captions[this._currentIdx];
    }

    next() {
        this._captions[this._currentIdx].edited = true;
        this._prevIdx = this.currentIdx;
        while (this._currentIdx < this._captions.length - 1) {
            this._currentIdx += 1;
            if (this._advancedMode || this._captions[this._currentIdx].score < this._uncertaintyThreshold) {
                break;
            }
        }
        for (const fn of this._navigationListeners) {
            fn(this._currentIdx, this.prevIdx);
        }
    }

    previous() {
        this._prevIdx = this.currentIdx;
        while (this._currentIdx > 0) {
            this._currentIdx -= 1;
            if (this._advancedMode || this._captions[this._currentIdx].score < this._uncertaintyThreshold) {
                break;
            }
        }
        for (const fn of this._navigationListeners) {
            fn(this._currentIdx, this.prevIdx);
        }
    }

    addNavigationListener(fn: (currentIdx: number, prevIdx: number) => void) {
        this._navigationListeners.push(fn);
    }

    setCaption(caption: Caption, idx: number): void {
        this._captions[idx] = caption;
    }

    setAdvancedMode(advancedMode: boolean): void {
        this._advancedMode = advancedMode;
    }

    setUncertaintyThreshold(uncertaintyThreshold: number): void {
        this._uncertaintyThreshold = uncertaintyThreshold;
    }
}
