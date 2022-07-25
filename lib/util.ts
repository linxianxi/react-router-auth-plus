import cloneDeep from "lodash/cloneDeep";
import { AuthRouterObject } from "./hooks";

export function getAuthMenus<T extends AuthRouterObject>(
  auth: string[],
  menuRouters: T[]
): T[] {
  const result: T[] = [];

  cloneDeep(menuRouters).forEach((i) => {
    if (!i.auth || (Array.isArray(i.auth) && !i.auth.length)) {
      result.push(i);
    } else {
      if (typeof i.auth === "string") {
        if (auth.includes(i.auth)) {
          result.push(i);
        }
        return false;
      } else {
        if (auth.some((item) => i.auth?.includes(item))) {
          result.push(i);
        }
      }
    }
    if (i.children?.length) {
      i.children = getAuthMenus(auth, i.children);
    }
  });

  return result;
}
