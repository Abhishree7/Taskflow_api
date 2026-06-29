import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_task(client: AsyncClient, auth_headers):
    resp = await client.post("/api/v1/tasks", json={"title": "Buy milk"}, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Buy milk"
    assert data["status"] == "todo"


@pytest.mark.asyncio
async def test_list_tasks_pagination(client: AsyncClient, auth_headers):
    for i in range(3):
        await client.post("/api/v1/tasks", json={"title": f"Task {i}"}, headers=auth_headers)
    resp = await client.get("/api/v1/tasks?page=1&page_size=2", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 2
    assert data["page"] == 1
    assert data["page_size"] == 2


@pytest.mark.asyncio
async def test_get_task(client: AsyncClient, auth_headers):
    create = await client.post("/api/v1/tasks", json={"title": "Specific task"}, headers=auth_headers)
    task_id = create.json()["id"]
    resp = await client.get(f"/api/v1/tasks/{task_id}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["id"] == task_id


@pytest.mark.asyncio
async def test_update_task(client: AsyncClient, auth_headers):
    create = await client.post("/api/v1/tasks", json={"title": "Old title"}, headers=auth_headers)
    task_id = create.json()["id"]
    resp = await client.patch(f"/api/v1/tasks/{task_id}", json={"title": "New title", "status": "done"}, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["title"] == "New title"
    assert resp.json()["status"] == "done"


@pytest.mark.asyncio
async def test_delete_task(client: AsyncClient, auth_headers):
    create = await client.post("/api/v1/tasks", json={"title": "To delete"}, headers=auth_headers)
    task_id = create.json()["id"]
    resp = await client.delete(f"/api/v1/tasks/{task_id}", headers=auth_headers)
    assert resp.status_code == 204
    get_resp = await client.get(f"/api/v1/tasks/{task_id}", headers=auth_headers)
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_task_not_found(client: AsyncClient, auth_headers):
    import uuid
    resp = await client.get(f"/api/v1/tasks/{uuid.uuid4()}", headers=auth_headers)
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_unauthenticated(client: AsyncClient):
    resp = await client.get("/api/v1/tasks")
    assert resp.status_code == 403
