from setuptools import setup, find_packages

setup(
    name='evo-featureflags-client',
    version='0.3.1',
    description='Feature flags client',
    author='Vladimir Magamedov',
    author_email='vladimir@magamedov.com',
    packages=find_packages(),
    install_requires=[
        'hiku',
        'evo_featureflags-protobuf>=0.2.0',
    ],
)
