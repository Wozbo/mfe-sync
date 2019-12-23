import { Observable, Subject, Subscription, ReplaySubject } from 'rxjs';

class Event {
    readonly args: any[];
    constructor(readonly key: string, ...args: any[]) {
        this.args = args;
    }
}

class SourceCollection extends Array<{key: string, sourceSubscription$: Observable<any>, updateSubscription: Subscription}> {}

export class Channel {
    private readonly eventSubject$ = new Subject<Event>();
    private readonly updateSubject$ = new Subject<string>();
    private readonly linkSubject$ = new Subject<string>();
    private readonly unlinkSubject$ = new Subject<string>();
    private readonly sources$: SourceCollection = [];

    readonly events$ = this.eventSubject$.asObservable();
    readonly update$ = this.updateSubject$.asObservable();
    readonly link$ = this.linkSubject$.asObservable();
    readonly unlink$ = this.unlinkSubject$.asObservable();

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
        const sourceSubscription$ = new ReplaySubject(1);
        const updateSubscription = source$.subscribe(data => {
            this.updateSubject$.next(key);
            sourceSubscription$.next(data);
        });
        this.sources$.push({key, sourceSubscription$, updateSubscription});
        this.linkSubject$.next(key);
    }

    unlink(key: string): void {
        const source = this.source(key);
        source.updateSubscription.unsubscribe();
        this.unlinkSubject$.next(key);
    }

    data$(key: string): Observable<any> {
        const source = this.source(key);
        return source.sourceSubscription$;
    }
}