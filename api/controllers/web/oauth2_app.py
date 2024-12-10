import uuid

from flask import request
from flask_restful import Resource
from werkzeug.exceptions import NotFound, Unauthorized, BadRequest

from libs.passport import PassportService
from controllers.web import api
 
from extensions.ext_database import db
from libs.passport import PassportService
from models.model import App, EndUser, Site
 
 
 
from extensions.ext_redis import redis_client


# jiatj 20240812增加
# redis中写入app_id
class Auth2AppResource(Resource):
    """Base resource for Auth2AppResource."""
    def get(self,app_id):
        
        if app_id is None:
            raise Unauthorized('PathVariable app_id  missed.')
   
        auth_header = request.headers.get('Authorization')
        if auth_header is None:
            raise Unauthorized('Authorization header is missing.')

        if ' ' not in auth_header:
            raise Unauthorized('Invalid Authorization header format. Expected \'Bearer <api-key>\' format.')

        auth_scheme, tk = auth_header.split(None, 1)
        auth_scheme = auth_scheme.lower()

        if auth_scheme != 'bearer':
            raise Unauthorized('Invalid Authorization header format. Expected \'Bearer <api-key>\' format.')
        decoded = PassportService().verify(tk)

        uuid = decoded.get('uuid')
  
        app_model = db.session.query(App).filter(App.id == app_id).first()
        
        if not app_model:
            raise NotFound()

        site = db.session.query(Site).filter(Site.app_id == app_id).first()
        if  not site:
            raise BadRequest('Site URL is no longer valid.')
        
        end_user = db.session.query(EndUser).filter(EndUser.id == decoded['end_user_id']).first()
        if not end_user:
            raise NotFound()
      
        # 缓存appid，如果没有，需要切换app
        if app_id !='0':
            # redis_client.setex('app.'+uuid, 24*60*60, app_id)
            redis_client.set('app:'+uuid,  app_id)
         
        return {
            'app_code': site.code,
        }


api.add_resource(Auth2AppResource, '/app/switch/<app_id>')
