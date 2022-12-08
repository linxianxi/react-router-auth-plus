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

In react-router-dom 6.4+, you can choose two ways to render routers

1、you can use RouterProvider and createBrowserRouter

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
    }, 1000);
  });

function App() {
  const { data: auth, isValidating } = useSWR("/api/user", fetcher, {
    // close fetch on window focus
    revalidateOnFocus: false,
  });

  const _routers = getAuthRouters({
    routers,
    noAuthElement: (router) => <NotAuth />,
    render: (element) => (isValidating ? <Loading /> : element),
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

2、you can use BrowserRouter to wrapper `<App />`

```jsx
import NotAuth from "./pages/403";
import Loading from "./components/Loading";
import { getAuthRouters } from "react-router-auth-plus";
import useSWR from "swr";
import { useRoutes } from "react-router-dom";
import { routers } from "./routers";

const fetcher = async (url: string): Promise<string[]> =>
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(["admin"]);
    }, 1000);
  });

function App() {
  const { data: auth, isValidating } = useSWR("/api/user", fetcher, {
    // close fetch on window focus
    revalidateOnFocus: false,
  });

  return useRoutes(
    getAuthRouters({
      routers,
      noAuthElement: (router) => <NotAuth />,
      render: (element) => (isValidating ? <Loading /> : element),
      auth: auth || [],
    })
  );
}

export default App;
```

```jsx
// main.tsx(vite) or index.tsx(create-react-app)
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

**Dynamic Menus**

If you set `genRoutersProp` and `genAuthRoutersProp` in router config, `react-router-auth-plus` automatically passes `routers` and `authRouters` to props.

```jsx
// Layout.tsx
import { FC } from "react";
import { AuthRouteObject } from "react-router-auth-plus";

interface LayoutProps {
  // children routers (if you set genRoutersProp)
  routers?: AuthRouteObject[];
  // children auth routers (if you set genAuthRoutersProp)
  authRouters?: AuthRouteObject[];
}

const Layout:FC<LayoutProps> = ({ routers, authRouters }) => {
   // you can use this to generate your menus
   console.log("menuRouters", authRouters);
   return ...
}
```

If you want to config menu name and icon in the routes

```
// routers.tsx
export type MetaAuthRouteObject = AuthRouteObject & {
  name?: string;
  icon?: React.ReactNode;
  children?: MetaAuthRouteObject[];
};

export const routers: MetaAuthRouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    genAuthRoutersProp: true,
    children: [
      {
        element: <Home />,
        auth: ["admin"],
        index: true,
        name: "home",
        icon: <HomeOutlined />,
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

```jsx
// Layout.tsx
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { MetaAuthRouteObject } from "../routers";

interface LayoutProps {
  authRouters?: MetaAuthRouteObject[];
}

const Layout: FC<LayoutProps> = ({ routers, authRouters }) => {
  // you can get name and icon
  console.log("menuRouters", authRouters);
  return ...;
};

export default Layout;

```

## API

**getAuthRouters**
| Property | Description | Type | Required |
| ----------- | ----------------------------- | ------------------------------------------------------ | -------- |
| auth | permissions of the current user | string[] | true |
| noAuthElement | the element that is displayed when has no permissions | (router: AuthRouteObject) => ReactNode | false |
| render | custom render page | (element: ReactElement \| null) => ReactElement \| null | false |
| routers | all routers | AuthRouteObject[] | true |
