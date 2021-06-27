extensions = [
    'sphinx.ext.autodoc',
    'sphinxcontrib.asyncio',
]

autoclass_content = 'both'
source_suffix = '.rst'
master_doc = 'index'

project = 'featureflags'
copyright = '2018, evo.company'
author = 'Vladimir Magamedov'

templates_path = []

html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']
html_theme_options = {
    'display_version': False,
}


def setup(app):
    app.add_stylesheet('style.css')
