import { FC } from "react";
import { Outlet } from "react-router-dom";
import { MetaMenuAuthRouteObject } from "../routers";

interface LayoutProps {
  // default routers
  routers?: MetaMenuAuthRouteObject[];
  // menu routers
  authRouters?: MetaMenuAuthRouteObject[];
}

const Layout: FC<LayoutProps> = ({ routers = [], authRouters = [] }) => {
  console.log("authRouters", authRouters);
  return (
    <div>
      in layout
      <Outlet />
    </div>
  );
};

export default Layout;
