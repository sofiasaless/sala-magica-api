type EventHandler = (payload: any) => Promise<void> | void;

export enum eventNames {
  PRODUTO_CRIADO = "produto.criado",
  ENCOMENDA_CRIADA = "encomenda.criada",
}

class EventBus {
  private listeners: Record<eventNames, EventHandler[]> = {} as Record<eventNames, EventHandler[]>;

  on(event: eventNames, handler: EventHandler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
  }

  async emit(event: eventNames, payload: any) {
    const handlers = this.listeners[event] || [];
    for (const handler of handlers) await handler(payload);
  }
}

export const eventBus = new EventBus();
