"""Refresh browser caches when a local script or stylesheet changes."""

import hashlib
from pathlib import Path
import re
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit


def on_post_page(output, page, config):
    docs = Path(config["docs_dir"]).resolve()

    def version(match):
        url = urlsplit(match[2])
        if url.scheme or url.netloc:
            return match[0]
        relative = urljoin("/" + page.url, url.path).lstrip("/")
        if not relative.startswith("assets/") or not relative.endswith((".js", ".css")):
            return match[0]
        source = (docs / relative).resolve()
        if not source.is_relative_to(docs) or not source.is_file():
            return match[0]
        digest = hashlib.sha256(source.read_bytes()).hexdigest()[:16]
        query = [(key, value) for key, value in parse_qsl(url.query) if key != "v"]
        query.append(("v", digest))
        updated = urlunsplit(url._replace(query=urlencode(query)))
        return match[1] + updated + match[3]

    return re.sub(r'((?:src|href)=[\"\x27])([^\"\x27]+)([\"\x27])', version, output)
