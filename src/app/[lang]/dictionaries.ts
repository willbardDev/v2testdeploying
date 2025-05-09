import { Dictionary } from '@/dictionaries/type';
import 'server-only';

interface LocaleDictionary {
  [x: string]: () => Promise<Dictionary>;
}

const dictionaries: LocaleDictionary = {
  'en-US': async () => {
    const main = await import('@/dictionaries/en/en.json').then(m => m.default);
    const subscriptions = await import('@/dictionaries/en/subscriptions.json').then(m => m.default);
    return {
      ...main,
      subscriptions
    };
  },
  'sw-TZ': async () => {
    const main = await import('@/dictionaries/sw/sw.json').then(m => m.default);
    const subscriptions = await import('@/dictionaries/sw/subscriptions.json').then(m => m.default);
    return {
      ...main,
      subscriptions
    };
  },
  // 'ar-SA': () =>ww
  //   import('@/dictionaries/ar.json').then((module) => module.default),
  // 'es-ES': () =>
  //   import('@/dictionaries/es.json').then((module) => module.default),
  // 'fr-FR': () =>
  //   import('@/dictionaries/fr.json').then((module) => module.default),
  // 'it-IT': () =>
  //   import('@/dictionaries/it.json').then((module) => module.default),
  // 'zh-CN': () =>
  //   import('@/dictionaries/zh.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  return dictionaries[locale]();
};