import React, { FC } from "react";
import { Outlet } from "react-router-dom";

const Layout: FC = () => {
  return (
    <div>
      in layout
      <Outlet />
    </div>
  );
};

export default Layout;
