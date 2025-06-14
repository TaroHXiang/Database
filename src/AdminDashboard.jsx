import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserCircle, LogOut } from "lucide-react";

export default function AdminDashboard({ username = "管理员" }) {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [recommendList, setRecommendList] = useState([]);
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    setDate(formatted);
    
    // 模拟推荐榜单数据
    setRecommendList([
      { id: 1, rank: "01", title: "十日终焉", author: "杀虫队队员", category: "悬疑惊悚", cover: "/cover1.jpg" },
      { id: 2, rank: "02", title: "我不是戏神", author: "三九音域", category: "都市异能", cover: "/cover2.jpg" },
      { id: 3, rank: "03", title: "我在精神病院学斩神", author: "三九音域", category: "悬疑惊悚", cover: "/cover3.jpg" },
      { id: 4, rank: "04", title: "无限末世：开局一座地窖安全屋", author: "一颗萝卜", category: "科幻末世", cover: "/cover4.jpg" },
      { id: 5, rank: "05", title: "癫，都癫，癫点好啊", author: "小盐子", category: "娱乐星光", cover: "/cover5.jpg" },
      { id: 6, rank: "06", title: "攀高枝", author: "白鹭成双", category: "古代言情", cover: "/cover6.jpg" }
    ]);
    
    // 模拟最新资讯
    setLatestNews([
      "网络作家｜|盛世美颜小涵的原创",
      "2025年5月盛世美颜小说全站与征稿活动公告",
      "创作'富'攻略｜掌握8个创作秘籍，轻松...",
      "『课程回放攻略文章』让新手变高手...",
      "『走进古风』看古风｜主角配文...",
      "这些院校，想做科幻学子的全金！",
      "『青春校园』活动获奖公示"
    ]);
  }, []);

  const modules = [
    { name: "读者管理", color: "#E3F2FD", icon: "📖", route: "/reader", desc: "管理读者信息" },
    { name: "作者管理", color: "#FFF3E0", icon: "🧑‍💻", route: "/author", desc: "管理作者账户" },
    { name: "推荐榜管理", color: "#FCE4EC", icon: "⭐", route: "/recommend", desc: "榜单排名管理" },
    { name: "作品管理", color: "#E8F5E8", icon: "📚", route: "/work", desc: "作品信息维护" },
    { name: "打赏模块", color: "#E1F5FE", icon: "💰", route: "/reward", desc: "打赏金额管理" },
  ];

  const handleWorkClick = (workId) => {
    // 点击作品跳转到作品详情页面
    navigate(`/work?id=${workId}`);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* 顶部导航栏 */}
      <header style={{
        backgroundColor: "white",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px"
        }}>
          {/* 左侧Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#ff6b35",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "16px"
            }}>📚</div>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>盛世美颜小说网</span>
          </div>
          
          {/* 中间导航 */}
          <nav style={{ display: "flex", gap: "32px" }}>
            <a href="#" style={{ color: "#374151", textDecoration: "none", fontWeight: "500" }}>首页</a>
            <a href="#" style={{ color: "#374151", textDecoration: "none", fontWeight: "500" }}>书库</a>
            <a href="#" style={{ color: "#374151", textDecoration: "none", fontWeight: "500" }}>作家专区</a>
          </nav>
          
          {/* 右侧用户信息 */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>欢迎，{username}</span>
            <span style={{ fontSize: "14px", color: "#9ca3af" }}>{date}</span>
            <button
              onClick={() => {
                localStorage.removeItem("password");
                localStorage.removeItem("username");
                window.location.href = "/login";
              }}
              style={{
                display: "flex",
                alignItems: "center",
                color: "#6b7280",
                fontSize: "14px",
                background: "none",
                border: "none",
                cursor: "pointer",
                gap: "4px"
              }}
            >
              <LogOut style={{ width: "16px", height: "16px" }} />
              退出
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "32px 20px",
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "32px"
      }}>
        {/* 左侧推荐榜单 */}
        <div>
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px"
            }}>
              <h2 style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#1f2937",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                📈 盛世美颜巅峰榜
              </h2>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>根据热度评分、人气、互动综合分排行</span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {recommendList.map((item, index) => (
                <div 
                  key={item.id}
                  onClick={() => handleWorkClick(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    backgroundColor: "transparent"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#f9fafb"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                    backgroundColor: index < 3 ? "#fbbf24" : "#f3f4f6",
                    color: index < 3 ? "white" : "#6b7280"
                  }}>
                    {item.rank}
                  </div>
                  <img 
                    src={item.cover} 
                    alt={item.title}
                    style={{
                      width: "48px",
                      height: "64px",
                      objectFit: "cover",
                      borderRadius: "4px"
                    }}
                    onError={(e) => {
                      e.target.src = '/vite.svg';
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontWeight: "500",
                      color: "#1f2937",
                      margin: "0 0 4px 0",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>{item.title}</h3>
                    <p style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      margin: "0 0 8px 0"
                    }}>{item.author}</p>
                    <span style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      fontSize: "12px",
                      backgroundColor: "#f3f4f6",
                      color: "#6b7280",
                      borderRadius: "4px"
                    }}>
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧管理功能和资讯 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* 管理功能模块 */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
          }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1f2937",
              margin: "0 0 24px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              👥 管理功能
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "16px"
            }}>
              {modules.map((mod, idx) => (
                <div
                  key={idx}
                  onClick={() => mod.route && navigate(mod.route)}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor: mod.color
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ fontSize: "24px" }}>{mod.icon}</div>
                    <div>
                      <h3 style={{
                        fontWeight: "500",
                        color: "#1f2937",
                        margin: "0 0 4px 0"
                      }}>{mod.name}</h3>
                      <p style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        margin: 0
                      }}>{mod.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 最新资讯 */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
          }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1f2937",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              ⭐ 最新资讯
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {latestNews.map((news, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  color: "#374151"
                }}
                onMouseEnter={(e) => e.target.style.color = "#ff6b35"}
                onMouseLeave={(e) => e.target.style.color = "#374151"}
                >
                  <span style={{
                    width: "4px",
                    height: "4px",
                    backgroundColor: "#9ca3af",
                    borderRadius: "50%"
                  }}></span>
                  <span style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>{news}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <button style={{
                fontSize: "14px",
                color: "#6b7280",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}>更多 ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
