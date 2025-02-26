from functools import wraps

from flask import request
from flask_restful import Resource  # type: ignore
from werkzeug.exceptions import BadRequest, NotFound, Unauthorized

from controllers.web.error import WebSSOAuthRequiredError
from extensions.ext_database import db
from libs.passport import PassportService
from models.model import App, EndUser, Site
from services.enterprise.enterprise_service import EnterpriseService
from services.feature_service import FeatureService
from extensions.ext_redis import redis_client


def validate_jwt_token(view=None):
    def decorator(view):
        @wraps(view)
        def decorated(*args, **kwargs):
            app_model, end_user = decode_jwt_token()

            return view(app_model, end_user, *args, **kwargs)

        return decorated

    if view:
        return decorator(view)
    return decorator


def decode_jwt_token():
    system_features = FeatureService.get_system_features()
    app_code = request.headers.get("X-App-Code")
    try:
        auth_header = request.headers.get("Authorization")
        if auth_header is None:
            raise Unauthorized("Authorization header is missing.")

        if " " not in auth_header:
            raise Unauthorized("Invalid Authorization header format. Expected 'Bearer <api-key>' format.")

        auth_scheme, tk = auth_header.split(None, 1)
        auth_scheme = auth_scheme.lower()

        if auth_scheme != "bearer":
            raise Unauthorized("Invalid Authorization header format. Expected 'Bearer <api-key>' format.")
        decoded = PassportService().verify(tk)
        uuid =  decoded.get('uuid')
        if not uuid:
            print('Token is not issued by Baize ')
            raise Unauthorized('Token not valiated, not issued by Baize')
        # 不使用redis缓存appid
        # app_id = redis_client.get('app:'+uuid);
     
        # if not app_id:
        #     print(' redis app_id is NoneType ')
        #     raise Unauthorized('app id not found')
        
        # app_id = app_id.decode()

        # print('uuid='+uuid+' app_id='+app_id)
        # 我们的前端传app_code，原来的前端只有passport传
        if not app_code:
            app_code = decoded.get('app_code')
        site = db.session.query(Site).filter(Site.code == app_code).first()
        
        app_model = db.session.query(App).filter(App.id ==site.app_id).first()
        #app_model = db.session.query(App).filter(App.id == decoded["app_id"]).first()
      
        if not app_model:
            print(f'appid={site.app_id} not found ')
            raise NotFound()
        # if not app_code or not site:
        #     raise BadRequest("Site URL is no longer valid.")
        if app_model.enable_site is False:
            raise BadRequest("Site is disabled.")
        end_user = db.session.query(EndUser).filter(EndUser.id == decoded["end_user_id"]).first()
        if not end_user:
            raise NotFound()

        # _validate_web_sso_token(decoded, system_features, app_code)

        return app_model, end_user
    except Unauthorized as e:
        if system_features.sso_enforced_for_web:
            app_web_sso_enabled = EnterpriseService.get_app_web_sso_enabled(app_code).get("enabled", False)
            if app_web_sso_enabled:
                raise WebSSOAuthRequiredError()

        raise Unauthorized(e.description)

# 这个引用已经废弃
def _validate_web_sso_token(decoded, system_features, app_code):
    app_web_sso_enabled = False

    # Check if SSO is enforced for web, and if the token source is not SSO, raise an error and redirect to SSO login
    if system_features.sso_enforced_for_web:
        app_web_sso_enabled = EnterpriseService.get_app_web_sso_enabled(app_code).get("enabled", False)
        if app_web_sso_enabled:
            source = decoded.get("token_source")
            if not source or source != "sso":
                raise WebSSOAuthRequiredError()

    # Check if SSO is not enforced for web, and if the token source is SSO,
    # raise an error and redirect to normal passport login
    if not system_features.sso_enforced_for_web or not app_web_sso_enabled:
        source = decoded.get("token_source")
        if source and source == "sso":
            raise Unauthorized("sso token expired.")


class WebApiResource(Resource):
    method_decorators = [validate_jwt_token]
