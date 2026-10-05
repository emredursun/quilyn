# SOAP comparison, order flow and manual preparation — 2026-10-05

Reviewed all local TAPI-M09/M10/M11 objectives, sections, pitfalls, recaps, questions, hints and rationales. Added 44 option explanations for 11 questions; IDs and A/B/A/A, A/B/A/A, A/A/A keys retained.

Corrected SOAP HTTP-only/POST-only assumptions using the SOAP 1.2 messaging/binding specification. Authentication is contract-specific; SOAP does not mandate repeated username/password credentials or erase server business state. Removed unsupported popularity rankings, historical demo execution claims and universal cosmetic-formatting guarantees.

Request Add and buffer uses Insert with a buffer reference. Auto fill scope follows current documentation. MONTHFIRST/MONTHLAST examples now distinguish expression output from complete interval coverage: a 01:00 start misses the first hour; 23:59:59 may omit subsecond events; neither supplies a timezone. Pricing checks need independently defined currency/rounding rules. Manual preparation before deployment is distinguished from actual endpoint or simulation execution. Pretty Print is formatting, not validation; SOAP headers/media types depend on the version and binding.

Primary references and exact hashes are in the inventory. Read relevant SOAP message, binding, HTTP-method and security sections and REST constraints, plus the complete Tosca attribute-creation, date-expression, TestStepValue, clipboard, export, Home-menu and sending article bodies. Standards were reviewed for these relevant sections, not claimed to have been audited in their entirety. Academy videos/exercises and historical demo execution were unavailable; source images were not individually inspected. No local visual/interactive assets in these modules; no Tosca/device/AT execution.

`npm run manifest:content` regenerated derived files. `npm run check`: 171/171 passed; shell 297.4 KB. Regression checks binding scope, credentials, month-range omissions and endpoint preparation. `git diff --check` passed. Asset token `20261005y`; cache `quilyn-v140`. Local commit only, no push/deployment.
