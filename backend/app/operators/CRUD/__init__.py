from .base import CRUD

from ..models import (
    Component,
    Experiment,
    Document,
    User,
    KnowledgeItem
)

crud_component = CRUD(Component)
crud_experiment = CRUD(Experiment)
crud_document = CRUD(Document)
crud_user = CRUD(User)
crud_knowledge = CRUD(KnowledgeItem)