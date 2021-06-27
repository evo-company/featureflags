from setuptools import setup, find_packages

setup(
    name='featureflags-client',
    version='0.2.0',
    description='Feature flags client',
    author='Vladimir Magamedov',
    author_email='vladimir@magamedov.com',
    packages=find_packages(),
    install_requires=[
        'hiku',
        'featureflags-protobuf>=0.1.4',
    ],
)
