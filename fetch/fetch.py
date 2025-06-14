from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

# 连接数据库
db = pymysql.connect(
    host="localhost",
    port=3306,
    user="root",
    password="Mysql0406!@",
    database="nobeldb",
    charset="utf8mb4"
)

#登录
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    cursor = db.cursor()
    cursor.execute("SELECT * FROM staff WHERE name=%s AND password=%s", (username, password))
    user = cursor.fetchone()

    if user:
        return jsonify({ "success": True, "message": "登录成功" })
    else:
        return jsonify({ "success": False, "message": "用户名或密码错误" })

# ==================== 读者管理 API ====================

#查询读者信息
@app.route("/api/reader/<user_id>", methods=["GET"])
def get_reader(user_id):
    cursor = db.cursor()
    cursor.execute("SELECT user_id, username, password, signature, readhour, level, email FROM reader WHERE user_id = %s", (user_id,))
    row = cursor.fetchone()
    if row:
        return jsonify({
            "success": True,
            "reader": {
                "user_id": row[0],
                "username": row[1],
                "password": row[2],
                "signature": row[3],
                "readhour": row[4],
                "level": row[5],
                "email": row[6]
            }
        })
    else:
        return jsonify({ "success": False, "message": "读者不存在" })

#添加读者用户
@app.route("/api/reader", methods=["POST"])
def add_reader():
    data = request.get_json()
    user_id = data.get("user_id")
    username = data.get("username")
    password = data.get("password")
    signature = data.get("signature", "")
    readhour = data.get("readhour", 0)
    level = data.get("level", "新手")
    email = data.get("email", "")

    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO reader (user_id, username, password, signature, readhour, level, email) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                       (user_id, username, password, signature, readhour, level, email))
        db.commit()
        return jsonify({ "success": True, "message": "添加成功" })
    except pymysql.err.IntegrityError:
        return jsonify({ "success": False, "message": "读者ID已存在" })

# 修改读者
@app.route("/api/reader/<user_id>", methods=["PUT"])
def update_reader(user_id):
    data = request.get_json()
    username = data.get("username")
    signature = data.get("signature")
    readhour = data.get("readhour")
    level = data.get("level")
    email = data.get("email")
    
    # 数据验证
    if not username or not username.strip():
        return jsonify({"success": False, "message": "用户名不能为空"}), 400
    
    try:
        readhour = int(readhour) if readhour else 0
    except ValueError:
        return jsonify({"success": False, "message": "阅读时长必须为数字"}), 400

    cursor = db.cursor()
    try:
        # 调用存储过程
        cursor.callproc('UpdateReaderWithForeignKeys', [
            user_id, username, signature, readhour, level, email, 0, ''
        ])
        
        # 获取存储过程的输出参数
        cursor.execute("SELECT @_UpdateReaderWithForeignKeys_6, @_UpdateReaderWithForeignKeys_7")
        result = cursor.fetchone()
        result_code = result[0]
        result_message = result[1]
        
        db.commit()
        
        if result_code == 200:
            # 获取更新后的读者信息
            cursor.execute("SELECT user_id, username, signature, readhour, level, email FROM reader WHERE user_id = %s", (user_id,))
            updated_reader = cursor.fetchone()
            
            # 获取操作日志
            cursor.execute("SELECT operation_time, operation_status, error_message FROM reader_update_log WHERE user_id = %s ORDER BY log_id DESC LIMIT 1", (user_id,))
            log_info = cursor.fetchone()
            
            return jsonify({
                "success": True, 
                "message": result_message,
                "reader": {
                    "user_id": updated_reader[0],
                    "username": updated_reader[1],
                    "signature": updated_reader[2],
                    "readhour": updated_reader[3],
                    "level": updated_reader[4],
                    "email": updated_reader[5]
                },
                "procedure_info": {
                    "operation_time": log_info[0].strftime('%Y-%m-%d %H:%M:%S') if log_info else None,
                    "status": log_info[1] if log_info else None,
                    "details": log_info[2] if log_info else None
                }
            })
        else:
            return jsonify({"success": False, "message": result_message}), result_code if result_code != -1 else 500
            
    except Exception as e:
        db.rollback()
        return jsonify({"success": False, "message": f"更新失败：{str(e)}"}), 500
    finally:
        cursor.close()

