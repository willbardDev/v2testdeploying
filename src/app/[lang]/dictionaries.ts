import { Dictionary } from '@/dictionaries/type';
import 'server-only';

interface LocaleDictionary {
  [x: string]: () => Dictionary;
}

const dictionaries: LocaleDictionary = {
  'en-US': () =>
    import('@/dictionaries/en.json').then((module) => module.default),
  'ar-SA': () =>
    import('@/dictionaries/ar.json').then((module) => module.default),
  'es-ES': () =>
    import('@/dictionaries/es.json').then((module) => module.default),
  'fr-FR': () =>
    import('@/dictionaries/fr.json').then((module) => module.default),
  'it-IT': () =>
    import('@/dictionaries/it.json').then((module) => module.default),
  'zh-CN': () =>
    import('@/dictionaries/zh.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  return dictionaries[locale]();
};
