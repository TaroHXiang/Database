
from flask import request, jsonify

# 查询推荐榜单信息
@app.route("/api/recommend/<work_id>", methods=["GET"])
def get_recommend(work_id):
    cursor = db.cursor()
    cursor.execute("SELECT title, rank, category, heat, author_id FROM recommend WHERE work_id = %s", (work_id,))
    row = cursor.fetchone()
    if row:
        return jsonify({
            "success": True,
            "recommend": {
                "work_id": work_id,
                "title": row[0],
                "rank": row[1],
                "category": row[2],
                "heat": row[3],
                "author_id": row[4]
            }
        })
    else:
        return jsonify({ "success": False, "message": "推荐榜未找到该作品" })


# 更新推荐榜单信息
@app.route("/api/recommend/<work_id>", methods=["PUT"])
def update_recommend(work_id):
    data = request.get_json()
    title = data.get("title")
    rank = data.get("rank")
    category = data.get("category")
    heat = data.get("heat")
    author_id = data.get("author_id")

    cursor = db.cursor()
    cursor.execute(
        "UPDATE recommend SET title=%s, rank=%s, category=%s, heat=%s, author_id=%s WHERE work_id=%s",
        (title, rank, category, heat, author_id, work_id)
    )
    db.commit()
    return jsonify({ "success": True, "message": "更新成功" })


# 推荐类别：获取所有类别
@app.route("/api/recommend/categories", methods=["GET"])
def get_categories():
    cursor = db.cursor()
    cursor.execute("SELECT DISTINCT category FROM recommend")
    rows = cursor.fetchall()
    return jsonify({
        "success": True,
        "categories": [r[0] for r in rows]
    })


# 添加新类别（实际上向 recommend 插入一条虚拟记录以存类别）
@app.route("/api/recommend/categories", methods=["POST"])
def add_category():
    data = request.get_json()
    category = data.get("category")
    if not category:
        return jsonify({ "success": False, "message": "类别不能为空" })

    cursor = db.cursor()
    try:
        # 插入一条类别记录，work_id 用 uuid 或特殊标记，实际部署建议独立表
        cursor.execute("INSERT INTO recommend (work_id, title, rank, category, heat, author_id) VALUES (%s, %s, %s, %s, %s, %s)",
                       (f"cat_{category}", "类别占位", 0, category, 0, "none"))
        db.commit()
        return jsonify({ "success": True, "message": "添加类别成功" })
    except Exception as e:
        return jsonify({ "success": False, "message": str(e) })


# 删除类别（删除该类别所有记录）
@app.route("/api/recommend/categories/<category>", methods=["DELETE"])
def delete_category(category):
    cursor = db.cursor()
    cursor.execute("DELETE FROM recommend WHERE category = %s", (category,))
    db.commit()
    return jsonify({ "success": True, "message": "删除类别成功" })
