import json
import os
import jwt
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def verify_jwt_token(token: str):
    try:
        return jwt.decode(token, os.environ['JWT_SECRET'], algorithms=['HS256'])
    except:
        return None

def handler(event, context):
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        headers = event.get('headers', {})
        token = headers.get('x-auth-token') or headers.get('X-Auth-Token')
        
        if not token:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Токен не предоставлен'}),
                'isBase64Encoded': False
            }
        
        payload = verify_jwt_token(token)
        
        if not payload:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Невалидный токен'}),
                'isBase64Encoded': False
            }
        
        user_id = payload['user_id']
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'save_test_result':
                test_id = body_data.get('test_id')
                score = body_data.get('score')
                total_questions = body_data.get('total_questions')
                xp_gained = body_data.get('xp_gained', 50)
                
                cur.execute(
                    "INSERT INTO test_results (user_id, test_id, score, total_questions) VALUES (%s, %s, %s, %s)",
                    (user_id, test_id, score, total_questions)
                )
                
                cur.execute(
                    "UPDATE users SET xp = xp + %s, tests_completed = tests_completed + 1, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                    (xp_gained, user_id)
                )
                
                cur.execute(
                    "SELECT xp, level FROM users WHERE id = %s",
                    (user_id,)
                )
                user_data = cur.fetchone()
                
                new_level = user_data['level']
                new_xp = user_data['xp']
                
                while new_xp >= 500:
                    new_level += 1
                    new_xp -= 500
                
                if new_level != user_data['level']:
                    cur.execute(
                        "UPDATE users SET level = %s, xp = %s WHERE id = %s",
                        (new_level, new_xp, user_id)
                    )
                
                conn.commit()
                
                cur.execute(
                    "SELECT id, username, email, level, xp, tests_completed FROM users WHERE id = %s",
                    (user_id,)
                )
                updated_user = cur.fetchone()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'user': dict(updated_user)}),
                    'isBase64Encoded': False
                }
            
            elif action == 'unlock_achievement':
                achievement_id = body_data.get('achievement_id')
                
                try:
                    cur.execute(
                        "INSERT INTO user_achievements (user_id, achievement_id) VALUES (%s, %s)",
                        (user_id, achievement_id)
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': True}),
                        'isBase64Encoded': False
                    }
                except psycopg2.IntegrityError:
                    conn.rollback()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': True, 'message': 'Достижение уже разблокировано'}),
                        'isBase64Encoded': False
                    }
        
        elif method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            action = query_params.get('action')
            
            if action == 'get_achievements':
                cur.execute(
                    "SELECT achievement_id FROM user_achievements WHERE user_id = %s",
                    (user_id,)
                )
                achievements = [row['achievement_id'] for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'achievements': achievements}),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_test_history':
                cur.execute(
                    "SELECT test_id, score, total_questions, completed_at FROM test_results WHERE user_id = %s ORDER BY completed_at DESC LIMIT 10",
                    (user_id,)
                )
                history = [dict(row) for row in cur.fetchall()]
                
                for item in history:
                    item['completed_at'] = item['completed_at'].isoformat() if item['completed_at'] else None
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'history': history}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неизвестное действие'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
