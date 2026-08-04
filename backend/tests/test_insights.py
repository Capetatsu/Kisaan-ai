def register_and_login(client):
    client.post(
        "/auth/register",
        json={
            "username": "ramesh",
            "email": "ramesh@example.com",
            "password": "securepass123",
        },
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "ramesh@example.com",
            "password": "securepass123",
        },
    )

    return response.json()["access_token"]


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


def test_ai_ask_requires_auth(client):
    response = client.post(
        "/insights/ai/ask",
        json={"question": "When to spray tomato?"},
    )

    assert response.status_code == 401


def test_ai_ask_fallback_without_key(client):
    token = register_and_login(client)

    response = client.post(
        "/insights/ai/ask",
        json={"question": "When to spray tomato?"},
        headers=auth_headers(token),
    )

    assert response.status_code == 200
    data = response.json()
    assert "problem" in data
    assert "reason" in data
    assert "action" in data
    assert "confidence" in data


def test_weather_requires_auth(client):
    response = client.get("/insights/weather")

    assert response.status_code == 401


def test_weather_fallback_without_key(client):
    token = register_and_login(client)

    response = client.get("/insights/weather", headers=auth_headers(token))

    assert response.status_code == 200
    data = response.json()
    assert "temp" in data
    assert "condition" in data
    assert "rainChance" in data
    assert "humidity" in data
    assert "wind" in data


def test_market_prices_requires_auth(client):
    response = client.get("/insights/market/prices")

    assert response.status_code == 401


def test_market_prices(client):
    token = register_and_login(client)

    response = client.get("/insights/market/prices", headers=auth_headers(token))

    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "crop" in data[0]
    assert "price" in data[0]
    assert "trend" in data[0]


def test_nearby_mandi(client):
    token = register_and_login(client)

    response = client.get("/insights/market/mandi", headers=auth_headers(token))

    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "distance" in data
    assert "open" in data