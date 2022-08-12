import React, { useContext } from "react";
import { RouteObject, useRoutes } from "react-router-dom";
import { AuthLayout, NoAuthElement } from "./components";
import { AuthContext } from "./context";

export interface AuthRouterObject extends RouteObject {
  auth?: string | string[];
  children?: AuthRouterObject[];
}

export const useAuthRouters = ({
  routers,
  noAuthElement,
  auth,
  render,
}: {
  routers: AuthRouterObject[];
  noAuthElement?: (router: AuthRouterObject) => React.ReactNode;
  auth: string[];
  render?: (element: React.ReactElement | null) => React.ReactElement | null;
}) => {
  function getRouters(routers: AuthRouterObject[]) {
    return routers.reduce((total: AuthRouterObject[], router) => {
      let hasAuth = true;
      if (router.auth) {
        if (typeof router.auth === "string") {
          if (!auth.includes(router.auth)) {
            hasAuth = false;
          }
        } else if (Array.isArray(router.auth) && router.auth.length > 0) {
          if (!router.auth.some((i) => auth.includes(i))) {
            hasAuth = false;
          }
        }
      }
      total.push({
        ...router,
        ...(!hasAuth
          ? {
              element: (
                <NoAuthElement
                  redirectElement={
                    noAuthElement ? () => noAuthElement(router) : undefined
                  }
                >
                  {router.element}
                </NoAuthElement>
              ),
            }
          : React.isValidElement(router.element) && router.children
          ? {
              element: React.cloneElement(router.element, {
                routers: router.children,
                ...router.element.props,
              }),
            }
          : {}),
        ...(router.children?.length
          ? {
              children: getRouters(router.children),
            }
          : {}),
      });
      return total;
    }, []);
  }

  return (
    <AuthContext.Provider value={auth}>
      {useRoutes(
        getRouters([
          {
            element: <AuthLayout render={render} />,
            children: routers,
          },
        ])
      )}
    </AuthContext.Provider>
  );
};

export function useAuthMenus<T extends AuthRouterObject>(
  menuRouters: T[]
): T[] {
  const auth = useContext(AuthContext);

  function getMenus(items: T[]) {
    return items.reduce((total: T[], i) => {
      let result;
      if (!i.auth || (Array.isArray(i.auth) && !i.auth.length)) {
        result = i;
      } else {
        if (typeof i.auth === "string") {
          if (auth.includes(i.auth)) {
            result = i;
          }
        } else {
          if (auth.some((item) => i.auth?.includes(item))) {
            result = i;
          }
        }
      }
      if (result) {
        total.push(
          i.children?.length
            ? { ...result, children: getMenus(i.children as T[]) }
            : result
        );
      }
      return total;
    }, []);
  }

  return getMenus(menuRouters);
}
