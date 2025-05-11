import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { verifyEmail } from "../../../services/userController";

export const Verify = () => {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        setLoading(true);
        const id = searchParams.get("id");
        const token = searchParams.get("token");
        const res = await verifyEmail(Number(id), token || "");
        if (res.code === 200 && res.data > 0) {
          setSuccess(true);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchData2 = async () => {
      try {
        setLoading(true);
        const id = searchParams.get("id");
        const token = searchParams.get("token");
        const res = await verifyEmail(Number(id), token || "");
        if (res.code === 200 && res.data > 0) {
          setSuccess(true);
        }
      } finally {
        setLoading(false);
      }
    };

    if (type === "register") {
      fetchData1();
    } else if (type === "forget") {
      fetchData2();
    }
  }, []);

  if (loading) {
    return <div>正在处理...</div>;
  }

  if (success) {
    return (
      <div>
        验证成功{" "}
        <Link to="/login" replace>
          返回登陆
        </Link>
      </div>
    );
  }
  return <div>验证失败</div>;
};
