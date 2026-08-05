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


def test_create_farm(client):
    token = register_and_login(client)

    response = client.post(
        "/farms",
        json={
            "name": "North Field",
            "soil_type": "Black Cotton",
            "area": 2.5,
            "latitude": 22.7196,
            "longitude": 75.8577,
        },
        headers=auth_headers(token),
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "North Field"
    assert data["soil_type"] == "Black Cotton"
    assert data["area"] == 2.5
    assert "id" in data


def test_get_farms_empty(client):
    token = register_and_login(client)

    response = client.get("/farms", headers=auth_headers(token))

    assert response.status_code == 200
    assert response.json() == []


def test_get_farms(client):
    token = register_and_login(client)

    client.post(
        "/farms",
        json={
            "name": "North Field",
            "soil_type": "Black Cotton",
            "area": 2.5,
            "latitude": 22.7196,
            "longitude": 75.8577,
        },
        headers=auth_headers(token),
    )

    response = client.get("/farms", headers=auth_headers(token))

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "North Field"


def test_get_farm_by_id(client):
    token = register_and_login(client)

    create_response = client.post(
        "/farms",
        json={
            "name": "North Field",
            "soil_type": "Black Cotton",
            "area": 2.5,
            "latitude": 22.7196,
            "longitude": 75.8577,
        },
        headers=auth_headers(token),
    )
    farm_id = create_response.json()["id"]

    response = client.get(f"/farms/{farm_id}", headers=auth_headers(token))

    assert response.status_code == 200
    assert response.json()["id"] == farm_id


def test_get_farm_not_found(client):
    token = register_and_login(client)

    response = client.get("/farms/999", headers=auth_headers(token))

    assert response.status_code == 404
    assert response.json()["detail"] == "Farm not found"


def test_update_farm(client):
    token = register_and_login(client)

    create_response = client.post(
        "/farms",
        json={
            "name": "North Field",
            "soil_type": "Black Cotton",
            "area": 2.5,
            "latitude": 22.7196,
            "longitude": 75.8577,
        },
        headers=auth_headers(token),
    )
    farm_id = create_response.json()["id"]

    response = client.put(
        f"/farms/{farm_id}",
        json={"name": "South Field"},
        headers=auth_headers(token),
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "South Field"
    assert data["soil_type"] == "Black Cotton"


def test_delete_farm(client):
    token = register_and_login(client)

    create_response = client.post(
        "/farms",
        json={
            "name": "North Field",
            "soil_type": "Black Cotton",
            "area": 2.5,
            "latitude": 22.7196,
            "longitude": 75.8577,
        },
        headers=auth_headers(token),
    )
    farm_id = create_response.json()["id"]

    response = client.delete(f"/farms/{farm_id}", headers=auth_headers(token))

    assert response.status_code == 200
    assert response.json()["message"] == "Farm deleted successfully"

    # Verify it's gone
    get_response = client.get(f"/farms/{farm_id}", headers=auth_headers(token))
    assert get_response.status_code == 404


def test_farm_requires_auth(client):
    response = client.get("/farms")

    assert response.status_code == 401


def test_cannot_access_other_users_farm(client):
    # User 1 creates a farm
    token1 = register_and_login(client)

    create_response = client.post(
        "/farms",
        json={
            "name": "North Field",
            "soil_type": "Black Cotton",
            "area": 2.5,
            "latitude": 22.7196,
            "longitude": 75.8577,
        },
        headers=auth_headers(token1),
    )
    farm_id = create_response.json()["id"]

    # User 2 tries to access it
    client.post(
        "/auth/register",
        json={
            "username": "suresh",
            "email": "suresh@example.com",
            "password": "securepass123",
        },
    )
    login_response = client.post(
        "/auth/login",
        json={
            "email": "suresh@example.com",
            "password": "securepass123",
        },
    )
    token2 = login_response.json()["access_token"]

    response = client.get(f"/farms/{farm_id}", headers=auth_headers(token2))

    assert response.status_code == 404