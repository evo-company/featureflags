from setuptools import setup, find_packages

setup(
    name='featureflags-server',
    version='0.1.0',
    description='Feature flags server',
    author='Vladimir Magamedov',
    author_email='vladimir@magamedov.com',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'featureflags-protobuf',
        'taskqueue-client',
        'grpclib>=0.3.3rc1',
        'sanic',
        'click',
        'hiku',
        'sqlalchemy',
        'aiopg',
        'strictconf>=0.3.0rc2',
        'metricslog',
        'pyyaml',
        'pyjwt',
        'ldap3',
        'alembic',
        'prometheus_client',
    ],
)
