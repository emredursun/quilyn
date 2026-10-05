# API project persistence and results review — 2026-10-05

Compared all objectives, seven local guide sections, six pitfalls, eleven recaps and eight questions in TAPI-M03/M04. Added 32 explanations, retaining IDs and B/B/B/B, B/C/B/A keys.

Read complete primary [Home menu](https://docs.tricentis.com/tosca-2026.1/en-us/content/tbox/api_scan_home_menu.htm), [payload editing](https://docs.tricentis.com/tosca-2026.1/en-us/content/tbox/api_scan_edit_payload.htm), [interface](https://docs.tricentis.com/tosca-2026.1/en-us/content/tbox/api_scan_working.htm), [message controls](https://docs.tricentis.com/tosca-2026.1/en-us/content/tbox/api_scan_message_section.htm) and [attachments](https://docs.tricentis.com/tosca-2026.1/en-us/content/tbox/api_scan_send_attachments.htm) bodies; applied the previously accessed RFC 9110 method/status definitions.

M03: payload saving preserves content, not every message setting or the whole project; loading or adding a payload file replaces current content. Removed uncertified autosave, automatic reopening, workspace-template/subset equivalence, exact copy-name algorithm, no-Undo claim and F2 shortcut. Explicit saved checkpoints provide known recovery states. Optional numeric prefixes are independent readability guidance, not automatic test execution order.

M04: Method/Endpoint/Resource are controls, not payload tabs. Added current multipart workflow: Add Files > Attachment for non-multipart messages; existing multipart uses Add Part and part metadata inspection. Removed universal attachment-tab assertion, response-as-oracle guidance, guaranteed 200 creation proof, insertion-order assumption and conflation with Reusable TestStepBlock parameters. The create/read example is explicitly contract-scoped and verifies identifiers/fields, pagination and cleanup separately.

Limits: Academy media/exercises unavailable and uncertified. Source illustrations not individually inspected. No local visual/interactive assets and no executed API Scan/Commander/device/AT tests. Unsupported historical behaviors are not presented as established current facts.

Validation: regenerated derived artifacts; `npm run check` 168/168 passed, shell 297.4 KB. Regression case covers exact reviewed hashes, keys, anchors, payload scope/replacement, checkpoint guidance, menu renaming, test ordering, multipart state and independent expected results. Shared token 20261005v / quilyn-v137. Local commit only; no push.

Remaining: 545 questions without explanations, 109 local module comparisons, recorded source-media/external-interaction limits, unavailable physical-device/AT execution and final all-scope review.
