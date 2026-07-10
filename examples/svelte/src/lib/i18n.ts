import type { MessageCatalog } from "sveltext";

const catalogLoaders = import.meta.glob<MessageCatalog>("../locales/*.po", { import: "messages" });

export function loadMessageCatalog(locale: string) {
  const loader = catalogLoaders[`../locales/${locale}.po`];
  return loader();
}
