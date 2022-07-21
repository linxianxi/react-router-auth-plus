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

**How to use(two ways)**

```jsx
// in array
// auth: string | string[]
const routers = [{ path: "/home", element: <Home />, auth: ["admin"] }];

// in jsx
// auth: string | string[]
<AuthRoute path="/home" element={<Home />} auth={["admin"]} />;
```

**Configure the routes**

```tsx
// App.tsx
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Layout from "./layout/Layout";
import Setting from "./pages/Setting";
import Application from "./pages/Application";
import Loading from "./components/Loading";
import {
  AuthRoute,
  AuthRouterObject,
  createAuthRoutesFromChildren,
  useAuthRouters,
} from "react-router-auth-plus";
import useSWR from "swr";
import { Navigate, Routes, useNavigate } from "react-router-dom";

const routers: AuthRouterObject[] = [
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  {
    element: <Layout />,
    children: [
      { path: "/home", element: <Home />, auth: ["admin"] },
      { path: "/setting", element: <Setting /> },
      {
        path: "/application",
        element: <Application />,
        auth: ["application"],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
];

const fetcher = async (url: string): Promise<string[]> =>
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(["admin"]);
    }, 2000);
  });

function App() {
  // use swr, react-query or others
  const { data: auth } = useSWR("/api/user", fetcher, {
    revalidateOnFocus: false,
  });

  const navigate = useNavigate();

  return useAuthRouters({
    auth: auth || [],
    routers,
    noAuthElement: (router) => <Navigate to="/login" replace />,
    render: (element) => (auth ? element : <Loading />),
  });

  // or you can use jsx to configure

  // return useAuthRouters({
  //   auth: auth || [],
  //   noAuthElement: (router) => <Navigate to="/login" replace />,
  //   render: (element) => (auth ? element : <Loading />),
  //   routers: createAuthRoutesFromChildren(
  //     <Routes>
  //       <AuthRoute path="/" element={<Login />} />
  //       <AuthRoute path="/login" element={<Login />} />
  //       <AuthRoute element={<Layout />}>
  //         <AuthRoute path="/home" element={<Home />} auth={["admin"]} />
  //         <AuthRoute path="/setting" element={<Setting />} />
  //         <AuthRoute
  //           path="/application"
  //           element={<Application />}
  //           auth={["application"]}
  //         />
  //       </AuthRoute>
  //       <AuthRoute path="*" element={<NotFound />} />
  //     </Routes>
  //   ),
  // });
}
```

## API

**useAuthRouters**
| Property | Description | Type | Required |
| ----------- | ----------------------------- | ------------------------------------------------------ | -------- |
| auth | permissions of the current user | string \| string[] | true |
| noAuthElement | the element that is displayed when has no permissions | (router: AuthRouterObject) => ReactNode | false |
| render | custom render page | (element: ReactElement \| null) => ReactElement \| null | false |
| routers | all routers | AuthRouterObject[] | true |

**createAuthRoutesFromChildren** (children: ReactNode) => AuthRouterObject[]
<br />
create routers from ReactNode
