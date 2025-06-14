import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthorManager() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState(null);
  const [newAuthor, setNewAuthor] = useState({
    author_id: "",
    pen_name: "",
    password: "",
    writewords: "",
    worknum: ""
  });
  const [updateAuthor, setUpdateAuthor] = useState({
    author_id: "",
    pen_name: "",
    password: "",
    writewords: "",
    worknum: "",
    level: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/author/${query}`);
      const data = await res.json();
      if (data.success) {
        setAuthor(data.author);
      } else {
        alert("没有此作者");
        setAuthor(null);
      }
    } catch (err) {
      alert("请求失败，请检查服务器");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/author/${query}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("作者删除成功");
        setAuthor(null);
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
      const res = await fetch("http://localhost:5000/api/author", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAuthor),
      });
      const data = await res.json();
      if (data.success) {
        alert("添加成功！");
        setNewAuthor({ 
          author_id: "", 
          pen_name: "", 
          password: "",
          writewords: "",
          worknum: ""
        });
      } else {
        alert("添加失败：" + data.message);
      }
    } catch (err) {
      alert("添加失败");
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!updateAuthor.author_id) {
      alert("请先查询要更新的作者");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/author/${updateAuthor.author_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_id: updateAuthor.author_id,  // 添加这一行
          authorname: updateAuthor.pen_name,
          password: updateAuthor.password,
          writewords: parseInt(updateAuthor.writewords) || 0,
          worknum: parseInt(updateAuthor.worknum) || 0,
          level: updateAuthor.level
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("更新成功！" + (data.message ? "\n" + data.message : ""));
        setIsUpdating(false);
        handleSearch();
      } else {
        alert("更新失败：" + (data.error || data.message || "未知错误"));
      }
    } catch (err) {
      alert("更新失败：网络错误");
      console.error(err);
    }
  };

  const startUpdate = () => {
    if (!author) {
      alert("请先查询作者信息");
      return;
    }
    setUpdateAuthor({
      author_id: author.author_id,
      pen_name: author.pen_name,
      password: author.password,
      writewords: author.writewords,
      worknum: author.work_count,
      level: author.level
    });
    setIsUpdating(true);
  };

  const cancelUpdate = () => {
    setIsUpdating(false);
    setUpdateAuthor({
      author_id: "",
      pen_name: "",
      password: "",
      writewords: "",
      worknum: "",
      level: ""
    });
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
            backgroundColor: "#ADD8E6",
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
              🧑‍💻 作者日志
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
          <h2 style={{ fontSize: "36px", fontWeight: "bold", color: "#0000FF" }}>
            作者管理
          </h2>

          {/* 查询框 */}
          <input
            type="text"
            placeholder="请输入作者ID"
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
              🔍 搜索作者
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
              ➕ 添加作者
            </button>
          </div>

          {/* 添加作者表单 */}
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
              value={newAuthor.author_id}
              onChange={(e) => setNewAuthor({ ...newAuthor, author_id: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              placeholder="笔名"
              value={newAuthor.pen_name}
              onChange={(e) => setNewAuthor({ ...newAuthor, pen_name: e.target.value })}
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
              value={newAuthor.password}
              onChange={(e) => setNewAuthor({ ...newAuthor, password: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="number"
              placeholder="写了多少字"
              value={newAuthor.writewords}
              onChange={(e) => setNewAuthor({ ...newAuthor, writewords: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="number"
              placeholder="目前有多少作品"
              value={newAuthor.worknum}
              onChange={(e) => setNewAuthor({ ...newAuthor, worknum: e.target.value })}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {/* 查询结果展示 */}
          {author && !isUpdating && (
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
                <strong>作者ID：</strong>{author.author_id}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>笔名：</strong>{author.pen_name}
              </p>
               <p style={{ marginBottom: "12px" }}>
                <strong>账号密码：</strong>{author.password}
               </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>写了多少字：</strong>{author.writewords || 0}
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>作品数量：</strong>{author.worknum || 0}
              </p>
              <p>
                <strong>等级：</strong>{author.level || '普通'}
              </p>
            </div>
          )}

          {/* 更新作者表单 */}
          {isUpdating && (
            <div
              style={{
                width: "60%",
                backgroundColor: "#fff3cd",
                padding: "24px",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                border: "2px solid #ffc107",
              }}
            >
              <h3 style={{ margin: "0 0 16px 0", color: "#856404" }}>修改作者信息</h3>
              
              {/* 作者ID - 可编辑但会被后端拒绝 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "14px", color: "#856404", fontWeight: "bold" }}>作者ID</label>
                <input
                  type="text"
                  placeholder="作者ID"
                  value={updateAuthor.author_id}
                  onChange={(e) => setUpdateAuthor({ ...updateAuthor, author_id: e.target.value })}
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              
              <input
                type="text"
                placeholder="笔名"
                value={updateAuthor.pen_name}
                onChange={(e) => setUpdateAuthor({ ...updateAuthor, pen_name: e.target.value })}
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
                value={updateAuthor.password}
                onChange={(e) => setUpdateAuthor({ ...updateAuthor, password: e.target.value })}
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="number"
                placeholder="写了多少字"
                value={updateAuthor.writewords}
                onChange={(e) => setUpdateAuthor({ ...updateAuthor, writewords: e.target.value })}
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="number"
                placeholder="目前有多少作品"
                value={updateAuthor.worknum}
                onChange={(e) => setUpdateAuthor({ ...updateAuthor, worknum: e.target.value })}
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
                value={updateAuthor.level}
                onChange={(e) => setUpdateAuthor({ ...updateAuthor, level: e.target.value })}
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={handleUpdate}
                  style={{
                    flex: 1,
                    backgroundColor: "#28a745",
                    color: "white",
                    padding: "12px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✅ 确认更新
                </button>
                <button
                  onClick={cancelUpdate}
                  style={{
                    flex: 1,
                    backgroundColor: "#6c757d",
                    color: "white",
                    padding: "12px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ❌ 取消
                </button>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          {author && (
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", width: "100%" }}>
              {!isUpdating && (
                <button
                  onClick={startUpdate}
                  style={{
                    backgroundColor: "#ffc107",
                    color: "#212529",
                    padding: "14px 32px",
                    fontSize: "18px",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "20px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  ✏️ 修改作者信息
                </button>
              )}
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
                🗑 删除作者
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
