// produtoListeners.ts
import { eventBus, eventNames } from "../services/eventBus";
import { notificationService } from "../services/notification.service";
import { Product } from "../types/product.type";

eventBus.on(eventNames.PRODUTO_CRIADO, async (produto: Product) => {
  await notificationService.createProdutoNotificacao(produto.id!, produto.titulo);
});