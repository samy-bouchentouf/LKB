from ..database import SessionLocal
from ..models import KnowledgeItem


def get_document_chunks(document_id):
    db = SessionLocal()

    chunks = (
        db.query(KnowledgeItem)
        .filter(
            KnowledgeItem.document_id == document_id,
            KnowledgeItem.type == "pdf_chunk"
        )
        .order_by(
            KnowledgeItem.page_number,
            KnowledgeItem.chunk_index
        )
        .all()
    )

    db.close()

    return chunks


def get_chunks_from_page(document_id, page_number):
    db = SessionLocal()

    chunks = (
        db.query(KnowledgeItem)
        .filter(
            KnowledgeItem.document_id == document_id,
            KnowledgeItem.page_number == page_number
        )
        .order_by(KnowledgeItem.chunk_index)
        .all()
    )

    db.close()

    return chunks


def get_component_notes(component_id):
    db = SessionLocal()

    notes = (
        db.query(KnowledgeItem)
        .filter(
            KnowledgeItem.component_id == component_id,
            KnowledgeItem.type == "note"
        )
        .all()
    )

    db.close()

    return notes


def get_component_troubleshoots(component_id):
    db = SessionLocal()

    troubleshoots = (
        db.query(KnowledgeItem)
        .filter(
            KnowledgeItem.component_id == component_id,
            KnowledgeItem.type == "troubleshoot"
        )
        .all()
    )

    db.close()

    return troubleshoots


def get_experiment_knowledge(experiment_id):
    db = SessionLocal()

    knowledge = (
        db.query(KnowledgeItem)
        .filter(
            KnowledgeItem.experiment_id == experiment_id
        )
        .all()
    )

    db.close()

    return knowledge


def get_document_knowledge(document_id):
    db = SessionLocal()

    knowledge = (
        db.query(KnowledgeItem)
        .filter(
            KnowledgeItem.document_id == document_id
        )
        .all()
    )

    db.close()

    return knowledge