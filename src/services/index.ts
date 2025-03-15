import { getMenus as getMenuItems } from '@/utilities/constants/menu-items';
async function getMenus(locale: string) {
  // const res = await fetch('/api/menus/' + locale);
  // // The return value is *not* serialized
  // // You can return Date, Map, Set, etc.
  // if (!res.ok) {
  //   // This will activate the closest `error.js` Error Boundary
  //   throw new Error('Failed to fetch data');
  // }

  // return res.json();
  return getMenuItems(locale);
}

export { getMenus };
