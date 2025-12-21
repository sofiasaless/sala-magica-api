// produtoListeners.ts
import { eventBus, eventNames } from "../services/eventBus";
import { NewOrderNotificationFields, notificationService } from "../services/notification.service";

eventBus.on(eventNames.ENCOMENDA_CRIADA, async (payload: NewOrderNotificationFields) => {
  await notificationService.createEncomendaNotificacao(payload)
});