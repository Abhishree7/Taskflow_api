import math
import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task
from app.schemas.task import PaginatedTasks, TaskCreate, TaskOut, TaskUpdate


async def create_task(db: AsyncSession, data: TaskCreate, owner_id: uuid.UUID) -> Task:
    task = Task(**data.model_dump(), owner_id=owner_id)
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


async def get_task(db: AsyncSession, task_id: uuid.UUID, owner_id: uuid.UUID) -> Task | None:
    result = await db.execute(select(Task).where(Task.id == task_id, Task.owner_id == owner_id))
    return result.scalar_one_or_none()


async def list_tasks(db: AsyncSession, owner_id: uuid.UUID, page: int, page_size: int) -> PaginatedTasks:
    offset = (page - 1) * page_size
    total_result = await db.execute(select(func.count()).select_from(Task).where(Task.owner_id == owner_id))
    total = total_result.scalar_one()
    tasks_result = await db.execute(
        select(Task).where(Task.owner_id == owner_id).order_by(Task.created_at.desc()).offset(offset).limit(page_size)
    )
    tasks = tasks_result.scalars().all()
    return PaginatedTasks(
        items=[TaskOut.model_validate(t) for t in tasks],
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total else 0,
    )


async def update_task(db: AsyncSession, task_id: uuid.UUID, owner_id: uuid.UUID, data: TaskUpdate) -> Task | None:
    task = await get_task(db, task_id, owner_id)
    if not task:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    await db.commit()
    await db.refresh(task)
    return task


async def delete_task(db: AsyncSession, task_id: uuid.UUID, owner_id: uuid.UUID) -> bool:
    task = await get_task(db, task_id, owner_id)
    if not task:
        return False
    await db.delete(task)
    await db.commit()
    return True
