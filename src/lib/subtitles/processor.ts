import type { SubtitleToolId } from './catalog';

export type SubtitleFormat = 'srt' | 'vtt' | 'ass' | 'unknown';

export interface SubtitleCue {
  start: number;
  end: number;
  text: string[];
}

function pad(value: number, size = 2) {
  return value.toString().padStart(size, '0');
}

export function normalizeSubtitleInput(input: string) {
  return input.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').trim();
}

export function detectSubtitleFormat(input: string): SubtitleFormat {
  const normalized = normalizeSubtitleInput(input);

  if (!normalized) {
    return 'unknown';
  }

  if (
    normalized.startsWith('WEBVTT') ||
    /^NOTE\b/m.test(normalized) ||
    /^\d{2}:\d{2}:\d{2}\.\d{3}\s-->/m.test(normalized)
  ) {
    return 'vtt';
  }

  if (
    /^\[Script Info\]/im.test(normalized) ||
    /^\[Events\]/im.test(normalized) ||
    /^Dialogue:/m.test(normalized)
  ) {
    return 'ass';
  }

  if (/^\d+\s*\n\d{2}:\d{2}:\d{2}[,.]\d{3}\s-->/m.test(normalized)) {
    return 'srt';
  }

  if (/^\d{2}:\d{2}:\d{2}[,.]\d{3}\s-->/m.test(normalized)) {
    return 'srt';
  }

  return 'unknown';
}

function srtOrVttTimestampToMs(timestamp: string) {
  const normalized = timestamp.replace(',', '.');
  const [hours, minutes, rest] = normalized.split(':');
  const [seconds, milliseconds] = rest.split('.');

  return (
    Number(hours) * 3600000 +
    Number(minutes) * 60000 +
    Number(seconds) * 1000 +
    Number(milliseconds)
  );
}

function assTimestampToMs(timestamp: string) {
  const [hours, minutes, rest] = timestamp.split(':');
  const [seconds, centiseconds = '00'] = rest.split('.');

  return (
    Number(hours) * 3600000 +
    Number(minutes) * 60000 +
    Number(seconds) * 1000 +
    Number(centiseconds.padEnd(2, '0').slice(0, 2)) * 10
  );
}

