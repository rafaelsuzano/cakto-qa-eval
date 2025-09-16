import pytest
import requests

BASE_URL = "http://localhost:3000"

@pytest.mark.benchmark(group="slow-endpoints")
def test_slow_endpoint(benchmark):
    """
    Mede o tempo de resposta do endpoint /slow-endpoint.
    """
    benchmark(lambda: requests.get(f"{BASE_URL}/slow-endpoint"))

@pytest.mark.benchmark(group="slow-endpoints")
def test_slow_endpoint_with_delay(benchmark):
    """
    Mede o tempo de resposta do endpoint /slow-endpoint com um delay.
    """
    benchmark(lambda: requests.get(f"{BASE_URL}/slow-endpoint?delay=2000"))