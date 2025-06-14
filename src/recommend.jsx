
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecommendManager() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [recommend, setRecommend] = useState(null);
  const [newRecommend, setNewRecommend] = useState({
    work_id: "",
    workname: "",
    rank: "",
    category: "",
    level: "",
    author_id: "",
    authorname: ""
  });

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/recommend/${query}`);
      const data = await res.json();
      if (data.success) {
        setRecommend(data.recommend);
      } else {
        alert("没有此推荐");
        setRecommend(null);
      }
    } catch (err) {
      alert("请求失败，请检查服务器");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/recommend/${query}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("推荐删除成功");
        setRecommend(null);
        setQuery("");
      } else {
        alert("删除失败：" + data.message);
      }
    } catch (err) {
      alert("删除失败");
      console.error(err);
    }
  };

  // 修改 handleAdd 函数，确保数字字段被正确转换
  const handleAdd = async () => {
    try {
      // 构造正确的数据类型
      const recommendData = {
        work_id: parseInt(newRecommend.work_id),      // 转换为整数
        workname: newRecommend.workname,
        rank: newRecommend.rank,
        category: newRecommend.category,
        level: newRecommend.level,
        author_id: parseInt(newRecommend.author_id),  // 转换为整数
        authorname: newRecommend.authorname
      };
      
      // 验证必填字段
      if (!recommendData.work_id || !recommendData.author_id) {
        alert("作品ID和作者ID必须是有效的数字");
        return;
      }
      
      const res = await fetch("http://localhost:5000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recommendData),  // 使用转换后的数据
      });
      const data = await res.json();
      if (data.success) {
        alert("添加成功！");
        setNewRecommend({ work_id: "", workname: "", rank: "", category: "", level: "", author_id: "", authorname: "" });
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
            backgroundColor: "#FF69B4",
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
              ⭐ 推荐日志
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
          <h2 style={{ fontSize: "36px", fontWeight: "bold", color: "#FF69B4" }}>
            推荐管理
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
              🔍 搜索推荐
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
              ➕ 添加推荐
            </button>
          </div>

          {/* 添加推荐表单 */}
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
              type="number"
              placeholder="作品ID"
              value={newRecommend.work_id}
              onChange={(e) => setNewRecommend({ ...newRecommend, work_id: e.target.value })}
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
              value={newRecommend.workname}
              onChange={(e) => setNewRecommend({ ...newRecommend, workname: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="number"
              placeholder="排名"
              value={newRecommend.rank}
              onChange={(e) => setNewRecommend({ ...newRecommend, rank: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="分类"
              value={newRecommend.category}
              onChange={(e) => setNewRecommend({ ...newRecommend, category: e.target.value })}
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
              value={newRecommend.level}
              onChange={(e) => setNewRecommend({ ...newRecommend, level: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="number"
              placeholder="作者ID"
              value={newRecommend.author_id}
              onChange={(e) => setNewRecommend({ ...newRecommend, author_id: e.target.value })}
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
              value={newRecommend.authorname}
              onChange={(e) => setNewRecommend({ ...newRecommend, authorname: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {/* 查询结果展示 */}
          {recommend && (
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
                <strong>作品ID：</strong>{recommend.work_id}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>作品名称：</strong>{recommend.workname}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>排名：</strong>{recommend.rank}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>分类：</strong>{recommend.category}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>等级：</strong>{recommend.level}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>作者ID：</strong>{recommend.author_id}
              </p>
              <p>
                <strong>作者名称：</strong>{recommend.authorname}
              </p>
            </div>
          )}

          {/* 删除按钮 */}
          {recommend && (
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
                🗑 删除推荐
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
