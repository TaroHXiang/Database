import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReaderManager() {
  const [query, setQuery] = useState("");
  const [reader, setReader] = useState(null);
  const [newReader, setNewReader] = useState({
    user_id: "",
    username: "",
    password: "",
    signature: "",
    readhour: 0,
    level: "",
    email: ""
  });

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/reader/${query}`);
      const data = await res.json();
      if (data.success) {
        setReader(data.reader);
      } else {
        alert("没有此读者");
        setReader(null);
      }
    } catch (err) {
      alert("请求失败，请检查服务器");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/reader/${query}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("读者删除成功");
        setReader(null);
        setQuery("");
      } else {
        alert("删除失败：" + data.message);
      }
    } catch (err) {
      alert("删除失败");
      console.error(err);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReader),
      });
      const data = await res.json();
      if (data.success) {
        alert("添加成功！");
        setNewReader({ user_id: "", username: "", password: "", signature: "", readhour: 0, level: "", email: "" });
      } else {
        alert("添加失败：" + data.message);
      }
    } catch (err) {
      alert("添加失败");
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!updateReader.user_id) {
      alert("请先查询要更新的读者");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/reader/${updateReader.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: updateReader.username,
          signature: updateReader.signature,
          readhour: updateReader.readhour,
          level: updateReader.level,
          email: updateReader.email
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("更新成功！" + 
              (data.procedure_info ? 
               "\n存储过程执行信息: " + data.procedure_info.details : ""));
        setIsUpdating(false);
        // 重新查询显示更新后的信息
        handleSearch();
      } else {
        alert("更新失败：" + data.message);
      }
    } catch (err) {
      alert("更新失败");
      console.error(err);
    }
  };

  // 新增：查看操作日志的函数
  const handleViewLogs = async () => {
    if (!reader) {
      alert("请先查询读者信息");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/reader/${reader.user_id}/logs`);
      const data = await res.json();
      if (data.success) {
        const logText = data.logs.map(log => 
          `${log.operation_time} - ${log.operation_type} - ${log.operation_status}\n` +
          `详情: ${log.error_message || '操作成功'}`
        ).join('\n\n');
        alert("操作日志:\n\n" + (logText || "暂无日志记录"));
      } else {
        alert("获取日志失败：" + data.message);
      }
    } catch (err) {
      alert("获取日志失败");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        boxSizing: "border-box",
        maxHeight: "500px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        {/* 顶部栏 */}
        <div
          style={{
            backgroundColor: "#9370DB",
            color: "white",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "white",
              }}
            ></div>
            <span>管理员</span>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <button style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
              📚 读者日志
            </button>
            <button
              onClick={() => {
                navigate('/admin');
              }}
              style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
            >
              🚪 退出
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div
          style={{
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <h2 style={{ fontSize: "36px", fontWeight: "bold", color: "#9370DB" }}>
            读者管理
          </h2>

          {/* 查询框 */}
          <input
            type="text"
            placeholder="请输入读者ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "60%",
              fontSize: "20px",
              padding: "12px 20px",
              border: "2px solid #d1d5db",
              borderRadius: "12px",
              outline: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          />

          {/* 按钮 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleSearch}
              style={{
                flex: "1 1 240px",
                backgroundColor: "#2563eb",
                color: "#fff",
                padding: "14px",
                fontSize: "18px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              🔍 搜索读者
            </button>

            <button
              onClick={handleAdd}
              style={{
                flex: "1 1 240px",
                backgroundColor: "#22c55e",
                color: "#fff",
                padding: "14px",
                fontSize: "18px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              ➕ 添加读者
            </button>
          </div>

          {/* 添加读者表单 */}
          <div
            style={{
              width: "60%",
              backgroundColor: "#f3f4f6",
              padding: "24px",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <input
              type="text"
              placeholder="读者ID"
              value={newReader.user_id}
              onChange={(e) => setNewReader({ ...newReader, user_id: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="用户名"
              value={newReader.username}
              onChange={(e) => setNewReader({ ...newReader, username: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="password"
              placeholder="密码"
              value={newReader.password}
              onChange={(e) => setNewReader({ ...newReader, password: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="个性签名"
              value={newReader.signature}
              onChange={(e) => setNewReader({ ...newReader, signature: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="number"
              placeholder="阅读时长"
              value={newReader.readhour}
              onChange={(e) => setNewReader({ ...newReader, readhour: parseInt(e.target.value) || 0 })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="等级"
              value={newReader.level}
              onChange={(e) => setNewReader({ ...newReader, level: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="email"
              placeholder="邮箱"
              value={newReader.email}
              onChange={(e) => setNewReader({ ...newReader, email: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {/* 查询结果展示 */}
          {reader && (
            <div
              style={{
                backgroundColor: "#f9fafb",
                border: "2px solid #d1d5db",
                borderRadius: "12px",
                padding: "24px",
                width: "60%",
                fontSize: "18px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <p style={{ marginBottom: "12px" }}>
                <strong>读者ID：</strong>{reader.user_id}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>用户名：</strong>{reader.username}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>个性签名：</strong>{reader.signature}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>阅读时长：</strong>{reader.readhour}小时
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>等级：</strong>{reader.level}
              </p>
              <p>
                <strong>邮箱：</strong>{reader.email}
              </p>
            </div>
          )}

          {/* 删除按钮 */}
          {reader && (
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <button
                onClick={handleDelete}
                style={{
                  backgroundColor: "#4169E1",
                  color: "white",
                  padding: "14px 32px",
                  fontSize: "18px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "20px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                🗑 删除读者
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