function formatSrtTime(totalMs: number) {
  const safe = Math.max(0, totalMs);
  const hours = Math.floor(safe / 3600000);
  const minutes = Math.floor((safe % 3600000) / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  const milliseconds = safe % 1000;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(milliseconds, 3)}`;
}

function formatVttTime(totalMs: number) {
  const safe = Math.max(0, totalMs);
  const hours = Math.floor(safe / 3600000);
  const minutes = Math.floor((safe % 3600000) / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  const milliseconds = safe % 1000;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}

function formatAssTime(totalMs: number) {
  const safe = Math.max(0, totalMs);
  const hours = Math.floor(safe / 3600000);
  const minutes = Math.floor((safe % 3600000) / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  const centiseconds = Math.floor((safe % 1000) / 10);

  return `${hours}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds, 2)}`;
}

export function parseSrt(input: string): SubtitleCue[] {
  const normalized = normalizeSubtitleInput(input);
  if (!normalized) {
    return [];
  }

  return normalized
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => line.trimEnd())
        .filter(Boolean);

      if (!lines.length) {
        return null;
      }

      const timeLineIndex = lines.findIndex((line) => line.includes('-->'));
      if (timeLineIndex === -1) {
        return null;
      }

      const [start, end] = lines[timeLineIndex]
        .split('-->')
        .map((part) => part.trim());

      return {
        start: srtOrVttTimestampToMs(start),
        end: srtOrVttTimestampToMs(end),
        text: lines.slice(timeLineIndex + 1),
      };
    })
    .filter(Boolean) as SubtitleCue[];
}

export function parseVtt(input: string): SubtitleCue[] {
  const normalized = normalizeSubtitleInput(input);
  if (!normalized) {
    return [];
  }

  const body = normalized
    .replace(/^WEBVTT[^\n]*\n*/i, '')
    .replace(/^NOTE[^\n]*\n(?:.*\n)*?\n/gm, '')
    .trim();

  return body
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => line.trimEnd())
        .filter(Boolean);

      if (!lines.length) {
        return null;
      }

      const timeLineIndex = lines.findIndex((line) => line.includes('-->'));
      if (timeLineIndex === -1) {
        return null;
      }

      const [start, end] = lines[timeLineIndex]
        .split('-->')
        .map((part) => part.trim().split(' ')[0]);

      return {
        start: srtOrVttTimestampToMs(start),
        end: srtOrVttTimestampToMs(end),
        text: lines.slice(timeLineIndex + 1),
      };
    })
    .filter(Boolean) as SubtitleCue[];
}

export function parseAss(input: string): SubtitleCue[] {
  const normalized = normalizeSubtitleInput(input);
  if (!normalized) {
    return [];
  }

  return normalized
    .split('\n')
    .filter((line) => line.startsWith('Dialogue:'))
    .map((line) => {
      const raw = line.replace(/^Dialogue:\s*/, '');
      const parts = raw.split(',');

      if (parts.length < 10) {
        return null;
      }

      const start = parts[1]?.trim();
      const end = parts[2]?.trim();
      const text = parts
        .slice(9)
        .join(',')
        .replace(/\{[^}]+\}/g, '')
        .replace(/\\N/g, '\n')
        .split('\n')
        .map((segment) => segment.trimEnd());

      return {
        start: assTimestampToMs(start),
        end: assTimestampToMs(end),
        text,
      };
    })
    .filter(Boolean) as SubtitleCue[];
}

export function parseSubtitleByFormat(
  input: string,
  format: SubtitleFormat
): SubtitleCue[] {
  switch (format) {
    case 'srt':
      return parseSrt(input);
    case 'vtt':
      return parseVtt(input);
    case 'ass':
      return parseAss(input);
    default:
      return [];
  }
}

export function serializeSrt(cues: SubtitleCue[]) {
  return cues
    .map((cue, index) =>
      [
        `${index + 1}`,
        `${formatSrtTime(cue.start)} --> ${formatSrtTime(cue.end)}`,
        ...cue.text.map((line) => line.trimEnd()),
      ].join('\n')
    )
    .join('\n\n')
    .trim();
}

export function serializeVtt(cues: SubtitleCue[]) {
  const content = cues
    .map((cue) =>
      [
        `${formatVttTime(cue.start)} --> ${formatVttTime(cue.end)}`,
        ...cue.text.map((line) => line.trimEnd()),
      ].join('\n')
    )
    .join('\n\n')
    .trim();

  return ['WEBVTT', '', content].join('\n');
}

const assHeader = `[Script Info]
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,36,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`;

export function serializeAss(cues: SubtitleCue[]) {
  const dialogue = cues
    .map((cue) => {
      const text = cue.text
        .map((line) => line.trimEnd())
        .join('\\N')
        .replace(/\n/g, '\\N');

      return `Dialogue: 0,${formatAssTime(cue.start)},${formatAssTime(
        cue.end
      )},Default,,0,0,0,,${text}`;
    })
    .join('\n');

  return [assHeader, dialogue].join('\n').trim();
}

function serializeByFormat(cues: SubtitleCue[], format: SubtitleFormat) {
  switch (format) {
    case 'srt':
      return serializeSrt(cues);
    case 'vtt':
      return serializeVtt(cues);
    case 'ass':
      return serializeAss(cues);
    default:
      return '';
  }
}

function shiftCueTimes(cues: SubtitleCue[], shiftMs: number) {
  return cues.map((cue) => ({
    ...cue,
    start: Math.max(0, cue.start + shiftMs),
    end: Math.max(0, cue.end + shiftMs),
  }));
}

function cleanCueText(cues: SubtitleCue[]) {
  return cues.map((cue) => ({
    ...cue,
    text: cue.text
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .filter((line, index, list) => !(line === '' && index === list.length - 1)),
  }));
}

export function processSubtitleTool(
  toolId: SubtitleToolId,
  input: string,
  shiftValue = '0'
) {
  const normalized = normalizeSubtitleInput(input);
  if (!normalized) {
    return '';
  }

  switch (toolId) {
    case 'srt-to-vtt':
      return serializeVtt(parseSrt(normalized));
    case 'vtt-to-srt':
      return serializeSrt(parseVtt(normalized));
    case 'srt-to-ass':
      return serializeAss(parseSrt(normalized));
    case 'ass-to-srt':
      return serializeSrt(parseAss(normalized));
    case 'vtt-to-ass':
      return serializeAss(parseVtt(normalized));
    case 'ass-to-vtt':
      return serializeVtt(parseAss(normalized));
    case 'subtitle-time-shifter': {
      const format = detectSubtitleFormat(normalized);
      const cues = parseSubtitleByFormat(normalized, format);
      if (!cues.length || format === 'unknown') {
        return normalized;
      }

      return serializeByFormat(
        shiftCueTimes(cues, Number(shiftValue || '0')),
        format
      );
    }
    case 'subtitle-cleaner': {
      const format = detectSubtitleFormat(normalized);
      const cues = parseSubtitleByFormat(normalized, format);
      if (!cues.length || format === 'unknown') {
        return normalized;
      }

      return serializeByFormat(cleanCueText(cues), format);
    }
    default:
      return normalized;
  }
}

export function inferOutputFormat(
  toolId: SubtitleToolId,
  input: string
): SubtitleFormat {
  switch (toolId) {
    case 'srt-to-vtt':
    case 'ass-to-vtt':
      return 'vtt';
    case 'vtt-to-srt':
    case 'ass-to-srt':
      return 'srt';
    case 'srt-to-ass':
    case 'vtt-to-ass':
      return 'ass';
    case 'subtitle-time-shifter':
    case 'subtitle-cleaner':
      return detectSubtitleFormat(input);
    default:
      return 'unknown';
  }
}

export function buildOutputFileName(
  inputName: string | null,
  toolId: SubtitleToolId,
  input: string
) {
  const outputFormat = inferOutputFormat(toolId, input);
  const extension =
    outputFormat === 'unknown'
      ? 'txt'
      : outputFormat === 'ass'
        ? 'ass'
        : outputFormat;

  if (!inputName) {
    return `subtitle-output.${extension}`;
  }

  const baseName = inputName.replace(/\.[^.]+$/, '');
  return `${baseName}.${extension}`;
}

