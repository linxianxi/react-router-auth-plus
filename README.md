## react-router-auth-plus

## Introduce

Make you easy to use permission management based on react-router v6.

## Install

```shell
npm install react-router-auth-plus

OR

yarn add react-router-auth-plus
```

## Usage

if user auth is `["auth1"]`, home router auth configure `["auth1", "auth2"]`, will be judged as having permission.

**How to use**

```jsx
// auth: string | string[]
const routers = [{ path: "/home", element: <Home />, auth: ["admin"] }];
```

**Configure the routes**

```jsx
// routers.tsx
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { AuthRouteObject } from "react-router-auth-plus";

const Layout = lazy(() => import("./layout/Layout"));
const Application = lazy(() => import("./pages/Application"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/404"));
const Setting = lazy(() => import("./pages/Setting"));

export const routers: AuthRouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    // it will pass th routers prop to Layout
    // genRoutersProp: true,
    // it will pass the authRouters prop to Layout, you can use it to generate menus
    genAuthRoutersProp: true,
    children: [
      {
        element: <Home />,
        auth: ["admin"],
        index: true,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
      {
        path: "/application",
        element: <Application />,
        auth: ["application"],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  { path: "*", element: <NotFound /> },
];
```

**In App.tsx**

```jsx
// App.tsx
import NotAuth from "./pages/403";
import Loading from "./components/Loading";
import { getAuthRouters } from "react-router-auth-plus";
import useSWR from "swr";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routers } from "./routers";
import { Suspense } from "react";

const fetcher = async (url: string): Promise<string[]> =>
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(["admin"]);
    }, 2000);
  });

function App() {
  // use swr, react-query or others
  const { data: auth } = useSWR("/api/user", fetcher);

  const _routers = getAuthRouters({
    routers,
    noAuthElement: (router) => <NotAuth />,
    render: (element) => (auth ? element : <Loading />),
    auth: auth || [],
  });

  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider
        router={createBrowserRouter(_routers)}
        // route loader loading
        fallbackElement={<Loading />}
      />
    </Suspense>
  );
}

export default App;
```

**Dynamic Menus**

If you set `genRoutersProp` and `genAuthRoutersProp` in router config, `react-router-auth-plus` automatically passes `routers` and `authRouters` to props.

```jsx
import { AuthRouteObject } from "react-router-auth-plus";

interface LayoutProps {
  // default routers
  routers?: AuthRouteObject[];
  // menu routers
  authRouters?: AuthRouteObject[];
}

const Layout:FC<LayoutProps> = ({ routers, authRouters }) => {
   // you can use authRouters to generate your menus
   console.log("menuRouters", authRouters);

   ...
}
```

## API

**getAuthRouters**
| Property | Description | Type | Required |
| ----------- | ----------------------------- | ------------------------------------------------------ | -------- |
| auth | permissions of the current user | string[] | true |
| noAuthElement | the element that is displayed when has no permissions | (router: AuthRouteObject) => ReactNode | false |
| render | custom render page | (element: ReactElement \| null) => ReactElement \| null | false |
| routers | all routers | AuthRouteObject[] | true |
