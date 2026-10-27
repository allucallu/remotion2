# Adobe Stock metadata research notes

This project uses `adobe_stock_metadata.csv` for the active motion-graphic
compositions. Metadata is written in English as one consistent submission
language, with the most literal visual subject at the start of both title and
keyword order.

## Applied rules

- Titles describe the visible subject and stay below Adobe Stock's 70-character
  CSV limit. They avoid brands, named artists, people, and unsupported claims.
- Keywords are unique within a row, ordered by buyer relevance, and stay below
  Adobe Stock's 50-keyword limit. The first ten identify the subject, format,
  visual treatment, and core use case.
- Each item uses category `8` (Graphic Resources) because these are abstract
  motion-graphic elements, mattes, diagrams, and looping design accents rather
  than footage of a real-world subject.
- Filenames are planned export names and remain under the 30-character CSV
  filename limit. Rename a row only if the exported MP4 filename changes.

## Source guidance consulted

- Adobe Stock: [Tips for effective titles and keywords](https://helpx.adobe.com/stock/contributor/content-policies-guidelines/metadata/tips-effective-titles-keywords.html)
  — concise accurate titles, up to 49 keywords, and relevance-weighted keyword
  ordering.
- Adobe Stock: [CSV requirements](https://helpx.adobe.com/stock/contributor/manage-your-portfolio/csv-requirements-content.html)
  — UTF-8 CSV, required filename/title/keywords fields, 30-character filename,
  70-character title, and 50-keyword limits.
- Adobe Stock: [Maximize metadata to get discovered](https://helpx.adobe.com/stock/contributor/help/artist-hub-migration/maximize-metadata-to-get-discovered.html)
  — first ten keywords are especially important and accuracy is preferable to
  stuffing terms.

## Submission reminder

Adobe Stock's final category selection and any AI-content disclosure must match
the actual exported asset and Contributor Portal workflow. The CSV does not
replace the portal's required content-type or release selections.
