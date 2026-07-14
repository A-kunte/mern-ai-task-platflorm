import os
import json
import time
import redis
from pymongo import MongoClient
from bson.objectid import ObjectId

# Initialize DB connections
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017/ai-tasks")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")

db_client = MongoClient(MONGO_URI)
db = db_client.get_default_database()

redis_client = redis.Redis.from_url(REDIS_URL)

print("🐍 Python background worker connected to Redis & MongoDB. Listening for tasks...")

def process_operation(text, op_type):
    """Executes the specific calculations required by the assignment spec sheet"""
    if op_type == "Uppercase":
        return text.upper()
    elif op_type == "Lowercase":
        return text.lower()
    elif op_type == "Reverse":
        return text[::-1]
    elif op_type == "Word Count":
        return str(len(text.split()))
    else:
        raise ValueError(f"Unknown operation type: {op_type}")

while True:
    try:
        # Pull incoming task from the Redis Queue block
        _, message = redis_client.blpop("task_queue")
        task_data = json.loads(message.decode("utf-8"))
        
        task_id = task_data["taskId"]
        input_text = task_data["inputText"]
        operation_type = task_data["operationType"]
        
        print(f"📦 Processing task {task_id} | Operation: {operation_type}")
        
        # Step 5: Transition state metadata to 'running' inside MongoDB
        db.tasks.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {"status": "running"}}
        )
        
        # Simulate background processing duration
        time.sleep(3)
        
        # Step 6 & 7: Process string calculation and write logs
        start_time = time.time()
        result_output = process_operation(input_text, operation_type)
        duration = round(time.time() - start_time, 4)
        
        execution_logs = f"Success: Action executed in {duration}s."
        
        # Step 8: Finalize database schema update marking success status
        db.tasks.update_one(
            {"_id": ObjectId(task_id)},
            {
                "$set": {
                    "status": "success",
                    "result": result_output,
                    "logs": execution_logs
                }
            }
        )
        print(f"✅ Completed task {task_id} successfully")
        
    except Exception as e:
        print(f"❌ Error encountered processing worker loop: {str(e)}")
        if 'task_id' in locals():
            db.tasks.update_one(
                {"_id": ObjectId(task_id)},
                {"$set": {"status": "failed", "logs": f"Error: {str(e)}"}}
            )