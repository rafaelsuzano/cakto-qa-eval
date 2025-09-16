import pytest
import requests
import urllib3
import time
import json
from pytest_datasets import dataset

urllib3.disable_warnings()
url = 'http://localhost:3000/'
list_users = [] 

class Test_API_Health:

    def test_api_info(self):
        response = requests.get(url, verify=False)
        assert response.status_code == 200
        print(response.text)

    def test_health_check(self):
        response = requests.get(url + '/health', verify=False)
        assert response.status_code == 200
        print(response.text)

    def test_Get_Users(self):
        response = requests.get(url + '/users', verify=False)
        

        assert response.status_code == 200
        print(response.json())
        time.sleep(3) # Pause for 3 seconds
        userid = response.json()['data']
        for  user in userid:
            list_users.append(int(user['id']))


@dataset
def usuarios():
    return [
        list_users
    ]

def test_Get_User_By_ID(usuarios):  # <-- self + parâmetro
        print(usuarios)   # agora funciona

