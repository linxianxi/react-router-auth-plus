import "./App.css";
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
} from "../lib";
import useSWR from "swr";
import { Navigate, Routes } from "react-router-dom";

const routers: AuthRouterObject[] = [
  { path: "/", element: <Navigate to="/home" replace /> },
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

  return useAuthRouters({
    routers,
    noAuthElement: () => <Navigate to="/login" replace />,
    render: (element) => (auth ? element : <Loading />),
    auth: auth || [],
  });

  // return useAuthRouters({
  //   auth: auth || [],
  //   noAuthElement: () => <Navigate to="/login" replace />,
  //   render: (element) => (auth ? element: <Loading />),
  //   routers: createAuthRoutesFromChildren(
  //     <Routes>
  //       <AuthRoute path="/" element={<Navigate to="home" replace />} />
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

export default App;
