.PHONY: install-all run-all web-run admin-run web-install admin-install web-test admin-test

install-all:
	pnpm install

run-all:
	$(MAKE) -j2 web-run admin-run


# Web Project
web-run:
	pnpm --filter @mafan/web dev

web-test:
	pnpm --filter @mafan/web test

web-install:
	pnpm install --filter @mafan/web...

# Admin Project
admin-run:
	pnpm --filter @mafan/admin dev

admin-test:
	pnpm --filter @mafan/admin test

admin-install:
	pnpm install --filter @mafan/admin...

