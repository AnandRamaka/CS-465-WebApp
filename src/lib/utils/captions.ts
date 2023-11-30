import { get, writable, type Writable } from 'svelte/store';

export interface SerializedCaption {
    startTime: number;
    endTime: number;
    text: string;
    originalText?: string;
    score: number;
}

export class Caption {
    private _startTimeStore: Writable<number>;
    private _endTimeStore: Writable<number>;
    private _textStore: Writable<string>;
    private _speakerName: Writable<string>;
    private _originalText: string;
    private _score: number;
    private _next: Caption | null = null;
    private _previous: Caption | null = null;
    private _vttCue: VTTCue;

    get startTime(): number {
        return get(this._startTimeStore);
    }

    set startTime(value: number) {
        this._startTimeStore.set(value);
    }

    get startTimeStore(): Writable<number> {
        return this._startTimeStore;
    }

    get endTime(): number {
        return get(this._endTimeStore);
    }

    set endTime(value: number) {
        this._endTimeStore.set(value);
    }

    get endTimeStore(): Writable<number> {
        return this._endTimeStore;
    }

    get text(): string {
        return get(this._textStore);
    }

    set text(value: string) {
        this._textStore.set(value);
    }

    get textStore(): Writable<string> {
        return this._textStore;
    }

    get speakerName(): Writable<string> {
        return this._speakerName;
    }

    get speaker(): string {
        return get(this._speakerName)
    }

    get originalText(): string {
        return this._originalText;
    }

    get score(): number {
        return this._score
    }

    set score(value: number) {
        this._score = value;
    }

    get next(): Caption | null {
        return this._next;
    }

    get previous(): Caption | null {
        return this._previous;
    }

    get vttCue(): VTTCue {
        return this._vttCue;
    }

    private constructor(serialized: SerializedCaption) {
        this._startTimeStore = writable(serialized.startTime);
        this._endTimeStore = writable(serialized.endTime);
        this._textStore = writable(serialized.text);
        this._speakerName = writable("")
        this._originalText = serialized.originalText ?? serialized.text;
        this._score = serialized.score;
        this._vttCue = new VTTCue(this.startTime, this.endTime, this.text);

        this._startTimeStore.subscribe((value: number) => {
            this._vttCue.startTime = value;
        })
        this._endTimeStore.subscribe((value: number) => {
            this._vttCue.endTime = value;
        })
        this._textStore.subscribe((value: string) => {
            if (this.speaker != "") {
                this._vttCue.text = `[${this.speaker}] ${value}`
            } else {
                this._vttCue.text = value
            }
        })
        this._speakerName.subscribe((value: string) => {
            if (value != "") {
                this._vttCue.text = `[${value}] ${this.text}`
            } else {
                this._vttCue.text = this.text
            }
        })
    }

    serialize(): SerializedCaption {
        return {
            startTime: this.startTime,
            endTime: this.endTime,
            text: this.text,
            originalText: this._originalText,
            score: this._score,
        };
    }

    static deserializeCaptions(serialized: SerializedCaption[]): Caption[] {
        const captions: Caption[] = [];
        let lastCaption: Caption | null = null;
        for (const item of serialized) {
            const caption = new Caption(item);
            if (lastCaption != null) {
                caption._previous = lastCaption;
                lastCaption._next = caption;
            }
            lastCaption = caption;
            captions.push(caption);
        }
        return captions;
    }
}
