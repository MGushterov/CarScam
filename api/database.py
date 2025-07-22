from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from config import DATABASE_URL

engine = create_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = scoped_session(sessionmaker(bind=engine, autoflush=False, future=True))
