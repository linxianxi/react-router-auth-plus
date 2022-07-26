import React, { useContext } from "react";
import { RouteObject, useRoutes } from "react-router-dom";
import { AuthLayout, NoAuthElement } from "./components";
import cloneDeep from "lodash/cloneDeep";
import cloneDeepWith from "lodash/cloneDeepWith";
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
  const getRouters = (routers: AuthRouterObject[]) => {
    const result: AuthRouterObject[] = [];
    cloneDeepWith(routers, (value) => {
      if (React.isValidElement(value)) {
        return React.cloneElement(value);
      }
    }).forEach((router: AuthRouterObject) => {
      if (router.auth) {
        const setNoAuthElement = () => {
          router.element = (
            <NoAuthElement
              redirectElement={
                noAuthElement ? () => noAuthElement(router) : undefined
              }
            >
              {router.element}
            </NoAuthElement>
          );
        };
        if (typeof router.auth === "string") {
          if (!auth.includes(router.auth)) {
            setNoAuthElement();
          }
        } else if (Array.isArray(router.auth) && router.auth.length > 0) {
          if (!router.auth.some((i) => auth.includes(i))) {
            setNoAuthElement();
          }
        }
      }
      if (React.isValidElement(router.element) && router.children) {
        router.element = React.cloneElement(router.element, {
          routers: router.children,
          ...router.element.props,
        });
      }
      if (router.children) {
        router.children = getRouters(router.children);
      }
      result.push(router);
    });
    return result;
  };

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
    const result: T[] = [];

    cloneDeep(items).forEach((i) => {
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
        i.children = getMenus(i.children as T[]);
      }
    });

    return result;
  }

  return getMenus(menuRouters);
}
