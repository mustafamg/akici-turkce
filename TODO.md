# TODO: Fix YouTube URL Validation and Difficulty Saving

## Completed Tasks
- [x] Updated onSave() in video-metadata-preview.ts to include difficulty in saveData
- [x] Added validation to check if difficulty is set before saving
- [x] Updated YouTube URL regex in add-video-form.ts to accept more formats (embed, v/, shorts/, query params with &)

## Summary of Changes
- **video-metadata-preview.ts**: Added difficulty to VideoSaveRequest and validation for it
- **add-video-form.ts**: Updated youtubeUrlValidator regex to be more permissive

## Next Steps
- Test the changes with a valid YouTube URL
- Ensure difficulty is properly set in metadata before saving
- Verify that the URL validation now accepts various YouTube URL formats
