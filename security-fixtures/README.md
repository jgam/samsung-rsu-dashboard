# Intentionally vulnerable scanner fixture

`vulnerable.js` is copied verbatim from the user-supplied parent directory for security-tool training and detection verification only.

- It is never imported by the application.
- Vite does not bundle unreferenced files, and `.npmignore` excludes this directory from package publication.
- Do not run it, deploy it, or copy any pattern from it into application code.
- Security scans must report its validated, deliberately introduced findings as fixture-only training defects.
