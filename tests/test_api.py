import pytest
import requests
import urllib3
import time
import json
from pathlib import Path

urllib3.disable_warnings()

URL = 'http://localhost:3000'


filters_status = ['active', 'inactive','pending']
filters_name = [['Rafael',200], ['User',200], ['NonExistentName',200]]
filters_email = [['Rafael3@qa.com',200], ['Rafael1985@qa.com',200], ['Rafa',200]]
new_users_list = []
@pytest.fixture(scope="session")
def users_list():
    return []

@pytest.fixture(scope="session")
def new_users_list():
    return []

@pytest.fixture(scope="session")
def test_data():
    return json.loads(Path('users_data.json').read_text())


@pytest.fixture(scope="session")
def test_data_put():
    return json.loads(Path('users_data_put.json').read_text())

class TestAPI:

    def test_get_all_users_pages(self, users_list):
        # Primeiro, faz a requisição para a página 1 (sem parâmetros de paginação explícitos)
        response = requests.get(f'{URL}/users', verify=False)
        assert response.status_code == 200
        data = response.json()
        total_pages = data['pagination']['totalPages']
        
        # Adiciona os usuários da primeira página
        for user in data['data']:
            users_list.append(user['id'])

        # Itera sobre as páginas restantes
        for page in range(1, total_pages + 1):
            print(f"Buscando página {page} de {total_pages}")
            response = requests.get(f'{URL}/users?page={page}&limit=5', verify=False)
            print(response.json())
            assert response.status_code == 200
       
            if isinstance(response.json(), list):
                # Se for uma lista, itere diretamente sobre ela
                user_data = response.json()
            else:
                # Se for um dicionário (como a primeira página), acesse a chave 'data'
                user_data = response.json().get('data', [])
            
            for user in user_data:
                if user['id'] not in users_list:
                    users_list.append(user['id'])
                  
            time.sleep(1) 

        print("Usuários encontrados e adicionados à lista:", users_list)

    def test_get_user_by_id(self, users_list):
        ids_to_test = users_list + [9999, 'abc']
        print(f"IDs a serem testados: {ids_to_test}")

        for user_id in ids_to_test:
            endpoint = f'/users/{user_id}'
            response = requests.get(f'{URL}{endpoint}', verify=False)
            print(f"Resposta para ID {user_id}: {response.status_code} - {response.text}")

            if isinstance(user_id, int):
                assert response.status_code in [200, 404]
                
            else:
                assert response.status_code == 400

    def test_Post_users_data_(self, test_data):
        for case in test_data:
            print(f"Executando teste com dados do arquivo: {case['Teste']}")
            payload = {
                "name": case["name"],
                "email": case["email"],
                "age": case["age"],
                "status": case["status"]
            }
            print(f"Payload enviado: {payload}")
            response = requests.post(f'{URL}/users', json=payload, verify=False)
            
            print(f"Resposta: {response.status_code} - {response.text}")
            assert response.status_code == case["expected_status_code"]
            if response.status_code == 201:
           
                print(response.json())
            
            elif response.status_code == 200:
                print(response.json())

    def test_delete_users_created(self, new_users_list):
        print(f"IDs de usuários a serem deletados: {new_users_list}")
        for user_id in new_users_list:
            endpoint = f'/users/'+user_id
            response = requests.delete(f'{URL}{endpoint}', verify=False)
            assert response.status_code == 200
            print(f"Usuário com ID {user_id} deletado com sucesso.")
        
    @pytest.mark.parametrize("status", filters_status)
    def test_filter_users(self, status):
      
        print(f"Testando filtro de status: {status}")
        response = requests.get(f'{URL}/users?status={status}', verify=False)
        print(f"Resposta: {response.status_code} - {response.text}")
        assert response.status_code == 200
       

    @pytest.mark.parametrize("name, httpcode",filters_email)
    def test_filter_users_email(self, name,httpcode ):

        print(f"Testando filtro de email: {name} HTTP code: {httpcode}")
        response = requests.get(f'{URL}/users?search={name}', verify=False)
        print(f"Resposta: {response.status_code} - {response.text}")
        assert response.status_code == httpcode
    

    def test_Put_users_data_(self, test_data_put):
        for case in test_data_put:
            print(f"Executando teste com dados do arquivo: {case['Teste']}")
            payload = {
                "name": case["name"],
                "email": case["email"],
                "age": case["age"],
                "status": case["status"]
            }
            print(f"Payload enviado: {payload}")
            print("----------------------------------------------------------------------------------------------------------------------")
            response = requests.put(f'{URL}/users/1', json=payload, verify=False)
            print(f"Resposta: {response.status_code} - {response.text}")