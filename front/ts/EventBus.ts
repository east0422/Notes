class Listener {
  id: number
  eventName: string
  handler: Function
  constructor(id: number, eventName: string, handler: Function) {
    this.id = id
    this.eventName = eventName
    this.handler = handler
  }
}

class EventBus {
  events: object
  id: number

  constructor() {
    this.events = {}
    this.id = 1
  }

  addListener(listener: Listener) {
    if (this.events[listener.eventName]) {
      this.events[listener.eventName].push(listener)
    } else {
      this.events[listener.eventName] = [listener]
    }
    return listener
  }

  on(eventName: string, handler: Function) {
    const listener = new Listener(this.id++, eventName, handler)
    return this.addListener(listener)
  }

  emit(eventName: string, ...args) {
    if (Array.isArray(this.events[eventName]) &&
      this.events[eventName].length > 0) {
      this.events[eventName].forEach(handler => {
        handler(...args)
      })
    }
  }

  off(eventName: string, listener: Listener) {
    if (Array.isArray(this.events[eventName]) &&
      this.events[eventName].length > 0) {
      const index = this.events[eventName].findIndex((item) => item.id === listener.id)
      if (index !== -1) {
        this.events[eventName].splice(index, 1)
      }
    }
  }

  remove(eventName: string) {
    if (Array.isArray(this.events[eventName]) &&
      this.events[eventName].length > 0) {
      delete this.events[eventName]
    }
  }

  once(eventName: string, handler: Function) {
    const eid = this.id++
    const self = this
    const onceHander = () => {
      handler(...arguments)
      if (Array.isArray(self.events[eventName]) &&
      self.events[eventName].length > 0) {
        const index = self.events[eventName].findIndex((item) => item.id === eid)
        if (index !== -1) {
          self.events[eventName].splice(index, 1)
        }
      }
    }

    return this.addListener(new Listener(eid, eventName, onceHander))
  }
}