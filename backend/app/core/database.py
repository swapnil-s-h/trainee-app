from pgvector.asyncpg import register_vector
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import event

from app.core.config import settings
import asyncio


engine = create_async_engine(
    settings.database_url,
    echo=False,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    connect_args={
        "server_settings": {"application_name": "trainee_app"},
    },
)


# ✅ FIXED VERSION
@event.listens_for(engine.sync_engine, "connect")
def connect(dbapi_connection, connection_record):
    loop = asyncio.get_event_loop()
    if loop.is_running():
        loop.create_task(register_vector(dbapi_connection))
    else:
        loop.run_until_complete(register_vector(dbapi_connection))


AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()