import type { SubtitleToolId } from './catalog';

export type SubtitleFormat = 'srt' | 'vtt' | 'ass' | 'smi' | 'sbv' | 'txt' | 'unknown';

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

  if (/<SAMI\b/i.test(normalized) || /<SYNC\s+Start\s*=/i.test(normalized)) {
    return 'smi';
  }

  if (/^(?:\d+:)?\d{1,2}:\d{2}\.\d{3}\s*,\s*(?:\d+:)?\d{1,2}:\d{2}\.\d{3}$/m.test(normalized)) {
    return 'sbv';
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

export function timestampInputToMs(input: string) {
  const normalized = input.trim().replace(',', '.');
  if (!normalized) {
    return 0;
  }

  if (/^-?\d+$/.test(normalized)) {
    return Number(normalized);
  }

  const parts = normalized.split(':');
  if (parts.length === 2) {
    const [minutes, secondsPart] = parts;
    const [seconds, milliseconds = '0'] = secondsPart.split('.');

    return (
      Number(minutes) * 60000 +
      Number(seconds) * 1000 +
      Number(milliseconds.padEnd(3, '0').slice(0, 3))
    );
  }

  if (parts.length === 3) {
    const [hours, minutes, secondsPart] = parts;
    const [seconds, milliseconds = '0'] = secondsPart.split('.');

    return (
      Number(hours) * 3600000 +
      Number(minutes) * 60000 +
      Number(seconds) * 1000 +
      Number(milliseconds.padEnd(3, '0').slice(0, 3))
    );
  }

  return 0;
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

function smiTimestampToMs(timestamp: string) {
  return Number.parseInt(timestamp, 10);
}

export function parseSmi(input: string): SubtitleCue[] {
  const normalized = normalizeSubtitleInput(input);
  if (!normalized) {
    return [];
  }

  const syncMatches = [
    ...normalized.matchAll(/<SYNC\s+Start\s*=\s*["']?(\d+)["']?[^>]*>([\s\S]*?)(?=<SYNC\s+Start\s*=|<\/BODY>|<\/SAMI>|$)/gi),
  ];

  return syncMatches
    .map((match, index) => {
      const start = smiTimestampToMs(match[1]);
      const nextStart = syncMatches[index + 1]
        ? smiTimestampToMs(syncMatches[index + 1][1])
        : start + 2000;
      const text = match[2]
        .replace(/<br\s*\/?\s*>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .split('\n')
        .map((line) => cleanSubtitleLine(line))
        .filter(Boolean);

      if (!text.length || text.every((line) => /^&nbsp;$/i.test(line))) {
        return null;
      }

      return {
        start,
        end: Math.max(start + 1, nextStart),
        text,
      };
    })
    .filter(Boolean) as SubtitleCue[];
}

export function parseSbv(input: string): SubtitleCue[] {
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

      const timeLineIndex = lines.findIndex((line) =>
        /^(?:\d+:)?\d{1,2}:\d{2}\.\d{3}\s*,\s*(?:\d+:)?\d{1,2}:\d{2}\.\d{3}$/.test(line.trim())
      );
      if (timeLineIndex === -1) {
        return null;
      }

      const match = lines[timeLineIndex]
        .trim()
        .match(/^((?:\d+:)?\d{1,2}:\d{2}\.\d{3})\s*,\s*((?:\d+:)?\d{1,2}:\d{2}\.\d{3})$/);
      if (!match) {
        return null;
      }

      const [, start, end] = match;

      return {
        start: timestampInputToMs(start),
        end: Math.max(timestampInputToMs(start) + 1, timestampInputToMs(end)),
        text: lines.slice(timeLineIndex + 1),
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
    case 'smi':
      return parseSmi(input);
    case 'sbv':
      return parseSbv(input);
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
    case 'smi':
    case 'sbv':
      return serializeSrt(cues);
    case 'txt':
      return serializePlainText(cues);
    default:
      return '';
  }
}

export function serializePlainText(cues: SubtitleCue[]) {
  return cues
    .map((cue) => cue.text.map((line) => line.trimEnd()).join('\n'))
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

function shiftCueTimes(cues: SubtitleCue[], shiftMs: number) {
  return cues.map((cue) => ({
    ...cue,
    start: Math.max(0, cue.start + shiftMs),
    end: Math.max(0, cue.end + shiftMs),
  }));
}

function sortCuesByStart(cues: SubtitleCue[]) {
  return [...cues].sort((a, b) => a.start - b.start || a.end - b.end);
}

function shiftCueTimesInRange(
  cues: SubtitleCue[],
  shiftMs: number,
  rangeStartMs: number,
  rangeEndMs: number
) {
  const start = Math.min(rangeStartMs, rangeEndMs);
  const end = Math.max(rangeStartMs, rangeEndMs);

  return cues.map((cue) => {
    if (cue.start < start || cue.start > end) {
      return cue;
    }

    return {
      ...cue,
      start: Math.max(0, cue.start + shiftMs),
      end: Math.max(0, cue.end + shiftMs),
    };
  });
}

function mergeSubtitleInputs(primaryInput: string, secondaryInput: string) {
  const primaryFormat = detectSubtitleFormat(primaryInput);
  const secondaryFormat = detectSubtitleFormat(secondaryInput);
  const outputFormat =
    primaryFormat === 'unknown' ? secondaryFormat : primaryFormat;

  if (outputFormat === 'unknown') {
    return [primaryInput, secondaryInput].filter(Boolean).join('\n\n');
  }

  const primaryCues = parseSubtitleByFormat(primaryInput, primaryFormat);
  const secondaryCues = parseSubtitleByFormat(secondaryInput, secondaryFormat);
  const cues = sortCuesByStart([...primaryCues, ...secondaryCues]);

  if (!cues.length) {
    return [primaryInput, secondaryInput].filter(Boolean).join('\n\n');
  }

  return serializeByFormat(cues, outputFormat);
}

function decodeHtmlEntities(input: string) {
  return input
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function cleanSubtitleLine(line: string) {
  return decodeHtmlEntities(line)
    .replace(/<[^>\n]+>/g, ' ')
    .replace(/[\u00A0\u200B-\u200D\u2060]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanCueText(cues: SubtitleCue[]) {
  return cues.map((cue) => ({
    ...cue,
    text: cue.text
      .map((line) => cleanSubtitleLine(line))
      .filter(Boolean),
  }));
}

function formatValidationReport(title: string, issues: string[], details: string[]) {
  const lines = [title, ''];

  if (issues.length) {
    lines.push('Issues found:');
    issues.forEach((issue) => lines.push(`- ${issue}`));
  } else {
    lines.push('No blocking issues found.');
  }

  if (details.length) {
    lines.push('', 'Details:');
    details.forEach((detail) => lines.push(`- ${detail}`));
  }

  return lines.join('\n').trim();
}

function validateSrt(input: string) {
  const issues: string[] = [];
  const details: string[] = [];
  const cues = parseSrt(input);

  if (!cues.length) {
    issues.push('No valid SRT cues were detected.');
  }
  if (!/^\d+\s*\n\d{2}:\d{2}:\d{2},\d{3}\s-->/m.test(input)) {
    issues.push('SRT cue numbering or comma-based timestamps may be missing.');
  }
  if (/\d{2}:\d{2}:\d{2}\.\d{3}\s-->/m.test(input)) {
    issues.push('Dot-based timestamps were found. Standard SRT uses commas.');
  }
  if (cues.some((cue) => cue.end < cue.start)) {
    issues.push('At least one cue ends before it starts.');
  }

  details.push(`${cues.length} cue${cues.length === 1 ? '' : 's'} parsed.`);
  if (cues.length) {
    details.push(`First cue starts at ${formatSrtTime(cues[0].start)}.`);
    details.push(`Last cue ends at ${formatSrtTime(cues[cues.length - 1].end)}.`);
  }

  return formatValidationReport('SRT validation report', issues, details);
}

function validateVtt(input: string) {
  const issues: string[] = [];
  const details: string[] = [];
  const normalized = normalizeSubtitleInput(input);
  const cues = parseVtt(normalized);

  if (!normalized.startsWith('WEBVTT')) {
    issues.push('Missing WEBVTT header.');
  }
  if (!cues.length) {
    issues.push('No valid WebVTT cues were detected.');
  }
  if (/\d{2}:\d{2}:\d{2},\d{3}\s-->/m.test(normalized)) {
    issues.push('Comma-based timestamps were found. WebVTT uses dots.');
  }
  if (cues.some((cue) => cue.end < cue.start)) {
    issues.push('At least one cue ends before it starts.');
  }

  details.push(`${cues.length} cue${cues.length === 1 ? '' : 's'} parsed.`);
  if (cues.length) {
    details.push(`First cue starts at ${formatVttTime(cues[0].start)}.`);
    details.push(`Last cue ends at ${formatVttTime(cues[cues.length - 1].end)}.`);
  }

  return formatValidationReport('WebVTT validation report', issues, details);
}

export function processSubtitleTool(
  toolId: SubtitleToolId,
  input: string,
  shiftValue = '0',
  options: {
    secondaryInput?: string;
    partialStart?: string;
    partialEnd?: string;
  } = {}
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
    case 'srt-to-txt':
      return serializePlainText(parseSrt(normalized));
    case 'vtt-to-txt':
      return serializePlainText(parseVtt(normalized));
    case 'ass-to-txt':
      return serializePlainText(parseAss(normalized));
    case 'srt-to-ass':
      return serializeAss(parseSrt(normalized));
    case 'ass-to-srt':
      return serializeSrt(parseAss(normalized));
    case 'vtt-to-ass':
      return serializeAss(parseVtt(normalized));
    case 'ass-to-vtt':
      return serializeVtt(parseAss(normalized));
    case 'smi-to-srt':
      return serializeSrt(parseSmi(normalized));
    case 'sbv-to-srt':
      return serializeSrt(parseSbv(normalized));
    case 'youtube-subtitle-converter':
    case 'plex-subtitle-converter': {
      const format = detectSubtitleFormat(normalized);
      const cues = parseSubtitleByFormat(normalized, format);
      if (!cues.length || format === 'unknown') {
        return normalized;
      }

      return serializeSrt(cues);
    }
    case 'html5-video-subtitle-converter':
    case 'videojs-subtitle-converter':
    case 'jw-player-subtitle-converter':
    case 'vimeo-subtitle-converter': {
      const format = detectSubtitleFormat(normalized);
      const cues = parseSubtitleByFormat(normalized, format);
      if (!cues.length || format === 'unknown') {
        return normalized;
      }

      return serializeVtt(cues);
    }
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
    case 'subtitle-delay-fixer':
    case 'fix-out-of-sync-subtitles': {
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
    case 'clean-srt-file':
      return serializeSrt(cleanCueText(parseSrt(normalized)));
    case 'remove-srt-line-numbers':
    case 'fix-srt-timestamps':
      return serializeSrt(parseSrt(normalized));
    case 'srt-validator':
      return validateSrt(normalized);
    case 'webvtt-validator':
      return validateVtt(normalized);
    case 'subtitle-transcript-generator': {
      const format = detectSubtitleFormat(normalized);
      const cues = parseSubtitleByFormat(normalized, format);
      if (!cues.length || format === 'unknown') {
        return cleanSubtitleLine(normalized);
      }

      return serializePlainText(cues);
    }
    case 'subtitle-encoding-fixer':
      return normalized;
    case 'subtitle-merger':
      return mergeSubtitleInputs(
        normalized,
        normalizeSubtitleInput(options.secondaryInput || '')
      );
    case 'partial-subtitle-shifter': {
      const format = detectSubtitleFormat(normalized);
      const cues = parseSubtitleByFormat(normalized, format);
      if (!cues.length || format === 'unknown') {
        return normalized;
      }

      return serializeByFormat(
        shiftCueTimesInRange(
          cues,
          Number(shiftValue || '0'),
          timestampInputToMs(options.partialStart || '00:00:00,000'),
          timestampInputToMs(options.partialEnd || '99:59:59,999')
        ),
        format
      );
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
    case 'html5-video-subtitle-converter':
    case 'videojs-subtitle-converter':
    case 'jw-player-subtitle-converter':
    case 'vimeo-subtitle-converter':
      return 'vtt';
    case 'vtt-to-srt':
    case 'ass-to-srt':
    case 'smi-to-srt':
    case 'sbv-to-srt':
    case 'youtube-subtitle-converter':
    case 'plex-subtitle-converter':
      return 'srt';
    case 'srt-to-txt':
    case 'vtt-to-txt':
    case 'ass-to-txt':
    case 'subtitle-transcript-generator':
      return 'txt';
    case 'srt-validator':
    case 'webvtt-validator':
      return 'txt';
    case 'srt-to-ass':
    case 'vtt-to-ass':
      return 'ass';
    case 'subtitle-time-shifter':
    case 'subtitle-delay-fixer':
    case 'fix-out-of-sync-subtitles':
    case 'subtitle-cleaner':
    case 'clean-srt-file':
    case 'remove-srt-line-numbers':
    case 'fix-srt-timestamps':
    case 'subtitle-encoding-fixer':
    case 'subtitle-merger':
    case 'partial-subtitle-shifter':
      return detectSubtitleFormat(input);
    case 'extract-subtitles-from-video':
      return 'srt';
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
  if (toolId === 'subtitle-encoding-fixer') {
    const originalExtension = inputName.match(/\.([^.]+)$/)?.[1] || extension;
    return `${baseName}.utf8.${originalExtension}`;
  }
  if (toolId === 'subtitle-merger') {
    return `${baseName}.merged.${extension}`;
  }
  if (toolId === 'partial-subtitle-shifter') {
    return `${baseName}.partial-shift.${extension}`;
  }
  if (toolId === 'extract-subtitles-from-video') {
    return `${baseName}.subtitles.srt`;
  }

  return `${baseName}.${extension}`;
}
