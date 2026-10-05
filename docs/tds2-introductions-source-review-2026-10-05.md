# TDS2 introductions review — 2026-10-05

Compared all local content in TDS2-M00 and TDS2-M01: six guide sections, four pitfalls, fourteen recaps, objectives and six complete questions. Primary Tosca 2026.1 LTS documentation covers TestCase-Design, Test Data Service, type/item display, Find, Update, Move and API Scan data management. The inventory records exact source URLs and reviewed hashes.

Removed the claims that TDS data is inherently single-use, every application change automatically appears in TDS, a Status property is automatically managed, or a completed order automatically moves into Used. Explained explicit updates, lock lifetime and the difference between ReadOnly and unlocking. Focused tests can prepare prerequisites rather than always depend on earlier tests. Removed unverified historical product-catalog comparisons and the associated masking question; the replacement tests the documented non-locking read operation. The order question now states its explicit update assumptions.

Added 24 specific option explanations. Retained all question and section IDs and B/B/B answer keys. No local diagrams or interactive exercises. Academy videos/version/product comparisons were inaccessible; the rewritten lessons are clearly labeled independent documentation-based introductions. Synthetic examples were not executed against Tosca or DemoWebShop. Physical-device and assistive-technology tests remain unexecuted.

Validation: regenerated derived files with `npm run manifest:content`; `npm run check` passed 151/151. Initial shell 297.4 KB of the 300 KB budget. Regression coverage protects reviewed hashes, stable keys/anchors, non-locking reads and explicit state updates. Token 20261005m / quilyn-v128. Local commit only, no push.

Original queue remaining: 614 questions without option explanations and 129 modules pending local source comparison. All seven local TDS2 lessons now have a documentation-based content review; this does not certify their inaccessible Academy videos or runtime behavior. Final all-scope review remains open.
