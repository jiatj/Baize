from flask_restful import reqparse
from controllers.web.wraps import WebApiResource
from controllers.web import api
from core.helper import encrypter
from extensions.ext_database import db
from models.api_based_extension import APIBasedExtension, APIBasedExtensionPoint
from core.extension.api_based_extension_requestor import APIBasedExtensionRequestor


# 外部API扩展
class ExtensionResource(WebApiResource):
    def get(self, app_model, end_user, api_name, variable):
        parser = reqparse.RequestParser()
        parser.add_argument("inputs", type=dict, required=True, location="json")
        parser.add_argument("query", type=str, required=False, location="json", default="")
        parser.add_argument("files", type=list, required=False, location="json")
        parser.add_argument("conversation_id", type=str, default="", location="json")


        args = parser.parse_args()
        app_id = app_model.id
        query = args["query"]
        inputs = args["inputs"]

        # get api_based_extension
        api_based_extension = (
            db.session.query(APIBasedExtension)
            .filter(APIBasedExtension.tenant_id == self.tenant_id, APIBasedExtension.name == api_name)
            .first()
        )

        if not api_based_extension:
            raise ValueError(
                f"Error: api_name {api_name}, variable {variable} is invalid"
            )

        # decrypt api_key
        api_key = encrypter.decrypt_token(tenant_id=self.tenant_id, token=api_based_extension.api_key)

        try:
            requestor = APIBasedExtensionRequestor(api_endpoint=api_based_extension.api_endpoint, api_key=api_key)
            response_json = requestor.request(
                point=APIBasedExtensionPoint.APP_EXTERNAL_DATA_TOOL_QUERY,
                params={
                    "app_id": app_id,
                    "tool_variable": variable,
                    "external_user_id": end_user.external_user_id,
                    "conversation_id": args["conversation_id"],
                    "inputs": inputs,
                    "query": query
                },
            )
        except Exception as e:
            raise ValueError(f"[External data tool] api_name: {api_name}, variable: {variable}, API query failed, error: {e}")

        if "result" not in response_json:
            raise ValueError(
                f"[External data tool] API query failed, api_name: {api_name}, variable: {variable}, error: result not found in response"
            )

        if not isinstance(response_json["result"], str):
            raise ValueError(
                f"[External data tool] API query failed, api_name: {api_name},  variable: {variable}, error: result is not string"
            )

        return response_json["result"]

api.add_resource(ExtensionResource, '/ext_api/<string:api_name>/<string:variable>') 