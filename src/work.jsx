
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WorkManager() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [work, setWork] = useState(null);
  const [workDetails, setWorkDetails] = useState([]); // 新增：存储视图查询结果
  const [showViewResults, setShowViewResults] = useState(false); // 新增：控制视图结果显示
  const [newWork, setNewWork] = useState({
    work_id: "",
    workname: "",
    category: "",
    score: "",
    author_id: "",
    authorname: "",
    pubtime: "",
    introduction: ""
  });

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/works/${query}`);
      const data = await res.json();
      if (data.success) {
        setWork(data.work);
        setShowViewResults(false); // 隐藏视图结果
      } else {
        alert("没有此作品");
        setWork(null);
      }
    } catch (err) {
      alert("请求失败，请检查服务器");
      console.error(err);
    }
  };

  // 新增：查询作品详细信息视图
  const handleViewQuery = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/work-details');
      const data = await res.json();
      if (data.success) {
        setWorkDetails(data.works);
        setShowViewResults(true);
        setWork(null); // 隐藏单个作品结果
      } else {
        alert("查询失败：" + data.message);
      }
    } catch (err) {
      alert("请求失败，请检查服务器");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/works/${query}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("作品删除成功");
        setWork(null);
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
      const res = await fetch("http://localhost:5000/api/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWork),
      });
      const data = await res.json();
      if (data.success) {
        alert("添加成功！");
        setNewWork({ 
          work_id: "", 
          workname: "", 
          category: "", 
          score: "", 
          author_id: "", 
          authorname: "", 
          pubtime: "", 
          introduction: "" 
        });
      } else {
        alert("添加失败：" + data.message);
      }
    } catch (err) {
      alert("添加失败");
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
            backgroundColor: "#228B22",
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
              📖 作品日志
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
          <h2 style={{ fontSize: "36px", fontWeight: "bold", color: "#228B22" }}>
            作品管理
          </h2>

          {/* 查询框 */}
          <input
            type="text"
            placeholder="请输入作品ID"
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
              🔍 搜索作品
            </button>

            {/* 新增：查询视图按钮 */}
            <button
              onClick={handleViewQuery}
              style={{
                flex: "1 1 240px",
                backgroundColor: "#8b5cf6",
                color: "#fff",
                padding: "14px",
                fontSize: "18px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              📊 查询作品详情
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
              ➕ 添加作品
            </button>
          </div>

          {/* 添加作品表单 */}
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
              placeholder="作品ID"
              value={newWork.work_id}
              onChange={(e) => setNewWork({ ...newWork, work_id: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="作品名称"
              value={newWork.workname}
              onChange={(e) => setNewWork({ ...newWork, workname: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="类型"
              value={newWork.category}
              onChange={(e) => setNewWork({ ...newWork, category: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="number"
              placeholder="评分"
              value={newWork.score}
              onChange={(e) => setNewWork({ ...newWork, score: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="作者ID"
              value={newWork.author_id}
              onChange={(e) => setNewWork({ ...newWork, author_id: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="作者名称"
              value={newWork.authorname}
              onChange={(e) => setNewWork({ ...newWork, authorname: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="date"
              placeholder="发布时间"
              value={newWork.pubtime}
              onChange={(e) => setNewWork({ ...newWork, pubtime: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <textarea
              placeholder="简介"
              value={newWork.introduction}
              onChange={(e) => setNewWork({ ...newWork, introduction: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                minHeight: "80px",
                resize: "vertical"
              }}
            />
          </div>

          {/* 新增：视图查询结果展示 */}
          {showViewResults && workDetails.length > 0 && (
            <div
              style={{
                backgroundColor: "#f0f9ff",
                border: "2px solid #0ea5e9",
                borderRadius: "12px",
                padding: "24px",
                width: "90%",
                maxHeight: "400px",
                overflowY: "auto",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginBottom: "20px", color: "#0ea5e9", fontSize: "24px" }}>
                📊 作品详细信息视图
              </h3>
              <div style={{ display: "grid", gap: "16px" }}>
                {workDetails.map((work, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "white",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "16px"
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                      <p><strong>作者名：</strong>{work.authorname}</p>
                      <p><strong>作者ID：</strong>{work.author_id}</p>
                      <p><strong>作品名：</strong>{work.workname}</p>
                      <p><strong>作品类型：</strong>{work.category}</p>
                      <p><strong>作品评分：</strong>{work.score}</p>
                      <p><strong>发布时间：</strong>{work.pubtime}</p>
                    </div>
                    <p style={{ marginTop: "12px" }}><strong>简介：</strong>{work.introduction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 查询结果展示 */}
          {work && (
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
                <strong>作品ID：</strong>{work.work_id}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>作品名称：</strong>{work.workname}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>作者名：</strong>{work.authorname}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>作者ID：</strong>{work.author_id}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>类型：</strong>{work.category}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>评分：</strong>{work.score}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>发布时间：</strong>{work.pubtime}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>简介：</strong>{work.introduction}
              </p>
            </div>
          )}

          {/* 删除按钮 */}
          {work && (
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
                🗑 删除作品
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
