import uuid

from flask import request
from flask_restful import Resource
from werkzeug.exceptions import NotFound, Unauthorized

from controllers.web import api
from controllers.web.error import WebSSOAuthRequiredError,AppUnavailableError
from extensions.ext_database import db
from libs.passport import PassportService
from models.model import App, EndUser, Site
from services.feature_service import FeatureService
from controllers.web.oauth2_client import OAuth2Client
from models.account import Tenant
from extensions.ext_redis import redis_client


# jiatj 20241104增加  inner universal token登录

class IUTokenResource(Resource):
     

    """Base resource for Auth2LoginResource."""
    def get(self, token):
        print(f'iu token ={token}' )
        
        if token is None:
            raise Unauthorized('PathVariable token  missed.')
        # system_features = FeatureService.get_system_features()
        # if system_features.sso_enforced_for_web:
        #     raise WebSSOAuthRequiredError()
     

        app_id = None
        # if app_id is None:
        #     raise Unauthorized('X-App-Id header is missing.')
        
        # 根据code获取access_token
        ssoUser = OAuth2Client.exchange_access_token(token)
        if not  ssoUser:
            raise Unauthorized('token 失效')
        # 得到openid 和 token
        openid= ssoUser.get("openid")
        mobile = ssoUser.get('mobile')
        # 根据openid得到用户
        end_user = db.session.query(EndUser).filter(EndUser.external_user_id == openid).first()
  
         # 得到apps
        infos = ssoUser.get("infos")
        apps = infos.get("apps")   
        nick_name = ssoUser.get("nickname")
        default_app = self.get_default_app(apps)
        print(f'defalt app 肯定有啊={default_app}')

        # 用户不存在，则从sso得到用户然后创建用户
        if not end_user:
            # 得到 tenant
            tenant = db.session.query(Tenant).first()
            tenant_id = tenant.id
            # app_id 设置成0，即end_user不是按app_id分配    
            end_user = EndUser(
                tenant_id = tenant_id,
                app_id= default_app,
                external_user_id=openid,
                name = mobile,
                type='browser',
                is_anonymous=False,
                session_id=generate_session_id(),
            )

            db.session.add(end_user)
            db.session.commit() 
       
        end_user.app_id = default_app
    
        str_uuid = end_user.id
   
            
        print('uuid 也是userid='+str_uuid)
       
       
       
        
        # 否则，取上次访问的app
        last_app_id = redis_client.get('app:'+str_uuid)
        print(f'last_app_id={last_app_id}')    
        if last_app_id:
            # redis中app_id已经失效
            if self.validate_app_id(apps, last_app_id)==False:
               print(f'last_app_id not valid')
               app_id = default_app
               redis_client.set('app:'+str_uuid, app_id)
            else:
               app_id = last_app_id
               self.set_default_app(apps, app_id)
        else:
                # 否则，使用默认
            app_id = default_app
            redis_client.set('app:'+str_uuid, app_id)
            
        print(f'最终app_id={app_id}')        
        
        # 根据app_id得到site，然后得到site的code，即是app_code
        site = db.session.query(Site).filter(Site.app_id == app_id, Site.status == "normal").first()
        
        if not site:
            print(f'appid={app_id} not found site 奇怪')
            site = db.session.query(Site).filter(Site.status == "normal").first()
            print(f'new appid={site.app_id} code={site.code}')
            # raise NotFound()
        
        app_code= site.code
        payload = {
            "iss": 'itgo',
            'sub': 'Web API Passport',
            # 'app_id': '0',
            'app_code': app_code,
            'uuid': str_uuid,
            'end_user_id': end_user.id,
        }
        
        tk = PassportService().issue(payload)
        return {
            'access_token': tk,
            'apps':apps,
            'app_code': app_code,
            'mobile':mobile,
            'nick_name': nick_name
        }

    def get_default_app(self,apps):
        for app in apps:
            if app.get("actived") == 'y':
                return app.get("appId")
        raise AppUnavailableError()
    
    def set_default_app(self,apps,app_id):
        for app in apps:
            app["actived"] = 'n'
        for app in apps:
            if(app.get("appId")==app_id):
                    app["actived"] = 'y'
    #验证当前的appid是否在apps中
    def validate_app_id(self, apps,app_id):
        
        for app in apps:
            if app.get("appId") == app_id:
                return True
        return False
    
api.add_resource(IUTokenResource, '/iu_token/<token>')


def generate_session_id():
    """
    Generate a unique session ID.
    """
    while True:
        session_id = str(uuid.uuid4())
        existing_count = db.session.query(EndUser) \
            .filter(EndUser.session_id == session_id).count()
        if existing_count == 0:
            return session_id

 