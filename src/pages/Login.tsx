import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          // login
          await new Promise((resolve) => {
            setTimeout(resolve, 2000);
          });
          setLoading(false);
          navigate("/home");
        }}
      >
        {loading ? "loading...." : "Login (go to home)"}
      </button>
    </div>
  );
};

export default Login;
