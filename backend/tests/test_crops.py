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


def create_farm(client, token):
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
    return response.json()["id"]


def test_create_crop(client):
    token = register_and_login(client)
    farm_id = create_farm(client, token)

    response = client.post(
        f"/farms/{farm_id}/crops",
        json={
            "name": "Wheat",
            "variety": "HD-2967",
            "season": "RABI",
            "planted_at": "2026-07-15",
            "expected_harvest": "2026-11-20",
            "status": "GROWING",
        },
        headers=auth_headers(token),
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Wheat"
    assert data["variety"] == "HD-2967"
    assert data["season"] == "RABI"
    assert data["status"] == "GROWING"
    assert data["farm_id"] == farm_id


def test_get_crops_empty(client):
    token = register_and_login(client)
    farm_id = create_farm(client, token)

    response = client.get(
        f"/farms/{farm_id}/crops",
        headers=auth_headers(token),
    )

    assert response.status_code == 200
    assert response.json() == []


def test_get_crops(client):
    token = register_and_login(client)
    farm_id = create_farm(client, token)

    client.post(
        f"/farms/{farm_id}/crops",
        json={
            "name": "Wheat",
            "season": "RABI",
            "planted_at": "2026-07-15",
        },
        headers=auth_headers(token),
    )

    response = client.get(
        f"/farms/{farm_id}/crops",
        headers=auth_headers(token),
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Wheat"


def test_get_crop_by_id(client):
    token = register_and_login(client)
    farm_id = create_farm(client, token)

    create_response = client.post(
        f"/farms/{farm_id}/crops",
        json={
            "name": "Wheat",
            "season": "RABI",
            "planted_at": "2026-07-15",
        },
        headers=auth_headers(token),
    )
    crop_id = create_response.json()["id"]

    response = client.get(
        f"/farms/{farm_id}/crops/{crop_id}",
        headers=auth_headers(token),
    )

    assert response.status_code == 200
    assert response.json()["id"] == crop_id


def test_get_crop_not_found(client):
    token = register_and_login(client)
    farm_id = create_farm(client, token)

    response = client.get(
        f"/farms/{farm_id}/crops/999",
        headers=auth_headers(token),
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Crop not found"


def test_update_crop(client):
    token = register_and_login(client)
    farm_id = create_farm(client, token)

    create_response = client.post(
        f"/farms/{farm_id}/crops",
        json={
            "name": "Wheat",
            "season": "RABI",
            "planted_at": "2026-07-15",
        },
        headers=auth_headers(token),
    )
    crop_id = create_response.json()["id"]

    response = client.put(
        f"/farms/{farm_id}/crops/{crop_id}",
        json={"status": "HARVESTED"},
        headers=auth_headers(token),
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HARVESTED"
    assert data["name"] == "Wheat"


def test_delete_crop(client):
    token = register_and_login(client)
    farm_id = create_farm(client, token)

    create_response = client.post(
        f"/farms/{farm_id}/crops",
        json={
            "name": "Wheat",
            "season": "RABI",
            "planted_at": "2026-07-15",
        },
        headers=auth_headers(token),
    )
    crop_id = create_response.json()["id"]

    response = client.delete(
        f"/farms/{farm_id}/crops/{crop_id}",
        headers=auth_headers(token),
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Crop deleted successfully"

    # Verify it's gone
    get_response = client.get(
        f"/farms/{farm_id}/crops/{crop_id}",
        headers=auth_headers(token),
    )
    assert get_response.status_code == 404


def test_create_crop_farm_not_found(client):
    token = register_and_login(client)

    response = client.post(
        "/farms/999/crops",
        json={
            "name": "Wheat",
            "season": "RABI",
            "planted_at": "2026-07-15",
        },
        headers=auth_headers(token),
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Farm not found"


def test_cannot_access_other_users_crops(client):
    # User 1 creates farm and crop
    token1 = register_and_login(client)
    farm_id = create_farm(client, token1)

    create_response = client.post(
        f"/farms/{farm_id}/crops",
        json={
            "name": "Wheat",
            "season": "RABI",
            "planted_at": "2026-07-15",
        },
        headers=auth_headers(token1),
    )
    crop_id = create_response.json()["id"]

    # User 2 tries to access
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

    response = client.get(
        f"/farms/{farm_id}/crops/{crop_id}",
        headers=auth_headers(token2),
    )

    assert response.status_code == 404