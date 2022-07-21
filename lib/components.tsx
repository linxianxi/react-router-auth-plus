import React from "react";
import {
  IndexRouteProps,
  LayoutRouteProps,
  Outlet,
  PathRouteProps,
  Route,
} from "react-router-dom";
import { AuthRouterObject } from ".";

export interface AuthPathRouteProps extends PathRouteProps {
  auth?: string | string[];
}

export interface AuthLayoutRouteProps extends LayoutRouteProps {
  auth?: string | string[];
}

export interface AuthIndexRouteProps extends IndexRouteProps {
  auth?: string | string[];
}

export function AuthRoute(
  _props: AuthPathRouteProps | AuthLayoutRouteProps | AuthIndexRouteProps
): React.ReactElement | null {
  return null;
}

export const NoAuthElement = ({
  children,
  redirectElement,
}: {
  children: React.ReactNode;
  redirectElement?: () => React.ReactNode;
}) => (redirectElement ? <>{redirectElement()}</> : <>{children}</>);

export const AuthLayout = ({
  render,
}: {
  render?: (element: React.ReactElement | null) => React.ReactElement | null;
}) => (render ? render(<Outlet />) : <Outlet />);

export function createAuthRoutesFromChildren(
  children: React.ReactNode
): AuthRouterObject[] {
  let routes: AuthRouterObject[] = [];

  React.Children.forEach(children, (element) => {
    if (!React.isValidElement(element)) {
      return;
    }

    if (element.type === React.Fragment) {
      routes.push.apply(
        routes,
        createAuthRoutesFromChildren(element.props.children)
      );
      return;
    }

    if (!(element.type === Route || element.type === AuthRoute)) {
      throw new Error(
        `[${
          typeof element.type === "string" ? element.type : element.type.name
        }] is not a <Route> or <AuthRoute> component. All component children of <Routes> must be a <Route>、 <AuthRoute> or <React.Fragment>`
      );
    }

    let route: AuthRouterObject = {
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      index: element.props.index,
      path: element.props.path,
      auth: element.props.auth,
    };

    if (element.props.children) {
      route.children = createAuthRoutesFromChildren(element.props.children);
    }

    routes.push(route);
  });

  return routes;
}
