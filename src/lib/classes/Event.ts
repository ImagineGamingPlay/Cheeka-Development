import { EventListeners } from "eris";

export class Event<Key extends keyof EventListeners> {
  constructor(
    public event: Key,
    public run: (...args: EventListeners[Key]) => void,
  ) {}
}
