import { AuthRouteObject } from "../lib";
import { lazy } from "react";
import { HomeOutlined } from "@ant-design/icons";

const Layout = lazy(() => import("./layout/Layout"));
const Application = lazy(() => import("./pages/Application"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/404"));
const Setting = lazy(() => import("./pages/Setting"));

type MetaMenu = {
  name?: string;
  icon?: React.ReactNode;
};

export type MetaMenuAuthRouteObject = AuthRouteObject<MetaMenu>;

export const routers: MetaMenuAuthRouteObject[] = [
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
