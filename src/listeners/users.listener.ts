import { eventBus, eventNames } from "../services/eventBus";
import { notificationService, WelcomeNotificationFields } from "../services/notification.service";

eventBus.on(eventNames.NOVO_USUARIO, async (payload: WelcomeNotificationFields) => {
  await notificationService.createWelcomeNotification(payload)
});