# 新增API：获取读者更新日志
@app.route("/api/reader/<user_id>/logs", methods=["GET"])
def get_reader_logs(user_id):
    cursor = db.cursor()
    try:
        cursor.execute("""
            SELECT log_id, old_username, new_username, old_email, new_email, 
                   old_level, new_level, operation_type, operation_time, 
                   operation_status, error_message 
            FROM reader_update_log 
            WHERE user_id = %s 
            ORDER BY operation_time DESC 
            LIMIT 10
        """, (user_id,))
        
        logs = []
        for row in cursor.fetchall():
            logs.append({
                "log_id": row[0],
                "old_username": row[1],
                "new_username": row[2],
                "old_email": row[3],
                "new_email": row[4],
                "old_level": row[5],
                "new_level": row[6],
                "operation_type": row[7],
                "operation_time": row[8].strftime('%Y-%m-%d %H:%M:%S'),
                "operation_status": row[9],
                "error_message": row[10]
            })
        
        return jsonify({"success": True, "logs": logs})
        
    except Exception as e:
        return jsonify({"success": False, "message": f"获取日志失败：{str(e)}"}), 500
    finally:
        cursor.close()

# 删除读者
@app.route("/api/reader/<user_id>", methods=["DELETE"])
def delete_reader(user_id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM reader WHERE user_id = %s", (user_id,))
    db.commit()
    return jsonify({ "success": True, "message": "已删除" })

# ==================== 作者管理 API ====================

# 查询作者信息
@app.route("/api/author/<author_id>", methods=["GET"])
def get_author(author_id):
    cursor = db.cursor()
    cursor.execute("SELECT author_id, authorname, password, writewords, worknum, level FROM author WHERE author_id = %s", (author_id,))
    row = cursor.fetchone()
    if row:
        return jsonify({
            "success": True,
            "author": {
                "author_id": row[0],
                "pen_name": row[1],
                "password": row[2],
                "writewords": row[3],
                "work_count": row[4],
                "level": row[5]
            }
        })
    else:
        return jsonify({ "success": False, "message": "作者不存在" })

# 添加作者（带触发器支持）
@app.route("/api/author", methods=["POST"])
def add_author():
    data = request.get_json()
    author_id = data.get("author_id")
    pen_name = data.get("pen_name")
    password = data.get("password")
    writewords = data.get("writewords", 0)  # 默认值为0
    worknum = data.get("worknum", 0)  # 默认值为0
    
    # 确保数值字段为整数
    try:
        writewords = int(writewords) if writewords else 0
        worknum = int(worknum) if worknum else 0
    except ValueError:
        return jsonify({"success": False, "message": "写字数和作品数必须为数字"}), 400

    cursor = db.cursor()
    try:
        # 插入作者数据（触发器会自动执行验证和日志记录）
        cursor.execute("INSERT INTO author (author_id, authorname, password, writewords, worknum, level) VALUES (%s, %s, %s, %s, %s, '普通')",
                       (author_id, pen_name, password, writewords, worknum))
        db.commit()
        
        # 获取触发器执行后的日志信息
        cursor.execute("SELECT details FROM author_log WHERE author_id = %s ORDER BY action_time DESC LIMIT 1", (author_id,))
        log_result = cursor.fetchone()
        log_message = log_result[0] if log_result else "触发器执行完成"
        
        return jsonify({ 
            "success": True, 
            "message": "添加成功",
            "trigger_info": log_message
        })
    except mysql.connector.IntegrityError as e:
        db.rollback()
        if "Duplicate entry" in str(e):
            return jsonify({"success": False, "message": "作者ID已存在"}), 400
        else:
            return jsonify({"success": False, "message": f"数据完整性错误: {str(e)}"}), 400
    except mysql.connector.Error as e:
        db.rollback()
        # 检查是否是触发器抛出的自定义错误
        if "SQLSTATE 45000" in str(e) or e.errno == 1644:
            return jsonify({"success": False, "message": f"数据验证失败: {e.msg}"}), 400
        else:
            return jsonify({"success": False, "message": f"数据库错误: {str(e)}"}), 500
    except Exception as e:
        db.rollback()
        return jsonify({"success": False, "message": f"服务器错误: {str(e)}"}), 500
    finally:
        cursor.close()

# 删除作者
@app.route("/api/author/<author_id>", methods=["DELETE"])
def delete_author(author_id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM author WHERE author_id = %s", (author_id,))
    db.commit()
    return jsonify({ "success": True, "message": "作者已删除" })

# 更新作者信息
@app.route("/api/author/<author_id>", methods=["PUT"])
def update_author(author_id):
    try:
        data = request.get_json()
        
        # 只有当请求体中包含author_id且与URL中的不同时，才返回错误
        if "author_id" in data and str(data["author_id"]) != str(author_id):
            return jsonify({"error": "不可更改id"}), 400
        
        pen_name = data.get("authorname")
        password = data.get("password")
        writewords = data.get("writewords", 0)
        worknum = data.get("worknum", 0)
        level = data.get("level", "普通")
        
        cursor = db.cursor()
        
        # 调用存储过程
        cursor.callproc('UpdateAuthorInfo', [
            author_id, pen_name, password, writewords, worknum, level, 0, ''
        ])
        
        # 获取输出参数
        cursor.execute("SELECT @_UpdateAuthorInfo_6, @_UpdateAuthorInfo_7")
        result = cursor.fetchone()
        result_code = result[0] if result else 0
        message = result[1] if result else "未知错误"
        
        db.commit()
        cursor.close()
        
        if result_code == 1:
            return jsonify({"message": message}), 200
        elif result_code == 0:
            return jsonify({"error": "作者不存在"}), 404
        else:
            return jsonify({"error": message}), 500
        
    except Exception as e:
        return jsonify({"error": f"更新作者信息时发生错误: {str(e)}"}), 500

# ==================== 作品管理 API ====================
# 查询作品信息
@app.route("/api/works/<work_id>", methods=["GET"])
def get_work(work_id):
    cursor = db.cursor()
    cursor.execute("SELECT work_id, workname, category, score, author_id, authorname, pubtime, introduction FROM works WHERE work_id = %s", (work_id,))
    row = cursor.fetchone()
    if row:
        return jsonify({
            "success": True,
            "work": {
                "work_id": row[0],
                "workname": row[1],
                "category": row[2],
                "score": row[3],
                "author_id": row[4],
                "authorname": row[5],
                "pubtime": row[6],
                "introduction": row[7]
            }
        })
    else:
        return jsonify({ "success": False, "message": "作品不存在" })

# 添加作品
@app.route("/api/works", methods=["POST"])
def add_work():
    data = request.get_json()
    work_id = data.get("work_id")
    workname = data.get("workname")
    category = data.get("category")
    score = data.get("score")
    author_id = data.get("author_id")
    authorname = data.get("authorname")
    pubtime = data.get("pubtime")
    introduction = data.get("introduction")

    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO works (work_id, workname, category, score, author_id, authorname, pubtime, introduction) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                       (work_id, workname, category, score, author_id, authorname, pubtime, introduction))
        db.commit()
        return jsonify({ "success": True, "message": "添加成功" })
    except pymysql.err.IntegrityError:
        return jsonify({ "success": False, "message": "作品ID已存在" })

# 更新作品
@app.route("/api/works/<work_id>", methods=["PUT"])
def update_work(work_id):
    data = request.get_json()
    workname = data.get("workname")
    category = data.get("category")
    score = data.get("score")
    author_id = data.get("author_id")
    authorname = data.get("authorname")
    pubtime = data.get("pubtime")
    introduction = data.get("introduction")

    cursor = db.cursor()
    cursor.execute("UPDATE works SET workname=%s, category=%s, score=%s, author_id=%s, authorname=%s, pubtime=%s, introduction=%s WHERE work_id=%s",
                   (workname, category, score, author_id, authorname, pubtime, introduction, work_id))
    db.commit()
    return jsonify({ "success": True, "message": "更新成功" })

# 删除作品
@app.route("/api/works/<work_id>", methods=["DELETE"])
def delete_work(work_id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM works WHERE work_id = %s", (work_id,))
    db.commit()
    return jsonify({ "success": True, "message": "作品已删除" })

# ==================== 推荐管理 API ====================

# 查询推荐榜单信息
@app.route("/api/recommend/<work_id>", methods=["GET"])
def get_recommend(work_id):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM recommend WHERE work_id = %s", (work_id,))
    row = cursor.fetchone()
    if row:
        return jsonify({
            "success": True,
            "recommend": {
                "work_id": row[0],
                "workname": row[1],
                "rank": row[2],
                "category": row[3],
                "levell": row[4],
                "author_id": row[5],
                "authorname": row[6]
            }
        })
    else:
        return jsonify({ "success": False, "message": "推荐榜未找到该作品" })

# 添加推荐
@app.route("/api/recommend", methods=["POST"])
def add_recommend():
    data = request.get_json()
    work_id = data.get("work_id")
    workname = data.get("workname")
    rank = data.get("rank")
    category = data.get("category")
    level = data.get("levell")
    author_id = data.get("author_id")
    authorname = data.get("authorname")

    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO recommend (work_id, workname, rank, category, levell, author_id, authorname) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                       (work_id, workname, rank, category, level, author_id, authorname))
        db.commit()
        return jsonify({ "success": True, "message": "添加成功" })
    except pymysql.err.IntegrityError:
        return jsonify({ "success": False, "message": "推荐已存在" })

# 更新推荐榜单信息
@app.route("/api/recommend/<work_id>", methods=["PUT"])
def update_recommend(work_id):
    data = request.get_json()
    workname = data.get("workname")
    rank = data.get("rank")
    category = data.get("category")
    level = data.get("levell")
    author_id = data.get("author_id")
    authorname = data.get("authorname")

    cursor = db.cursor()
    cursor.execute("UPDATE recommend SET workname=%s, rank=%s, category=%s, levell=%s, author_id=%s, authorname=%s WHERE work_id=%s",
                   (workname, rank, category, level, author_id, authorname, work_id))
    db.commit()
    return jsonify({ "success": True, "message": "更新成功" })

# 删除推荐
@app.route("/api/recommend/<work_id>", methods=["DELETE"])
def delete_recommend(work_id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM recommend WHERE work_id = %s", (work_id,))
    db.commit()
    return jsonify({ "success": True, "message": "推荐已删除" })

# 推荐类别：获取所有类别
@app.route("/api/recommend/categories", methods=["GET"])
def get_categories():
    cursor = db.cursor()
    cursor.execute("SELECT DISTINCT category FROM recommend WHERE category IS NOT NULL AND category != ''")
    rows = cursor.fetchall()
    return jsonify({
        "success": True,
        "categories": [r[0] for r in rows]
    })

# ==================== 打赏管理 API ====================

# 查询打赏信息
@app.route("/api/reward/<work_id>", methods=["GET"])
def get_reward(work_id):
    cursor = db.cursor()
    cursor.execute("SELECT author_id, work_id, workname, tip, tipnum FROM reward WHERE work_id = %s", (work_id,))
    row = cursor.fetchone()
    if row:
        return jsonify({
            "success": True,
            "reward": {
                "author_id": row[0],
                "work_id": row[1],
                "workname": row[2],
                "tip": row[3],
                "tipnum": row[4]
            }
        })
    else:
        return jsonify({ "success": False, "message": "打赏记录不存在" })

# 添加打赏
@app.route("/api/reward", methods=["POST"])
def add_reward():
    data = request.get_json()
    author_id = data.get("author_id")
    work_id = data.get("work_id")
    workname = data.get("workname")
    tip = data.get("tip")
    tipnum = data.get("tipnum", 0)

    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO reward (author_id, work_id, workname, tip, tipnum) VALUES (%s, %s, %s, %s, %s)",
                       (author_id, work_id, workname, tip, tipnum))
        db.commit()
        return jsonify({ "success": True, "message": "添加成功" })
    except pymysql.err.IntegrityError:
        return jsonify({ "success": False, "message": "打赏记录已存在" })

# 更新打赏
@app.route("/api/reward/<work_id>", methods=["PUT"])
def update_reward(work_id):
    data = request.get_json()
    tip = data.get("tip")
    tipnum = data.get("tipnum")

    cursor = db.cursor()
    cursor.execute("UPDATE reward SET tip=%s, tipnum=%s WHERE work_id=%s",
                   (tip, tipnum, work_id))
    db.commit()
    return jsonify({ "success": True, "message": "更新成功" })

# 删除打赏（退款）
@app.route("/api/reward/<work_id>", methods=["DELETE"])
def delete_reward(work_id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM reward WHERE work_id = %s", (work_id,))
    db.commit()
    return jsonify({ "success": True, "message": "打赏记录已删除" })

# 使用视图查询作品详细信息
@app.route("/api/work-detail/<work_id>", methods=["GET"])
def get_work_detail_by_view(work_id):
    try:
        cursor = db.cursor()
        # 使用视图查询作品详细信息
        cursor.execute("""
            SELECT work_id, workname, category, score, pubtime, introduction, author_id, authorname 
            FROM work_detail_view 
            WHERE work_id = %s
        """, (work_id,))
        
        row = cursor.fetchone()
        cursor.close()
        
        if row:
            return jsonify({
                "work_id": row[0],
                "workname": row[1],
                "category": row[2],
                "score": row[3],
                "pubtime": row[6],
                "introduction": row[5],
                "author_id": row[6],
                "authorname": row[7]
            }), 200
        else:
            return jsonify({"error": "作品不存在"}), 404
            
    except Exception as e:
        return jsonify({"error": f"查询作品详细信息时发生错误: {str(e)}"}), 500

# 使用视图查询所有作品详细信息
@app.route("/api/work-details", methods=["GET"])
def get_all_work_details_by_view():
    try:
        cursor = db.cursor()
        # 使用视图查询所有作品详细信息
        cursor.execute("""
            SELECT work_id, workname, category, score, pubtime, introduction, author_id, authorname 
            FROM work_detail_view
            ORDER BY work_id
        """)
        
        rows = cursor.fetchall()
        cursor.close()
        
        works = []
        for row in rows:
            works.append({
                "work_id": row[0],
                "workname": row[1],
                "category": row[2],
                "score": row[3],
                "pubtime": row[4],
                "introduction": row[5],
                "author_id": row[6],
                "authorname": row[7]
            })
        
        return jsonify({
            "success": True,
            "works": works
        }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"查询作品详细信息时发生错误: {str(e)}"
        }), 500

if __name__ == "__main__":
    app.run(debug=True)
