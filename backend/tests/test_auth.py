def test_register_success(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "ramesh",
            "email": "ramesh@example.com",
            "password": "securepass123",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "ramesh"
    assert data["email"] == "ramesh@example.com"
    assert "id" in data


def test_register_duplicate_email(client):
    payload = {
        "username": "ramesh",
        "email": "ramesh@example.com",
        "password": "securepass123",
    }

    client.post("/auth/register", json=payload)

    response = client.post("/auth/register", json=payload)

    assert response.status_code == 400
    assert response.json()["detail"] == "User already exists"


def test_register_duplicate_username(client):
    payload = {
        "username": "ramesh",
        "email": "ramesh@example.com",
        "password": "securepass123",
    }

    client.post("/auth/register", json=payload)

    response = client.post(
        "/auth/register",
        json={
            "username": "ramesh",
            "email": "other@example.com",
            "password": "securepass123",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "User already exists"


def test_login_success(client):
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

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_password(client):
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
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_login_nonexistent_user(client):
    response = client.post(
        "/auth/login",
        json={
            "email": "nobody@example.com",
            "password": "securepass123",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"