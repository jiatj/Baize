import requests

class OAuth2Client():
    
    @staticmethod
    def _send_request(url, params):
        try:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                json_response = response.json()
                print(json_response)
                if json_response.get(OAuth2Config.RESPONSE_CODE_KEY) == 200:
                    return json_response.get(OAuth2Config.RESPONSE_DATA_KEY)
                else:
                    print(f"Error: {json_response.get(OAuth2Config.RESPONSE_MSG_KEY)}")
                    return None
            else:
                print(f"Failed to reach server, status code: {response.status_code}, response: {response.text}")
                return None
        except requests.RequestException as e:
            print(f"Request failed: {e}")
            return None
    
    @staticmethod
    def get_access_token(code):
        if not code:
            raise ValueError("Code cannot be empty.")
        
        # 构建请求数据
        data = {
            'appid': OAuth2Config.APP_ID,
            'secret': OAuth2Config.APP_SECRET,
            'code': code
        }
        
        return OAuth2Client._send_request(OAuth2Config.TOKEN_URL, data)

    # 得到用户信息
    @staticmethod
    def get_user_info(access_token, openid):
        if not access_token or not openid:
            raise ValueError("Access token and openid cannot be empty.")
        
        # 构建请求数据
        data = {
            'access_token': access_token,
            'openid': openid,
            'lang': 'ZH'
        }
        
        return OAuth2Client._send_request(OAuth2Config.USER_URL, data)
        
        

class OAuth2Config:
    TOKEN_URL = 'http://192.168.10.68:8080/sso/oauth2/token'
    USER_URL= 'http://192.168.10.68:8080/sso/user/info'
    APP_ID = '8cf949fc-9ea4-4b70-80f1-57a1f5f89bf3'
    APP_SECRET= 'abcde333333dafasdf@@@'

    RESPONSE_CODE_KEY = 'code'
    RESPONSE_DATA_KEY = 'data'
    RESPONSE_MSG_KEY = 'msg'
    
    # 使用示例
    # url = 'http://localhost:8098/sso/oauth2/token'  # SSO 服务器的 URL
    # appid = '8cf949fc-9ea4-4b70-80f1-57a1f5f89bf3'  # 你的应用 ID
    # secret = 'abcde333333dafasdf@@@'  # 你的应用密钥
    # code = '1c9cc583-7d54-45d4-b985-f79388c9c697'  # 从 SSO 服务器接收的 code

    # # 调用函数
    # access_data = get_access_token(url, appid, secret, code)
    # if access_data:
    #     print(f"Access Token: {access_data.get('access_token')}")
    #     print(f"Expires In: {access_data.get('expires_in')}")
    #     # ... 打印其他需要的数据