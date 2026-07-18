"""
Conversation history module.

Extracts, formats and limits conversation
history used by the conversational
retrieval and response generation pipeline.
"""

EXTENDED_HISTORY_LIMIT = 30

RECENT_HISTORY_LIMIT = 5


def get_extended_history(
    messages: list[dict]
    ) -> list:
    """
    Return the extended conversation history
    used for question rewriting.
    """

    if not messages:
        return []

    limit = EXTENDED_HISTORY_LIMIT * 2

    return messages[-limit:]


def get_recent_history(
    messages: list[dict]
    ) -> list:
    """
    Return the recent conversation history
    used during answer generation.
    """

    if not messages:
        return []

    limit = RECENT_HISTORY_LIMIT * 2

    return messages[-limit:]


def format_history(
    messages: list[dict]
    ) -> str:
    """
    Convert conversation messages into
    a formatted dialogue string suitable
    for prompt construction.
    """

    if not messages:
        return ""

    lines = []

    for message in messages:

        role = (
            "User"
            if message.get("role") == "user"
            else "Assistant"
        )

        content = (
            message.get("content", "")
            .strip()
        )

        if not content:
            continue

        lines.append(
            f"{role}: {content}"
        )

    return "\n\n".join(lines)