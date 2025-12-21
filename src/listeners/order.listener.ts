// produtoListeners.ts
import { eventBus, eventNames } from "../services/eventBus";
import { NewOrderNotificationFields, notificationService } from "../services/notification.service";
import { ResponseOrderFields } from "../types/order.type";

eventBus.on(eventNames.ENCOMENDA_CRIADA, async (payload: NewOrderNotificationFields) => {
  await notificationService.createEncomendaNotificacao(payload)
});

eventBus.on(eventNames.ENCOMENDA_RESPONDIDA, async (payload: ResponseOrderFields) => {
  await notificationService.createRespostaEncomendaNotificacao(payload)
});