# Security Policy

## Supported Versions

| Version       | Supported |
| ------------- | --------- |
| 1.x (current) | Yes       |

## Reporting a Vulnerability

Found a security issue? **Do not open a public GitHub issue.**

Email: javapuzzle@outlook.com

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact

Expected response: within 7 days. Fixes will be released as a patch and disclosed after remediation.

## Scope

- `capture.js` — runs puppeteer locally; never send untrusted HTML to this script
- Generated HTML files — Mermaid.js loaded from jsDelivr CDN; diagrams are static, no server calls
- No auth, no user data, no network requests from generated diagrams

## Dependency Security

Dependencies are scanned automatically on every PR via `npm audit`. Dependabot opens PRs for security updates weekly.
