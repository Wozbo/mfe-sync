import { Channel } from './channel';
import { Subject } from 'rxjs';

describe('Channel', () => {
    it('should create', () => {
        const channel = new Channel();
        expect(channel).toBeTruthy();
    });

    describe('Events', () => {
        let eventsChannel: Channel;

        beforeEach(() => {
            eventsChannel = new Channel();
        });

        it('should emit to events$ when event is called', (doneFn) => {
            eventsChannel.events$.subscribe(event => {
                expect(event.key).toBe('foo');
                expect(event.args).toEqual([1, 2, 3]);
                doneFn();
            });

            eventsChannel.event('foo', 1, 2, 3);
        });
    });

    describe('Data', () => {
        let dataChannel: Channel;

        beforeEach(() => {
            dataChannel = new Channel();
        });

        it('should append a source to the collection', () => {
            const testSubject = new Subject();
            dataChannel.link('data', testSubject);

            const source = dataChannel.data$('data');
            expect(source).toBeTruthy();
        });

        it('should throw for a non-linked source', () => {
            const getBadSource = () => dataChannel.data$('foo')
            expect(getBadSource).toThrow("source not in channel");
        });

        it('should emit on data when subject updates', (doneFn) => {
            const testSubject = new Subject<number>();
            dataChannel.link('data', testSubject);
            
            const source = dataChannel.data$('data');
            source.subscribe(s => {
                expect(s).toBe(1234);
                doneFn();
            });

            testSubject.next(1234);
        });

        it('should emit on update$ when subject updates', (doneFn) => {
            const testSubject = new Subject<number>();
            dataChannel.link('data', testSubject);
            dataChannel.update$.subscribe(() => doneFn());

            testSubject.next(1234);
        });

        it('should emit which source updated on update$ when subject updates', (doneFn) => {
            const testSubject = new Subject<number>();
            dataChannel.link('data', testSubject);
            dataChannel.update$.subscribe((key) => {
                expect(key).toBe('data');
                doneFn();
            });
            
            testSubject.next(1234);
        });
    });
});
