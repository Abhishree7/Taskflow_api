import logging

logger = logging.getLogger(__name__)


async def send_welcome_email(ctx, user_id: str, email: str):
    """Background job: simulate sending a welcome email."""
    logger.info("Sending welcome email to %s (user_id=%s)", email, user_id)
    # plug in an email provider (SendGrid, SES, etc.) here
    return {"status": "sent", "to": email}


async def process_task_export(ctx, user_id: str):
    """Background job: simulate exporting a user's tasks to CSV."""
    logger.info("Exporting tasks for user_id=%s", user_id)
    return {"status": "exported", "user_id": user_id}


class WorkerSettings:
    redis_settings = None  # set at startup from app config
    functions = [send_welcome_email, process_task_export]
    max_jobs = 10
    job_timeout = 300
