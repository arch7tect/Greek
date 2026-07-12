# Lesson audio workflow

Use this workflow only when audio files are present.

## Identify recordings

1. Run `file` and `ffprobe` even when an extension looks correct; some valid MP3
   files have unusual headers.
2. Record duration, codec, sample rate, and channels.
3. Determine the matching exercise from spoken labels, word count, order, and
   the worksheet. Do not rely on opaque filenames.

## Transcribe locally

Prefer an already available local recognizer. In this project, a suitable
fallback is:

```bash
uvx --from mlx-whisper mlx_whisper INPUT.mp3 \
  --model mlx-community/whisper-small-mlx \
  --language el \
  --task transcribe \
  --word-timestamps True \
  --output-format all \
  --output-dir tmp/audio/lesson-NN \
  --verbose False
```

Use an initial prompt only to provide exercise context, never to force an
answer. Keep model output under `tmp/`.

## Verify

- Align transcript order with visible blanks or printed words.
- Treat low-confidence words and phoneme contrasts as unresolved.
- Extract a short ambiguous clip with `ffmpeg` and transcribe it again without
  an answer-biased prompt.
- For a choice such as `π/φ/θ`, confirm both the heard consonant and whether the
  resulting Greek word matches the printed remainder.
- Preserve the worksheet's spelling and stress over a recognizer's misspelling.
- If disagreement remains, mark `[проверить по аудио]` and keep the word out of
  the cumulative dictionary.

## Record evidence

Add each audio file to the lesson page's «Материалы и качество» section with
duration, mapped exercise, recognition method, and verification notes. Update
homework and vocabulary only after the mapping is established.
