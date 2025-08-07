extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.intersphinx",
    "sphinx_inline_tabs",
]

autoclass_content = "both"
autodoc_member_order = "bysource"

intersphinx_mapping = {
    "python": ("https://docs.python.org/3.6", None),
}

source_suffix = ".rst"
master_doc = "index"

project = "Feature Flags"
copyright = "2025, Evo Company"
author = "Evo Company"

templates_path = []

html_theme = "furo"
html_static_path = ["_static"]
html_theme_options = {}
