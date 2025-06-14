
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RewardManager() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [reward, setReward] = useState(null);
  const [newReward, setNewReward] = useState({
    author_id: "",
    work_id: "",
    workname: "",
    tip: "",
    tipnum: 0
  });

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/reward/${query}`);
      const data = await res.json();
      if (data.success) {
        setReward(data.reward);
      } else {
        alert("没有此打赏记录");
        setReward(null);
      }
    } catch (err) {
      alert("请求失败，请检查服务器");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/reward/${query}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("打赏记录删除成功");
        setReward(null);
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
      const res = await fetch("http://localhost:5000/api/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReward),
      });
      const data = await res.json();
      if (data.success) {
        alert("添加成功！");
        setNewReward({ author_id: "", work_id: "", workname: "", tip: "", tipnum: 0 });
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
            backgroundColor: "#4169E1",
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
              💰 打赏日志
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
          <h2 style={{ fontSize: "36px", fontWeight: "bold", color: "#4169E1" }}>
            打赏管理
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
              🔍 搜索打赏
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
              ➕ 添加打赏
            </button>
          </div>

          {/* 添加打赏表单 */}
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
              placeholder="作者ID"
              value={newReward.author_id}
              onChange={(e) => setNewReward({ ...newReward, author_id: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="作品ID"
              value={newReward.work_id}
              onChange={(e) => setNewReward({ ...newReward, work_id: e.target.value })}
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
              value={newReward.workname}
              onChange={(e) => setNewReward({ ...newReward, workname: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="打赏金额"
              value={newReward.tip}
              onChange={(e) => setNewReward({ ...newReward, tip: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="number"
              placeholder="打赏数量"
              value={newReward.tipnum}
              onChange={(e) => setNewReward({ ...newReward, tipnum: parseInt(e.target.value) || 0 })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {/* 查询结果展示 */}
          {reward && (
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
                <strong>作者ID：</strong>{reward.author_id}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>作品ID：</strong>{reward.work_id}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>作品名称：</strong>{reward.workname}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>打赏金额：</strong>{reward.tip}
              </p>
              <p>
                <strong>打赏数量：</strong>{reward.tipnum}
              </p>
            </div>
          )}

          {/* 删除按钮 */}
          {reward && (
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
                🗑 删除打赏
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
