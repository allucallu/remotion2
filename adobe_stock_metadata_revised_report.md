# Adobe Stock metadata revision report

Generated: 2026-10-16

## A. CSV format checks

- Output file: `adobe_stock_metadata_revised.csv`
- Required header preserved exactly: `Filename,Title,Keywords,Category,Releases`.
- Row count is unchanged: 31 asset rows.
- CSV is UTF-8 with comma delimiter and quoted keyword cells.
- Each row has five columns; no duplicate Filename values were found.
- All Title values are present, contain no comma, and are within the 70-character limit.
- Every Keywords cell is present, has 18 to 22 unique non-empty terms, and remains below the 49-keyword limit.
- Category and Releases remain blank. No verified official category number or matching release file was available.
- File size remains below Adobe Stock's 1 MB CSV limit and row count remains below 5,000.

## B. Metadata relevance review

- The first ten keywords for every asset were reviewed and reordered to lead with asset type, primary subject or style, principal function, and the strongest visual differentiator.
- Halloween assets now prioritize their visible subject and Halloween theme before supporting colors or decorative details.
- Blank lower thirds now prioritize `lower third`, `blank lower third`, their actual style or structural feature, then `motion graphics`, `nameplate`, `caption bar`, `title background`, and `copy space` where applicable.
- Keyword lists were diversified by visible geometry. Examples include `checkerboard pattern`, `serrated edge`, `zigzag connector`, `perforated rail`, `blue semicircle`, `diagonal ribbon`, and `coral square`.
- `EditorialSerifIdentifier.mp4` no longer contains `Serif` in its Title or `serif style` in Keywords because the final lower third is blank.
- `half disc anchor` and `cobalt half disc` were replaced with the more natural `blue semicircle` and `semicircle panel`.
- `coral lock` was replaced with `coral square` and `square module`.
- Unsupported contextual terms were removed where applicable, including `occult` from the black-cat and broom assets.
- No metadata claims alpha channel, transparent background, seamless looping, editability, customizability, templates, MOGRT, vector output, or software brands.

## C. Filename matching

### Error

- `DocumentaryChapterFramework.mp4` is 31 characters long, exceeding Adobe Stock's 30-character Filename limit.

### Not yet verified

- No rendered video files were available in the workspace at validation time. Therefore, no Filename value could be matched against a final rendered video, including extension and capitalization.
- The 31 filenames in the CSV have been retained unchanged from the prior file. They are proposed render names derived from the active composition IDs, not verified video filenames.

### Required follow-up

- Before import, render or locate the final videos and confirm each Filename cell exactly matches its final file.
- If the affected video is ultimately renamed, a suitable shorter proposal is `DocChapterFramework.mp4`; do not rename the video or CSV filename without applying the same final naming decision consistently.

## D. Visual and motion evidence actually reviewed

- No final MP4, MOV, WEBM, or other rendered video was present, so final-video playback and filename matching were not verified.
- Existing project stills and the source composition registry were the evidence used for the prior metadata pass; the current revision only changed metadata order and wording, not the assets.
- The prior visual pass covered the identifiable still-state geometry, colors, black backgrounds, and blank-panel status of the active compositions.
- Claims about specific animation behavior are intentionally limited to the neutral term `motion graphics`; no unverified loop, alpha, or editability claims were added.

## E. Open items

1. **Error:** `DocumentaryChapterFramework.mp4` exceeds the 30-character filename limit.
2. **Not yet verified:** all 31 Filename values must be checked against actual rendered files when those files exist.
3. **Not yet verified:** final-video motion has not been played back because no rendered videos were available.
4. **Editorial suggestion:** set the metadata language to **English** in Adobe Stock Contributor Portal before importing this CSV.

## Before and after examples

| Filename | Before | After |
| --- | --- | --- |
| EditorialSerifIdentifier.mp4 | Title: `Blank Editorial Serif Identifier Lower Third on Black`<br>First ten: `lower third`, `blank lower third`, `editorial identifier`, `serif style`, `ivory outline`, `black background`, `nameplate`, `title background`, `caption bar`, `copy space` | Title: `Blank Editorial Lower Third with Ivory Lines on Black`<br>First ten: `lower third`, `blank lower third`, `editorial lower third`, `motion graphics`, `nameplate`, `caption bar`, `title background`, `copy space`, `black background`, `ivory lines` |
| NeoBrutalismHalfDiscAnchor.mp4 | Title: `Blank Neo Brutalist Half Disc Anchor Lower Third`<br>First ten: `lower third`, `blank lower third`, `neo brutalism`, `half disc anchor`, `cobalt half disc`, `ivory panel`, `lavender strip`, `yellow backing`, `coral tab`, `black background` | Title: `Blank Neo Brutalist Lower Third with Blue Semicircle`<br>First ten: `lower third`, `blank lower third`, `neo brutalism`, `motion graphics`, `blue semicircle`, `semicircle panel`, `nameplate`, `caption bar`, `copy space`, `black background` |
| NeoBrutalismSplitLevelCard.mp4 | Title: `Blank Neo Brutalist Split Level Lower Third with Coral Lock`<br>First ten: `lower third`, `blank lower third`, `neo brutalism`, `split level card`, `acid yellow panel`, `blue module`, `lavender backing`, `coral lock`, `ivory strip`, `black background` | Title: `Blank Neo Brutalist Split Level Lower Third with Coral Square`<br>First ten: `lower third`, `blank lower third`, `neo brutalism`, `motion graphics`, `split level card`, `coral square`, `nameplate`, `caption bar`, `copy space`, `black background` |
| HalloweenBlackCat.mp4 | Title: unchanged<br>First ten: `black cat`, `halloween cat`, `cat outline`, `amber eyes`, `animated cat`, `black background`, `cat tail`, `spooky cat`, `ivory outline`, `halloween animation` | Title: unchanged<br>First ten: `black cat`, `halloween cat`, `animated cat`, `cat outline`, `amber eyes`, `cat tail`, `black background`, `cat silhouette`, `spooky cat`, `ivory outline` |
| NeoBrutalismCheckeredEdge.mp4 | Title: unchanged<br>First ten: `lower third`, `blank lower third`, `neo brutalism`, `checkered edge`, `yellow panel`, `lavender strip`, `coral backing`, `outlined squares`, `black background`, `nameplate` | Title: unchanged<br>First ten: `lower third`, `blank lower third`, `neo brutalism`, `motion graphics`, `checkered edge`, `checkerboard pattern`, `nameplate`, `caption bar`, `copy space`, `black background` |
