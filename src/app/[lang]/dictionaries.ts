import { Dictionary } from '@/dictionaries/type';
import 'server-only';

interface LocaleDictionary {
  [x: string]: () => Promise<Dictionary>;
}

const dictionaries: LocaleDictionary = {
  'en-US': async () => {
    const [main, subscriptions, organizations] = await Promise.all([
      import('@/dictionaries/en/en.json').then(m => m.default),
      import('@/dictionaries/en/subscriptions.json').then(m => m.default),
      import('@/dictionaries/en/organizations/organizations.json').then(m => m.default)
    ]);
    return {
      ...main,
      subscriptions,
      organizations
    };
  },
  'sw-TZ': async () => {
    const [main, subscriptions, organizations] = await Promise.all([
      import('@/dictionaries/sw/sw.json').then(m => m.default),
      import('@/dictionaries/sw/subscriptions.json').then(m => m.default),
      import('@/dictionaries/sw/organizations/organizations.json').then(m => m.default)
    ]);
    return {
      ...main,
      subscriptions,
      organizations
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