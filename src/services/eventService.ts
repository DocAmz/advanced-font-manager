import { EventHandler, EventMap } from '../types/loader';

export class EventEmitter {
  private eventMap = new Map<keyof EventMap, Set<EventHandler<any>>>();

  /**
   * Register an event handler for a specific event
   * @param eventName The name of the event to listen for
   * @param handler The callback function to execute when the event occurs
   */
  on<K extends keyof EventMap>(eventName: K, handler: EventHandler<K>): void {
    if (!this.eventMap.has(eventName)) {
      this.eventMap.set(eventName, new Set());
    }
    this.eventMap.get(eventName)!.add(handler);
  }

  /**
   * Remove an event handler for a specific event
   * @param eventName The name of the event
   * @param handler The handler to remove
   */
  off<K extends keyof EventMap>(eventName: K, handler: EventHandler<K>): void {
    const handlers = this.eventMap.get(eventName);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventMap.delete(eventName);
      }
    }
  }

  /**
   * Emit an event with data
   * @param eventName The name of the event to emit
   * @param data The data to pass to handlers
   */
  emit<K extends keyof EventMap>(eventName: K, data: EventMap[K]): void {
    const handlers = this.eventMap.get(eventName);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * Get the number of listeners for a specific event
   * @param eventName The name of the event
   * @returns The number of listeners
   */
  listenerCount(eventName: keyof EventMap): number {
    return this.eventMap.get(eventName)?.size ?? 0;
  }

  /**
   * Remove all event listeners
   * @param eventName Optional event name to clear specific event listeners
   */
  removeAllListeners(eventName?: keyof EventMap): void {
    if (eventName) {
      this.eventMap.delete(eventName);
    } else {
      this.eventMap.clear();
    }
  }

  /**
   * Get all registered event names
   * @returns Array of event names
   */
  eventNames(): Array<keyof EventMap> {
    return Array.from(this.eventMap.keys());
  }
}