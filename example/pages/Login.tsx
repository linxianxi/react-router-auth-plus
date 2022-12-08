import { Button } from "antd";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="primary"
      loading={loading}
      onClick={async () => {
        setLoading(true);
        // login
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
        setLoading(false);
        navigate("/");
      }}
    >
      Login
    </Button>
  );
};

export default Login;
