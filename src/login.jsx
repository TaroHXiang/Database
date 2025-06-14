import { useState } from "react";
import AdminDashboard from "./AdminDashboard"; 

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        alert("登录成功！");
        setIsLoggedIn(true);
      } else {
        alert("登录失败：" + data.message);
      }
    } catch (err) {
      alert("请求失败，请检查服务器");
      console.error(err);
    }
  };

  if (isLoggedIn) {
    return <AdminDashboard username={username} />;
  }

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {/* 背景视频 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src="/bg.mp4" type="video/mp4" />
        您的浏览器不支持视频背景。
      </video>
        {/* 顶部导航栏 */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "60px",
        background: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        boxSizing: "border-box",
        zIndex: 2,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}>
        <div style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>
          <img src="/logo.png" alt="Logo" style={{ height: "40px", verticalAlign: "middle", marginRight: "10px" }} />
          小说管理系统
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="#" style={{ color: "#333", textDecoration: "none", fontWeight: "500" }}>帮助</a>
          <a href="#" style={{ color: "#333", textDecoration: "none", fontWeight: "500" }}>关于我们</a>
        </div>
      </div>
      {/* 登录框区域 */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        height: "100vh",
        paddingRight: "10vw",
      }}>
        <div style={{
          position: "relative",
          background: "#ffffff",
          color: "#000000",
          padding: "40px",
          borderRadius: "16px",
          width: "360px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          backdropFilter: "blur(6px)"
        }}>
          {/* 顶部头像圆形 */}
          <div style={{
            position: "absolute",
            top: "-40px",
            left: "calc(50% - 40px)",
            width: "80px",
            height: "80px",
            backgroundColor: "#7ab6ff",
            borderRadius: "50%"
          }}></div>

          <h2 style={{ textAlign: "center", marginBottom: "30px", fontWeight: "bold", fontSize: "22px" }}>
            欢迎登录!
          </h2>

          <div style={{ marginBottom: "15px" }}>
            <label>账户名</label>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "6px",
                border: "none",
                outline: "none",
                backgroundColor: "#f0f0f0"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>密码</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "6px",
                border: "none",
                outline: "none",
                backgroundColor: "#f0f0f0"
              }}
            />
          </div>

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#6aa9ff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            登 录
          </button>

          <div style={{ textAlign: "right", marginTop: "10px", fontSize: "12px" }}>
            <a href="#" style={{ color: "#777" }}>忘记密码?</a>
          </div>
        </div>
      </div>
    </div>
  );
}
