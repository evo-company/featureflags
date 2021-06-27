__default__:
	@echo "Please specify a target to make"

setup.txt:
	pip-compile --index-url https://pypi.evo.dev/root/pypi/ --extra-index-url https://pypi.evo.dev/platform/pypi/ server/setup.py

tests-reqs:
	pip-compile --index-url https://pypi.evo.dev/root/pypi/ --extra-index-url https://pypi.evo.dev/platform/pypi/ requirements-tests.in

docs-reqs:
	pip-compile --index-url https://pypi.evo.dev/root/pypi/ --extra-index-url https://pypi.evo.dev/platform/pypi/ requirements-docs.in

proto:
	./scripts/protoc.sh

release-client:
	./scripts/release_check.sh
	cd client; python setup.py sdist --dist-dir ../dist

release-proto:
	./scripts/release_check.sh
	cd protobuf; python setup.py sdist --dist-dir ../dist

release: release-proto release-client

app-image:
	rm -rf server/featureflags/server/web/static
	pi webpack build
	@git ls-files -s server | git hash-object --stdin > checksum.txt
	@echo "checksum.txt => $$(cat checksum.txt)"
	pi image build app
	@echo "docker image => $$(pi image info --repo-tag app)"
	@git checkout checksum.txt
