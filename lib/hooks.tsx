import React from "react";
import { RouteObject, useRoutes } from "react-router-dom";
import { AuthLayout, NoAuthElement } from "./components";
import cloneDeep from "lodash/cloneDeep";

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
    cloneDeep(routers).forEach((router) => {
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

  return useRoutes(
    getRouters([
      {
        element: <AuthLayout render={render} />,
        children: routers,
      },
    ])
  );
};
