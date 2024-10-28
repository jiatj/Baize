# Jiatj Memo

## 修改app的认证流程
1. 原来调用 api/passport ，文件位置 api/controllers/web/passport.py,  这个接口放弃，不调用，他会自动生成一个用户登录，相当于匿名登录。
2. 前端发现没有token或者401，则走单点登录
    2.1 单点登录配置
        2.1.1 sso配置sys_app
        2.1.1 Baize中配置app和secret
    2.2 调用登录地址，例如192.168.10.68/oauth2/authorize?appid=&redirect_uri=
    2.3 接收回调得到code
    2.4 调用api/auth2/login/{code}
        2.4.1 OAuth2Client  配置sso地址
    2.5 Baize 调用sso得到token
    2.6 如果本地没有用户，调用sso 的user/info得到用户信息，插入end_user中，其中externa_user_id是sso中用户的id
3. Baize验证token的过程 api.controllers.web.wraps.py
    3.1 注释掉 decoded = PassportService().verify(tk) 后的部分，即token合规就可以。然后从redis中得到用户信息，包含appid，然后生成app_model和end_user对象。如果想严谨一点，如果超过60分钟，则重新查数据库校验。
    3.2 有点不太严谨，暂时这样吧，可以解决目前的问题，而且，影响性不大。

 

 


## 配置
api/.env中配置
1. CELERY_BROKER_URL
2. REDIS_HOST
3. DB_HOST
4. WEAVIATE_ENDPOINT，如果使用其他向量数据库则设置对应的


## 启动
conda activate 3.10
cd api pip
run.bat

## 修改文件列表
###  api/services/file_service.py  新版中不同了。
1. 增加mp4
    ALLOWED_EXTENSIONS = ['txt', 'markdown', 'md', 'pdf', 'html', 'htm', 'xlsx', 'xls', 'docx', 'csv','mp4']

### api.controllers.web.wraps.py

注释掉 decoded = PassportService().verify(tk) 后的部分，即token合规就可以。然后从redis中得到用户信息，包含appid，然后生成app_model和end_user对象。如果想严谨一点，如果超过60分钟，则重新查数据库校验。

### pi.controllers.web._init__.py

import 增加  oauth2_login,oauth2_app

### .env 
增加 
~~~
# Timezone configuration (e.g. UTC, Asia/Shanghai)
TIMEZONE=Asia/Shanghai
~~~
### 修改 app.py
设置时区
~~~
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

~~~


## 增加文件
api/controllers/web下增加
1. oauth2_app.py，处理切换app的逻辑
2. oauth2_login.py，处理和sso的交互逻辑
3. OAuth2_client.py，封装sso的接口
 


## 过程中的问题
~~~
 File "D:\pyspace\dify-main\api\extensions\storage\local_storage.py", line 40, in load_once
    raise FileNotFoundError("File not found")
 读D:\pyspace\dify-main\api\storage/privkeys/23d23628-016a-4842-abd1-3d630c985fd1/private.pem   
~~~