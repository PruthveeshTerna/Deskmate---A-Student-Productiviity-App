"""Input validation helpers."""


def validate_required_fields(data: dict, fields: list[str]) -> str | None:
    """
    Check that all required fields are present and non-empty in data.
    Returns an error message string if validation fails, or None if OK.
    """
    if not data:
        return "Request body is required"

    missing = []
    for field in fields:
        value = data.get(field)
        if value is None or (isinstance(value, str) and not value.strip()):
            missing.append(field)

    if missing:
        return f"Missing required field(s): {', '.join(missing)}"
    return None


def clamp(value, min_val, max_val):
    """Clamp a numeric value between min and max."""
    return max(min_val, min(value, max_val))
