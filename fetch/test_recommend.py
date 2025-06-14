import pymysql
import json
import requests

# 方法1：直接数据库插入
def insert_test_data():
    try:
        db = pymysql.connect(
            host="localhost",
            port=3306,
            user="root",
            password="123456",
            database="homework",
            charset="utf8mb4"
        )
        
        cursor = db.cursor()
        
        # 先清空表（可选）
        cursor.execute("DELETE FROM recommend")
        
        # 插入测试数据
        test_data = [
            (1, '霸道总裁爱上我', '1', '言情', '热门', 1, '张三'),
            (2, '修仙传奇', '2', '玄幻', '推荐', 2, '李四'),
            (3, '都市重生', '3', '都市', '新书', 3, '王五')
        ]
        
        for data in test_data:
            cursor.execute(
                "INSERT INTO recommend (work_id, workname, rank, category, level, author_id, authorname) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                data
            )
            print(f"插入成功: {data[1]}")
        
        db.commit()
        print("所有测试数据插入完成！")
        
    except Exception as e:
        print(f"数据库插入失败: {e}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()

# 方法2：通过API插入
def test_api():
    url = "http://localhost:5000/api/recommend"
    
    test_data = {
        "work_id": 1,
        "workname": "霸道总裁爱上我",
        "rank": "1",
        "category": "言情",
        "level": "热门",
        "author_id": 1,
        "authorname": "张三"
    }
    
    try:
        response = requests.post(url, json=test_data)
        print(f"API响应状态码: {response.status_code}")
        print(f"API响应内容: {response.text}")
    except Exception as e:
        print(f"API请求失败: {e}")

if __name__ == "__main__":
    print("=== 测试数据库直接插入 ===")
    insert_test_data()
    
    print("\n=== 测试API插入 ===")
    test_api()
    
    print("\n=== 测试查询API ===")
    try:
        response = requests.get("http://localhost:5000/api/recommend/1")
        print(f"查询响应: {response.text}")
    except Exception as e:
        print(f"查询失败: {e}")