"""
Document hashing module.

Generates a unique hash for a document based
on its content.
"""

import hashlib


def compute_file_hash(file_path: str) -> str:
    """Generate a SHA256 hash from a file."""

    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:

        for chunk in iter(
            lambda: file.read(4096),
            b""
        ):
            sha256.update(chunk)

    return sha256.hexdigest()