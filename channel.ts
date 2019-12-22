import { Observable, Subject, Subscription } from 'rxjs';

class Event {
    readonly args: any[];
    constructor(readonly key: string, ...args: any[]) {
        this.args = args;
    }
}

class SourceCollection extends Array<{key: string, source$: Observable<any>, updateSubscription: Subscription}> {}

export class Channel {
    private readonly eventSubject$ = new Subject<Event>();
    private readonly updateSubject$ = new Subject<string>();
    private readonly sources$: SourceCollection = [];

    readonly events$ = this.eventSubject$.asObservable();
    readonly update$ = this.updateSubject$.asObservable();

    private source(key: string) {
        const source = this.sources$.find(s => s.key === key)
        if (!source) {
            throw new Error("source not in channel");
        }
        return source;
    }
    
    event(key: string, ...args: any[]): void {
        this.eventSubject$.next(new Event(key, ...args));
    }

    link(key: string, source$: Observable<any>): void {
        const updateSubscription = source$.subscribe(s => this.updateSubject$.next(key));
        this.sources$.push({key, source$, updateSubscription});
    }

    unlink(key: string): void {
        const source = this.source(key);
        source.updateSubscription.unsubscribe();
    }

    data$(key: string): Observable<any> {
        const source = this.source(key);
        return source.source$;
    }
}