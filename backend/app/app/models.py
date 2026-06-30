from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Table
)
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

component_experiment = Table(
    "component_experiment",
    Base.metadata,
    Column("component_id", ForeignKey("component.id"), primary_key=True),
    Column("experiment_id", ForeignKey("experiment.id"), primary_key=True),
)

class Component(Base):
    __tablename__ = "component"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String)
    manufacturer = Column(String)
    reference = Column(String)
    serial_number = Column(String)
    location = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    experiments = relationship(
        "Experiment",
        secondary=component_experiment,
        back_populates="components"
    )
    knowledge_items = relationship(
        "KnowledgeItem",
        back_populates="component"
    )

class Experiment(Base):
    __tablename__ = "experiment"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    components = relationship(
        "Component",
        secondary=component_experiment,
        back_populates="experiments"
    )
    knowledge_items = relationship(
        "KnowledgeItem",
        back_populates="experiment"
    )

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True)
    role = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    knowledge_items = relationship(
        "KnowledgeItem",
        back_populates="author"
    )

class Document(Base):
    __tablename__ = "document"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    type = Column(String)
    authors = Column(String)
    year = Column(Integer)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    knowledge_items = relationship(
        "KnowledgeItem",
        back_populates="document"
    )

class KnowledgeItem(Base):
    __tablename__ = "knowledge_item"
    id = Column(Integer, primary_key=True)
    source_type = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    page_number = Column(Integer)
    chunk_index = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    component_id = Column(Integer, ForeignKey("component.id"))
    experiment_id = Column(Integer, ForeignKey("experiment.id"))
    document_id = Column(Integer, ForeignKey("document.id"))
    author_id = Column(Integer, ForeignKey("user.id"))
    component = relationship(
        "Component",
        back_populates="knowledge_items"
    )
    experiment = relationship(
        "Experiment",
        back_populates="knowledge_items"
    )
    document = relationship(
        "Document",
        back_populates="knowledge_items"
    )
    author = relationship(
        "User",
        back_populates="knowledge_items"
    )