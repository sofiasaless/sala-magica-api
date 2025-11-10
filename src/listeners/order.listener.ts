// produtoListeners.ts
import { eventBus, eventNames } from "../services/eventBus";
import { notificationService } from "../services/notification.service";
import { Order } from "../types/order.type";

eventBus.on(eventNames.ENCOMENDA_CRIADA, async (encomenda: Order) => {
  await notificationService.createEncomendaNotificacao(encomenda)
});