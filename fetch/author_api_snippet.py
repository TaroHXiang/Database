
# 查询作者信息
@app.route("/api/author/<author_id>", methods=["GET"])
def get_author(author_id):
    cursor = db.cursor()
    cursor.execute("SELECT pen_name, work_count FROM author WHERE author_id = %s", (author_id,))
    row = cursor.fetchone()
    if row:
        return jsonify({
            "success": True,
            "author": {
                "author_id": author_id,
                "pen_name": row[0],
                "work_count": row[1]
            }
        })
    else:
        return jsonify({ "success": False, "message": "作者不存在" })


# 添加作者
@app.route("/api/author", methods=["POST"])
def add_author():
    data = request.get_json()
    author_id = data.get("author_id")
    pen_name = data.get("pen_name")
    password = data.get("password")

    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO author (author_id, pen_name, password, work_count, total_words, permission) VALUES (%s, %s, %s, 0, 0, '普通')",
                       (author_id, pen_name, password))
        db.commit()
        return jsonify({ "success": True, "message": "添加成功" })
    except pymysql.err.IntegrityError:
        return jsonify({ "success": False, "message": "作者ID已存在" })


# 删除作者
@app.route("/api/author/<author_id>", methods=["DELETE"])
def delete_author(author_id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM author WHERE author_id = %s", (author_id,))
    db.commit()
    return jsonify({ "success": True, "message": "作者已删除" })
