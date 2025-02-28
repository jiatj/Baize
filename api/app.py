import os
from dotenv import load_dotenv 
import time 
import sys


def is_db_command():
    if len(sys.argv) > 1 and sys.argv[0].endswith("flask") and sys.argv[1] == "db":
        return True
    return False


from flask import Response, current_app
from app_factory import create_app

# Load environment variables
load_dotenv()


# Get timezone from environment variables, default to UTC if not set
TIMEZONE = os.getenv('TIMEZONE', 'UTC')

# Set timezone based on platform
if os.name == "nt":
    # Windows: convert timezone format (e.g., Asia/Shanghai -> China Standard Time)
    timezone_mapping = {
        'Asia/Shanghai': 'China Standard Time',
        'UTC': 'UTC',
        # 可以根据需要添加更多映射
    }
    windows_timezone = timezone_mapping.get(TIMEZONE, 'UTC')
    print(windows_timezone)
    os.system(f'tzutil /s "{windows_timezone}"')
else:
    # Linux/Unix
    os.environ['TZ'] = TIMEZONE
    time.tzset()
    
# create app
if is_db_command():
    from app_factory import create_migrations_app

    app = create_migrations_app()
else:
    # It seems that JetBrains Python debugger does not work well with gevent,
    # so we need to disable gevent in debug mode.
    # If you are using debugpy and set GEVENT_SUPPORT=True, you can debug with gevent.
    if (flask_debug := os.environ.get("FLASK_DEBUG", "0")) and flask_debug.lower() in {"false", "0", "no"}:
        from gevent import monkey  # type: ignore

        # gevent
        monkey.patch_all()

        from grpc.experimental import gevent as grpc_gevent  # type: ignore

        # grpc gevent
        grpc_gevent.init_gevent()

        import psycogreen.gevent  # type: ignore

        psycogreen.gevent.patch_psycopg()

    from app_factory import create_app

    app = create_app()
    celery = app.extensions["celery"]


def print_routes():
    with app.app_context():
        print("\n=== 所有注册的路由 ===")
        for rule in current_app.url_map.iter_rules():
            print(f"路由: {rule.rule}")
            print(f"方法: {', '.join(rule.methods)}")
            print(f"终端点: {rule.endpoint}\n")

# 在应用启动时直接调用
# print_routes()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
