type EventCallback = (...args: any[]) => void;

interface EventData {
    callbacks: Map<string, EventCallback>;
    onceCallbacks: Map<string, EventCallback>;
}

export class EventManager {
    private static instance: EventManager;
    private events: Map<string, EventData> = new Map();

    static getInstance(): EventManager {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }
        return EventManager.instance;
    }

    on(eventName: string, callback: EventCallback, target: any = null): string {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, {
                callbacks: new Map(),
                onceCallbacks: new Map()
            });
        }
        
        const eventData = this.events.get(eventName)!;
        const id = this.generateId();
        const boundCallback = target ? callback.bind(target) : callback;
        eventData.callbacks.set(id, boundCallback);
        return id;
    }

    once(eventName: string, callback: EventCallback, target: any = null): string {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, {
                callbacks: new Map(),
                onceCallbacks: new Map()
            });
        }
        
        const eventData = this.events.get(eventName)!;
        const id = this.generateId();
        const boundCallback = target ? callback.bind(target) : callback;
        eventData.onceCallbacks.set(id, boundCallback);
        return id;
    }

    off(eventName: string, id: string) {
        const eventData = this.events.get(eventName);
        if (!eventData) return;
        
        eventData.callbacks.delete(id);
        eventData.onceCallbacks.delete(id);
    }

    emit(eventName: string, ...args: any[]) {
        const eventData = this.events.get(eventName);
        if (!eventData) return;
        
        eventData.callbacks.forEach(callback => {
            callback(...args);
        });
        
        eventData.onceCallbacks.forEach(callback => {
            callback(...args);
        });
        eventData.onceCallbacks.clear();
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 10);
    }
}
