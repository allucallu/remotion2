# Adobe Stock metadata validation report

Generated: 2026-10-16

## Scope

- Active compositions found in `src/compositions/registry.tsx`: 31.
- Completed metadata rows: 31.
- Rows requiring filename review: 31, because no rendered video file exists locally to verify an exact Filename match.
- Other validation problems: 0.
- Source CSV found: none. The upload-ready CSV was created from the active composition registry.
- Rendered video files found: none (`.mp4`, `.mov`, `.webm`, and `.mkv`).
- Existing visual evidence inspected: still frames in `out/stills` covering the representative completed state for all five design groups. Additional entrance and exit stills were available for several assets.
- Motion, geometry, color, and black-background behavior were cross-checked against the corresponding source compositions and their registration IDs.

## CSV validation

- Output file: `adobe_stock_metadata_ready.csv`
- Required header and order: `Filename,Title,Keywords,Category,Releases`
- Rows: 31
- Duplicate filenames: none in the CSV
- Titles: 31 non-empty titles, each under 70 characters and with no commas
- Keywords: all non-empty; 18 to 25 unique keywords per row; no blank keyword items or duplicate keyword items in a row
- Categories: left blank because no original category values existed and no verified official category mapping was available in this workspace
- Releases: left blank because no release files were available
- Unsupported claims: no metadata contains alpha channel, transparent background, seamless loop, editable, customizable, template, or software-brand claims
- CSV is UTF-8 and uses a comma delimiter with CSV quoting for keyword cells
- File size and row count are below Adobe Stock CSV limits

## Filename verification needed before upload

There are no rendered video files in the workspace, so the Filename values are the active composition IDs with `.mp4` appended. They are a proposed render naming convention, not verified file matches. Before import, either render with exactly these names or update the Filename column to the final delivered video filenames without changing Title or Keywords.

The following proposed filename exceeds 30 characters and should be reviewed against the requested filename-length validation rule. It has not been shortened automatically:

- DocumentaryChapterFramework.mp4 (31 characters)

## Visual-review limitation

No rendered videos were available, so continuous entrance and exit motion could not be played back. Existing still frames and deterministic composition source were used to avoid unverified motion claims. The CSV therefore does not claim loop continuity, alpha transparency, or editability.

## Contributor Portal reminder

Set the metadata language to English in Adobe Stock Contributor Portal before importing this CSV.
