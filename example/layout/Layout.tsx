import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import { MetaAuthRouteObject } from "../routers";

interface LayoutProps {
  // default routers
  routers?: MetaAuthRouteObject[];
  // menu routers
  authRouters?: MetaAuthRouteObject[];
}

const Layout: FC<LayoutProps> = ({ routers, authRouters }) => {
  console.log("menuRouters", authRouters);
  return (
    <div>
      in layout
      <Outlet />
    </div>
  );
};

export default Layout;
