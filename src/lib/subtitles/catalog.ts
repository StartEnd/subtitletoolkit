export type SubtitleToolId =
  | 'srt-to-vtt'
  | 'vtt-to-srt'
  | 'srt-to-txt'
  | 'vtt-to-txt'
  | 'ass-to-txt'
  | 'srt-to-ass'
  | 'ass-to-srt'
  | 'vtt-to-ass'
  | 'ass-to-vtt'
  | 'smi-to-srt'
  | 'sbv-to-srt'
  | 'ttml-to-srt'
  | 'scc-to-srt'
  | 'microdvd-to-srt'
  | 'lrc-to-srt'
  | 'subviewer-to-srt'
  | 'youtube-subtitle-converter'
  | 'html5-video-subtitle-converter'
  | 'videojs-subtitle-converter'
  | 'jw-player-subtitle-converter'
  | 'plex-subtitle-converter'
  | 'vimeo-subtitle-converter'
  | 'subtitle-time-shifter'
  | 'subtitle-delay-fixer'
  | 'fix-out-of-sync-subtitles'
  | 'subtitle-cleaner'
  | 'clean-srt-file'
  | 'remove-srt-line-numbers'
  | 'fix-srt-timestamps'
  | 'srt-validator'
  | 'webvtt-validator'
  | 'subtitle-transcript-generator'
  | 'subtitle-encoding-fixer'
  | 'subtitle-merger'
  | 'partial-subtitle-shifter'
  | 'extract-subtitles-from-video';

export type SupportedLocale = 'en' | 'zh';

export interface SubtitleToolFAQ {
  question: string;
  answer: string;
}

export interface SubtitleGuideLink {
  href: string;
  title: string;
}

export interface SubtitleTool {
  id: SubtitleToolId;
  title: string;
  shortTitle: string;
  description: string;
  summary: string;
  buttonLabel: string;
  inputLabel: string;
  outputLabel: string;
  placeholder: string;
  acceptedExtensions: string[];
  sampleFileName: string;
  secondaryInputLabel?: string;
  secondarySampleFileName?: string;
  secondarySampleInput?: string;
  useCases: string[];
  faqs: SubtitleToolFAQ[];
  relatedTools: SubtitleToolId[];
  relatedGuides: SubtitleGuideLink[];
  sampleInput: string;
}

export interface SubtitleCatalog {
  toolsPage: {
    title: string;
    description: string;
    eyebrow: string;
    whyLocalTitle: string;
    whyLocalItems: string[];
    guideTitle: string;
    guideDescription: string;
    guides: SubtitleGuideLink[];
  };
  pageLabels: {
    loadSample: string;
    clear: string;
    copyOutput: string;
    copied: string;
    downloadOutput: string;
    uploadTab: string;
    pasteTab: string;
    uploadTitle: string;
    uploadHint: string;
    selectedFile: string;
    noFileSelected: string;
    processingHint: string;
    shiftLabel: string;
    shiftHelp: string;
    shiftPlaceholder: string;
    partialStartLabel: string;
    partialEndLabel: string;
    partialRangeHelp: string;
    encodingLabel: string;
    encodingHelp: string;
    secondInputTitle: string;
    videoUploadTitle: string;
    videoUploadHint: string;
    ffmpegLoading: string;
    ffmpegExtracting: string;
    runLocally: string;
    useCasesTitle: string;
    faqTitle: string;
    relatedToolsTitle: string;
    relatedGuidesTitle: string;
  };
  tools: SubtitleTool[];
}

const sharedSamples = {
  srt: `1
00:00:01,000 --> 00:00:03,500
Welcome back to the edit.

2
00:00:04,200 --> 00:00:06,000
Today we are fixing captions locally.`,
  vtt: `WEBVTT

00:00:01.000 --> 00:00:03.500
Welcome back to the edit.

00:00:04.200 --> 00:00:06.000
Today we are fixing captions locally.`,
  ass: `[Script Info]
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,36,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.00,0:00:03.50,Default,,0,0,0,,Welcome back to the edit.
Dialogue: 0,0:00:04.20,0:00:06.00,Default,,0,0,0,,Today we are fixing captions locally.`,
  smi: `<SAMI>
<BODY>
<SYNC Start=1000><P Class=ENCC>Welcome back to the edit.
<SYNC Start=4200><P Class=ENCC>Today we are converting SAMI captions.<br>They need SRT output.
<SYNC Start=7000><P Class=ENCC>&nbsp;
</BODY>
</SAMI>`,
  sbv: `0:00:01.000,0:00:03.500
Welcome back to the edit.

0:00:04.200,0:00:06.000
Today we are converting SBV captions for upload.`,
  ttml: `<?xml version="1.0" encoding="UTF-8"?>
<tt xmlns="http://www.w3.org/ns/ttml">
  <body>
    <div>
      <p begin="00:00:01.000" end="00:00:03.500">Welcome back to the edit.</p>
      <p begin="00:00:04.200" end="00:00:06.000">Today we are converting TTML captions.<br/>They need SRT output.</p>
    </div>
  </body>
</tt>`,
  scc: `Scenarist_SCC V1.0

00:00:01:00 5765 6c63 6f6d 6520 6261 636b 2074 6f20 7468 6520 6564 6974
00:00:04:06 546f 6461 7920 7765 2061 7265 2063 6f6e 7665 7274 696e 6720 5343 4320 6361 7074 696f 6e73`,
  microdvd: `{1}{1}25.000
{25}{88}Welcome back to the edit
{105}{150}Today we are converting MicroDVD subtitles|They need SRT output`,
  lrc: `[00:01.00]Welcome back to the edit
[00:04.20]Today we are converting LRC lyrics
[00:07.00]They need SRT caption timing`,
  subviewer: `00:00:01.00,00:00:03.50
Welcome back to the edit

00:00:04.20,00:00:06.00
Today we are converting SubViewer captions[br]They need SRT output`,
  encodedSrt: `1
00:00:01,000 --> 00:00:03,500
Café subtitles should stay readable.

2
00:00:04,200 --> 00:00:06,000
Use the source encoding selector when a file looks garbled.`,
  secondSrt: `1
00:00:07,000 --> 00:00:09,200
This second file should follow the first one.

2
00:00:10,000 --> 00:00:12,000
Merge the cues, then sort them by time.`,
};

const enTools: SubtitleTool[] = [
  {
    id: 'srt-to-vtt',
    title: 'SRT to VTT Converter',
    shortTitle: 'SRT to VTT',
    description:
      'Convert SRT subtitles to WebVTT online for HTML5 video, browser players, and track elements.',
    summary:
      'Use this free SRT to VTT converter when an HTML5 video player needs a clean `.vtt` file with the `WEBVTT` header, dot-based timestamps, and no SRT cue numbers.',
    buttonLabel: 'Convert to VTT',
    inputLabel: 'SRT input',
    outputLabel: 'VTT output',
    placeholder: 'Paste your SRT subtitles here',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Prepare SRT subtitles for HTML5 video tracks.',
      'Add the WEBVTT header before using captions on a website.',
      'Convert comma-based SRT timestamps to dot-based WebVTT timing.',
      'Create browser-ready VTT captions without uploading subtitle files.',
    ],
    faqs: [
      {
        question: 'Is this SRT to VTT converter free?',
        answer:
          'Yes. The converter is free to use, requires no signup, and runs in your browser.',
      },
      {
        question: 'What changes during SRT to VTT conversion?',
        answer:
          'Sequence numbers are removed, the WEBVTT header is added, and commas in timestamps become dots.',
      },
      {
        question: 'Can I use the VTT file with HTML5 video?',
        answer:
          'Yes. The output is WebVTT, the subtitle format commonly used with HTML5 video tracks and browser players.',
      },
      {
        question: 'Does the output include the WEBVTT header?',
        answer:
          'Yes. The converter adds the WEBVTT header so the output can be used as a .vtt caption file.',
      },
      {
        question: 'Are SRT timestamp commas changed to dots?',
        answer:
          'Yes. SRT comma milliseconds are converted to dot-based WebVTT timestamps.',
      },
      {
        question: 'Will cue text be changed?',
        answer:
          'No. The tool keeps caption text as-is and only adjusts the format wrapper.',
      },
      {
        question: 'Are my subtitle files uploaded to a server?',
        answer:
          'No. SRT to VTT conversion happens locally in your browser, so your subtitle file stays on your device.',
      },
    ],
    relatedTools: ['vtt-to-srt', 'srt-to-ass'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-srt-to-vtt-for-html5-video/',
        title: 'How to convert SRT to VTT for HTML5 video',
      },
      { href: '/guides/srt-vs-vtt/', title: 'SRT vs VTT' },
      {
        href: '/guides/best-subtitle-format-for-html5-video/',
        title: 'Best subtitle format for HTML5 video',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'vtt-to-srt',
    title: 'VTT to SRT Converter',
    shortTitle: 'VTT to SRT',
    description:
      'Convert VTT captions to SRT online for legacy editors, uploads, and review workflows.',
    summary:
      'Use this free VTT to SRT converter when a website or player exports `.vtt`, but your subtitle editor, upload workflow, archive, or client asks for `.srt` with numbered cues and comma timestamps.',
    buttonLabel: 'Convert to SRT',
    inputLabel: 'VTT input',
    outputLabel: 'SRT output',
    placeholder: 'Paste your VTT subtitles here',
    acceptedExtensions: ['.vtt', '.txt'],
    sampleFileName: 'sample.vtt',
    useCases: [
      'Convert VTT to SRT before uploading captions to a platform that expects SubRip files.',
      'Move browser captions into legacy subtitle editors that do not support WebVTT.',
      'Change dot-based WebVTT timestamps into comma-based SRT timing.',
      'Prepare subtitle files for offline review and archive workflows.',
      'Remove WEBVTT headers and cue settings before client handoff.',
    ],
    faqs: [
      {
        question: 'Is this VTT to SRT converter free?',
        answer:
          'Yes. You can convert VTT to SRT for free in your browser without creating an account.',
      },
      {
        question: 'Does the tool keep the cue order?',
        answer:
          'Yes. It preserves the existing order and adds sequence numbers for SRT output.',
      },
      {
        question: 'Are VTT timestamp dots changed to SRT commas?',
        answer:
          'Yes. Dot-based WebVTT milliseconds are converted to comma-based SRT timestamps.',
      },
      {
        question: 'What happens to the WEBVTT header?',
        answer: 'It is removed, because SRT files do not use that header.',
      },
      {
        question: 'Can I use the output in legacy subtitle editors?',
        answer:
          'Yes. The output is a numbered SubRip SRT file for editors, review workflows, and uploads that do not accept WebVTT.',
      },
      {
        question: 'Are VTT cue settings kept in the SRT file?',
        answer:
          'No. SRT does not support WebVTT cue settings, so the converter keeps timing and text only.',
      },
      {
        question: 'Are my VTT files uploaded to a server?',
        answer:
          'No. The VTT to SRT conversion runs locally in your browser, so your subtitle file stays on your device.',
      },
    ],
    relatedTools: ['srt-to-vtt', 'vtt-to-ass'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-vtt-to-srt-for-legacy-subtitle-editors/',
        title: 'How to convert VTT to SRT for legacy editors',
      },
      { href: '/guides/srt-vs-vtt/', title: 'SRT vs VTT' },
      {
        href: '/guides/how-to-convert-subtitle-files-for-web-players/',
        title: 'How to convert subtitle files for web players',
      },
    ],
    sampleInput: sharedSamples.vtt,
  },
  {
    id: 'srt-to-txt',
    title: 'SRT to TXT Converter',
    shortTitle: 'SRT to TXT',
    description:
      'Convert SRT subtitles to plain text online by removing timestamps and cue numbers.',
    summary:
      'Use this free SRT to TXT converter when you need the subtitle text without timing lines, cue numbers, or file-format markup.',
    buttonLabel: 'Convert to TXT',
    inputLabel: 'SRT input',
    outputLabel: 'Plain text output',
    placeholder: 'Paste your SRT subtitles here',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Extract dialogue text from an SRT subtitle file.',
      'Create a readable transcript draft from SubRip captions.',
      'Remove timestamps and cue numbers before editing subtitle text.',
      'Prepare subtitle text for review, translation, or notes.',
    ],
    faqs: [
      {
        question: 'Is this SRT to TXT converter free?',
        answer:
          'Yes. You can convert SRT subtitles to plain text for free in your browser without signup.',
      },
      {
        question: 'Does the TXT output include timestamps?',
        answer:
          'No. The converter removes SRT cue numbers and timing lines, then keeps the subtitle text only.',
      },
      {
        question: 'Will line breaks be preserved?',
        answer:
          'Yes. Multi-line subtitle cues stay readable in the plain text output.',
      },
      {
        question: 'Are my SRT files uploaded to a server?',
        answer:
          'No. SRT to TXT conversion runs locally in your browser, so your subtitle file stays on your device.',
      },
    ],
    relatedTools: ['srt-to-vtt', 'vtt-to-txt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-srt-to-txt/',
        title: 'How to convert SRT to TXT',
      },
      { href: '/guides/srt-vs-vtt/', title: 'SRT vs VTT' },
      {
        href: '/guides/how-to-remove-subtitle-line-numbers/',
        title: 'How to remove subtitle line numbers',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'vtt-to-txt',
    title: 'VTT to TXT Converter',
    shortTitle: 'VTT to TXT',
    description:
      'Convert VTT WebVTT captions to plain text online by removing timestamps, headers, and cue settings.',
    summary:
      'Use this free VTT to TXT converter when you need the readable caption text from a WebVTT file without timing or browser-specific markup.',
    buttonLabel: 'Convert to TXT',
    inputLabel: 'VTT input',
    outputLabel: 'Plain text output',
    placeholder: 'Paste your VTT subtitles here',
    acceptedExtensions: ['.vtt', '.txt'],
    sampleFileName: 'sample.vtt',
    useCases: [
      'Extract readable text from a WebVTT caption file.',
      'Create a transcript draft from browser caption tracks.',
      'Remove the WEBVTT header, timestamps, and cue settings.',
      'Prepare caption text for review, editing, or translation.',
    ],
    faqs: [
      {
        question: 'Is this VTT to TXT converter free?',
        answer:
          'Yes. You can convert VTT captions to plain text for free in your browser without signup.',
      },
      {
        question: 'Does the TXT output include WebVTT timestamps?',
        answer:
          'No. The converter removes WebVTT timing lines and keeps the caption text only.',
      },
      {
        question: 'What happens to the WEBVTT header?',
        answer:
          'It is removed because plain text output does not need a WebVTT header.',
      },
      {
        question: 'Are my VTT files uploaded to a server?',
        answer:
          'No. VTT to TXT conversion runs locally in your browser, so your caption file stays on your device.',
      },
    ],
    relatedTools: ['vtt-to-srt', 'srt-to-txt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-vtt-to-txt/',
        title: 'How to convert VTT to TXT',
      },
      { href: '/guides/srt-vs-vtt/', title: 'SRT vs VTT' },
      {
        href: '/guides/when-webvtt-is-better-than-srt/',
        title: 'When WebVTT is better than SRT',
      },
    ],
    sampleInput: sharedSamples.vtt,
  },
  {
    id: 'ass-to-txt',
    title: 'ASS to TXT Converter',
    shortTitle: 'ASS to TXT',
    description:
      'Convert ASS subtitles to plain text online by removing style tags, timing, and dialogue metadata.',
    summary:
      'Use this free ASS to TXT converter when you need readable subtitle text from a styled ASS or SSA file without timing or formatting markup.',
    buttonLabel: 'Convert to TXT',
    inputLabel: 'ASS input',
    outputLabel: 'Plain text output',
    placeholder: 'Paste your ASS subtitles here',
    acceptedExtensions: ['.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.ass',
    useCases: [
      'Extract dialogue text from ASS subtitle files.',
      'Create a transcript draft from styled subtitles.',
      'Remove ASS override tags, timing, and style metadata.',
      'Prepare readable subtitle text for review or translation.',
    ],
    faqs: [
      {
        question: 'Is this ASS to TXT converter free?',
        answer:
          'Yes. You can convert ASS subtitles to plain text for free without signup or server upload.',
      },
      {
        question: 'Will ASS styling be kept?',
        answer:
          'No. Plain text output keeps readable dialogue text and removes ASS styling, positioning, and timing metadata.',
      },
      {
        question: 'Can this handle ASS line breaks?',
        answer:
          'Yes. ASS line breaks are converted into normal readable line breaks in the text output.',
      },
      {
        question: 'Are my ASS files uploaded to a server?',
        answer:
          'No. ASS to TXT conversion runs locally in your browser, so your subtitle file stays on your device.',
      },
    ],
    relatedTools: ['ass-to-srt', 'srt-to-txt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-ass-to-txt/',
        title: 'How to convert ASS to TXT',
      },
      { href: '/guides/ass-vs-srt/', title: 'ASS vs SRT' },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes/',
        title: 'Common subtitle format errors and fixes',
      },
    ],
    sampleInput: sharedSamples.ass,
  },
  {
    id: 'srt-to-ass',
    title: 'SRT to ASS Converter',
    shortTitle: 'SRT to ASS',
    description:
      'Convert SRT subtitles to ASS online for Aegisub, styling, karaoke timing, and subtitle editor workflows.',
    summary:
      'Use this free SRT to ASS converter when a subtitle editor, styling workflow, or karaoke timing pass needs a style-ready `.ass` file instead of plain SubRip captions.',
    buttonLabel: 'Convert to ASS',
    inputLabel: 'SRT input',
    outputLabel: 'ASS output',
    placeholder: 'Paste your SRT subtitles here',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Convert SRT to ASS before opening captions in Aegisub or another subtitle editor.',
      'Create a clean ASS starting point with default style definitions before manual styling.',
      'Prepare SubRip captions for karaoke timing, positioning, or style review workflows.',
      'Hand off an editable ASS copy while keeping the original SRT timing and text.',
    ],
    faqs: [
      {
        question: 'Will this create advanced styling automatically?',
        answer:
          'No. It creates a clean ASS structure with a default style so you can keep working from there.',
      },
      {
        question: 'Can I convert SRT to ASS for Aegisub?',
        answer:
          'Yes. The output is a basic ASS file with events, timing, text, and a default style that can be opened in Aegisub for further styling or timing work.',
      },
      {
        question: 'Does the converter upload my subtitle file?',
        answer:
          'No. SRT to ASS conversion runs locally in your browser, so your subtitle text stays on your device.',
      },
      {
        question: 'Does line break information stay intact?',
        answer:
          'Yes. Multi-line subtitles are converted into ASS line breaks using the standard `\\N` syntax.',
      },
    ],
    relatedTools: ['ass-to-srt', 'ass-to-vtt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-srt-to-ass/',
        title: 'How to convert SRT to ASS',
      },
      { href: '/guides/ass-vs-srt/', title: 'ASS vs SRT' },
      {
        href: '/guides/when-to-use-ass-instead-of-srt/',
        title: 'When to use ASS instead of SRT',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'ass-to-srt',
    title: 'ASS to SRT Converter',
    shortTitle: 'ASS to SRT',
    description:
      'Convert ASS or SSA subtitles to SRT online for YouTube uploads, editors, and simple caption workflows.',
    summary:
      'Use this free ASS to SRT converter when YouTube, a client, or a subtitle editor needs a simple `.srt` delivery copy instead of styled ASS or SSA captions.',
    buttonLabel: 'Convert to SRT',
    inputLabel: 'ASS input',
    outputLabel: 'SRT output',
    placeholder: 'Paste your ASS subtitles here',
    acceptedExtensions: ['.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.ass',
    useCases: [
      'Convert ASS to SRT before uploading captions to YouTube.',
      'Flatten ASS or SSA styling, positioning, and karaoke tags into simple SubRip text.',
      'Deliver a clean SRT copy to clients, editors, or review workflows.',
      'Prepare styled subtitles for platforms that reject ASS files.',
    ],
    faqs: [
      {
        question: 'Is this ASS to SRT converter free?',
        answer:
          'Yes. You can convert ASS subtitles to SRT for free without signup or server upload.',
      },
      {
        question: 'What happens to styles and positioning?',
        answer:
          'ASS styling and positioning are removed. The converter keeps timing and subtitle text only.',
      },
      {
        question: 'Can I convert ASS to SRT for YouTube uploads?',
        answer:
          'Yes. The output is a simple SRT file that keeps timing and readable dialogue while removing ASS styling that YouTube does not use.',
      },
      {
        question: 'Does this work with SSA subtitle files?',
        answer:
          'Yes. You can paste or upload ASS or SSA subtitles and export a SubRip SRT delivery copy.',
      },
      {
        question: 'Can this handle `\\N` line breaks?',
        answer:
          'Yes. ASS line breaks are converted into normal multi-line subtitle text.',
      },
      {
        question: 'Will karaoke effects be kept?',
        answer:
          'No. SRT cannot represent ASS karaoke effects, colors, positioning, or animation.',
      },
      {
        question: 'Are my ASS files uploaded to a server?',
        answer:
          'No. ASS to SRT conversion happens locally in your browser, so the subtitle file stays on your device.',
      },
    ],
    relatedTools: ['srt-to-ass', 'ass-to-vtt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-ass-to-srt-for-youtube-uploads/',
        title: 'How to convert ASS to SRT for YouTube uploads',
      },
      {
        href: '/guides/srt-vs-ass-for-youtube-captions/',
        title: 'SRT vs ASS for YouTube captions',
      },
      { href: '/guides/ass-vs-srt/', title: 'ASS vs SRT' },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes/',
        title: 'Common subtitle format errors and fixes',
      },
    ],
    sampleInput: sharedSamples.ass,
  },
  {
    id: 'vtt-to-ass',
    title: 'VTT to ASS Converter',
    shortTitle: 'VTT to ASS',
    description:
      'Convert browser-friendly WebVTT captions into ASS format for editing and advanced subtitle workflows.',
    summary:
      'Use this when captions start in a web workflow but the next step requires a style-capable subtitle format.',
    buttonLabel: 'Convert to ASS',
    inputLabel: 'VTT input',
    outputLabel: 'ASS output',
    placeholder: 'Paste your VTT subtitles here',
    acceptedExtensions: ['.vtt', '.txt'],
    sampleFileName: 'sample.vtt',
    useCases: [
      'Move subtitles from web playback into styling workflows.',
      'Prepare VTT captions for editors that prefer ASS.',
      'Create a clean ASS base from a browser-first caption file.',
    ],
    faqs: [
      {
        question: 'Does this keep VTT notes and metadata?',
        answer:
          'No. The converter focuses on subtitle cues and ignores note blocks or extra metadata.',
      },
      {
        question: 'Will the output be ready for manual styling?',
        answer:
          'Yes. The result includes a basic ASS structure with a default style that can be edited later.',
      },
    ],
    relatedTools: ['ass-to-vtt', 'vtt-to-srt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-vtt-to-ass/',
        title: 'How to convert VTT to ASS',
      },
      {
        href: '/guides/how-to-convert-subtitle-files-for-web-players/',
        title: 'How to convert subtitle files for web players',
      },
      {
        href: '/guides/when-to-use-ass-instead-of-srt/',
        title: 'When to use ASS instead of SRT',
      },
    ],
    sampleInput: sharedSamples.vtt,
  },
  {
    id: 'ass-to-vtt',
    title: 'ASS to VTT Converter',
    shortTitle: 'ASS to VTT',
    description:
      'Convert ASS subtitles into WebVTT for browser playback and HTML5 video workflows.',
    summary:
      'Use this when your source file is ASS, but the destination is a browser player or a web-native video component.',
    buttonLabel: 'Convert to VTT',
    inputLabel: 'ASS input',
    outputLabel: 'VTT output',
    placeholder: 'Paste your ASS subtitles here',
    acceptedExtensions: ['.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.ass',
    useCases: [
      'Prepare styled subtitles for web playback.',
      'Flatten ASS captions into a browser-friendly format.',
      'Move subtitles from editing tools into HTML5 delivery.',
    ],
    faqs: [
      {
        question: 'Will styling survive the conversion?',
        answer:
          'No. The converter keeps timing and text, but not ASS styling instructions.',
      },
      {
        question: 'Is the result valid for browser players?',
        answer:
          'Yes. The output is standard WebVTT with a proper header and browser-friendly timestamps.',
      },
    ],
    relatedTools: ['vtt-to-ass', 'srt-to-vtt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-ass-to-vtt-for-web-players/',
        title: 'How to convert ASS to VTT for web players',
      },
      { href: '/guides/ass-vs-vtt/', title: 'ASS vs VTT for browser playback' },
    ],
    sampleInput: sharedSamples.ass,
  },
  {
    id: 'smi-to-srt',
    title: 'SMI to SRT Converter',
    shortTitle: 'SMI to SRT',
    description:
      'Convert SAMI or SMI subtitle files to SRT online for free, locally in your browser with no upload.',
    summary:
      'Use this free SMI to SRT converter when an old Windows Media SAMI caption file needs a standard SubRip subtitle file for upload, editing, or archive workflows.',
    buttonLabel: 'Convert to SRT',
    inputLabel: 'SMI input',
    outputLabel: 'SRT output',
    placeholder: 'Paste your SAMI or SMI subtitles here',
    acceptedExtensions: ['.smi', '.sami', '.txt'],
    sampleFileName: 'sample.smi',
    useCases: [
      'Convert old Windows Media SAMI captions to standard SRT.',
      'Turn .smi or .sami sidecar subtitle files into editable SubRip cues.',
      'Prepare legacy caption files for upload forms that only accept SRT.',
      'Review SAMI captions locally before cleaning, validating, or converting them again.',
    ],
    faqs: [
      {
        question: 'How do I convert an SMI subtitle file to SRT?',
        answer:
          'Open the SMI to SRT converter, paste or upload the SAMI caption file, and export the parsed SYNC blocks as numbered SRT cues.',
      },
      {
        question: 'Is SMI the same as SAMI?',
        answer:
          'In subtitle workflows, .smi usually refers to a SAMI caption file used by older Windows Media players. .sami is another extension for the same style of file.',
      },
      {
        question: 'Does this work with burned-in subtitles?',
        answer:
          'No. SMI to SRT conversion works on a text SAMI subtitle file. Burned-in video text needs OCR instead.',
      },
      {
        question: 'Are SMI files uploaded to a server?',
        answer:
          'No. The SAMI to SRT conversion runs locally in your browser, so the subtitle file stays on your device.',
      },
    ],
    relatedTools: ['sbv-to-srt', 'ttml-to-srt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-smi-to-srt/',
        title: 'How to convert SMI to SRT',
      },
      {
        href: '/guides/how-to-extract-subtitles-from-wmv/',
        title: 'How to extract subtitles from WMV',
      },
      {
        href: '/guides/how-to-convert-subtitles-to-utf-8/',
        title: 'How to convert subtitles to UTF-8',
      },
    ],
    sampleInput: sharedSamples.smi,
  },
  {
    id: 'sbv-to-srt',
    title: 'SBV to SRT Converter',
    shortTitle: 'SBV to SRT',
    description:
      'Convert YouTube SBV subtitle files to SRT online for free, locally in your browser with no upload.',
    summary:
      'Use this free SBV to SRT converter when an old YouTube or Amara-style .sbv caption file needs a standard SubRip subtitle file for editing, upload, or archive workflows.',
    buttonLabel: 'Convert to SRT',
    inputLabel: 'SBV input',
    outputLabel: 'SRT output',
    placeholder: 'Paste your SBV subtitles here',
    acceptedExtensions: ['.sbv', '.txt'],
    sampleFileName: 'sample.sbv',
    useCases: [
      'Convert YouTube SBV captions to standard SRT.',
      'Move older .sbv caption exports into editors that expect SubRip files.',
      'Prepare SBV subtitles for platforms and review tools that only accept SRT.',
      'Create a clean archive copy with numbered cues and comma-based timestamps.',
    ],
    faqs: [
      {
        question: 'How do I convert an SBV subtitle file to SRT?',
        answer:
          'Open the SBV to SRT converter, paste or upload the .sbv caption file, and export the timing blocks as numbered SRT cues.',
      },
      {
        question: 'What is an SBV subtitle file?',
        answer:
          'SBV is a simple caption format used in some YouTube and creator workflows. Each cue uses one line with start and end times separated by a comma, followed by the subtitle text.',
      },
      {
        question: 'Are SBV files uploaded to a server?',
        answer:
          'No. The SBV to SRT conversion runs locally in your browser, so the subtitle file stays on your device.',
      },
      {
        question: 'Will SBV timing change during conversion?',
        answer:
          'The timing values are preserved, but the output uses standard SRT timestamp formatting and numbered cue blocks.',
      },
    ],
    relatedTools: ['ttml-to-srt', 'scc-to-srt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-sbv-to-srt/',
        title: 'How to convert SBV to SRT',
      },
      {
        href: '/guides/how-to-convert-subtitles-for-youtube/',
        title: 'How to convert subtitles for YouTube',
      },
      {
        href: '/guides/how-to-validate-srt-files/',
        title: 'How to validate SRT files',
      },
    ],
    sampleInput: sharedSamples.sbv,
  },
  {
    id: 'ttml-to-srt',
    title: 'TTML to SRT Converter',
    shortTitle: 'TTML to SRT',
    description:
      'Convert TTML, DFXP, or XML subtitle files to SRT online for free, locally in your browser with no upload.',
    summary:
      'Use this free TTML to SRT converter when a timed-text XML subtitle file from a streaming, broadcast, or archive workflow needs a standard SubRip copy for editing, upload, or review.',
    buttonLabel: 'Convert to SRT',
    inputLabel: 'TTML input',
    outputLabel: 'SRT output',
    placeholder: 'Paste your TTML or DFXP subtitles here',
    acceptedExtensions: ['.ttml', '.dfxp', '.xml', '.txt'],
    sampleFileName: 'sample.ttml',
    useCases: [
      'Convert TTML or DFXP captions to standard SRT.',
      'Move XML timed text into subtitle editors that expect SubRip files.',
      'Create a simpler review copy from streaming or broadcast caption exports.',
      'Prepare parsed TTML cues for SRT validation, cleanup, or upload workflows.',
    ],
    faqs: [
      {
        question: 'How do I convert a TTML subtitle file to SRT?',
        answer:
          'Open the TTML to SRT converter, paste or upload the .ttml, .dfxp, or XML caption file, and export the timed text paragraphs as numbered SRT cues.',
      },
      {
        question: 'Is DFXP the same as TTML?',
        answer:
          'DFXP is an older name often used for TTML-based timed text. In practical subtitle workflows, both usually mean XML captions with timed paragraph cues.',
      },
      {
        question: 'Does TTML styling survive in SRT?',
        answer:
          'No. SRT keeps timing and readable text, but it does not preserve TTML regions, styles, positioning, or XML metadata.',
      },
      {
        question: 'Are TTML files uploaded to a server?',
        answer:
          'No. The TTML to SRT conversion runs locally in your browser, so the subtitle file stays on your device.',
      },
    ],
    relatedTools: ['scc-to-srt', 'srt-validator'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-ttml-to-srt/',
        title: 'How to convert TTML to SRT',
      },
      {
        href: '/guides/how-to-convert-subtitles-for-html5-video/',
        title: 'How to convert subtitles for HTML5 video',
      },
      {
        href: '/guides/how-to-validate-srt-files/',
        title: 'How to validate SRT files',
      },
    ],
    sampleInput: sharedSamples.ttml,
  },
  {
    id: 'scc-to-srt',
    title: 'SCC to SRT Converter',
    shortTitle: 'SCC to SRT',
    description:
      'Convert SCC closed caption files to SRT online for free, locally in your browser with no upload.',
    summary:
      'Use this free SCC to SRT converter when a Scenarist closed caption file needs a simple SubRip copy for review, editing, upload, or archive handoff.',
    buttonLabel: 'Convert to SRT',
    inputLabel: 'SCC input',
    outputLabel: 'SRT output',
    placeholder: 'Paste your SCC closed captions here',
    acceptedExtensions: ['.scc', '.txt'],
    sampleFileName: 'sample.scc',
    useCases: [
      'Convert Scenarist SCC closed captions to standard SRT.',
      'Create a readable review copy from a broadcast caption file.',
      'Move SCC caption timing into editors that expect SubRip files.',
      'Prepare extracted SCC text for SRT validation, cleanup, or upload workflows.',
    ],
    faqs: [
      {
        question: 'How do I convert an SCC caption file to SRT?',
        answer:
          'Open the SCC to SRT converter, paste or upload the .scc file, and export readable caption rows as numbered SRT cues.',
      },
      {
        question: 'What is an SCC subtitle file?',
        answer:
          'SCC is a Scenarist closed caption format often used for CEA-608 broadcast and post-production caption workflows.',
      },
      {
        question: 'Does SCC styling survive in SRT?',
        answer:
          'No. SRT keeps readable timing and text, but it does not preserve CEA-608 control codes, roll-up behavior, positioning, or styling.',
      },
      {
        question: 'Are SCC files uploaded to a server?',
        answer:
          'No. The SCC to SRT conversion runs locally in your browser, so the caption file stays on your device.',
      },
    ],
    relatedTools: ['microdvd-to-srt', 'ttml-to-srt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-scc-to-srt/',
        title: 'How to convert SCC to SRT',
      },
      {
        href: '/guides/how-to-validate-srt-files/',
        title: 'How to validate SRT files',
      },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes/',
        title: 'Common subtitle format errors and fixes',
      },
    ],
    sampleInput: sharedSamples.scc,
  },
  {
    id: 'microdvd-to-srt',
    title: 'MicroDVD to SRT Converter',
    shortTitle: 'MicroDVD to SRT',
    description:
      'Convert MicroDVD SUB subtitles to SRT online for free, locally in your browser with no upload.',
    summary:
      'Use this free MicroDVD to SRT converter when a frame-based .sub subtitle file needs standard SubRip timestamps for editing, upload, review, or archive handoff.',
    buttonLabel: 'Convert to SRT',
    inputLabel: 'MicroDVD SUB input',
    outputLabel: 'SRT output',
    placeholder: 'Paste your MicroDVD .sub subtitles here',
    acceptedExtensions: ['.sub', '.txt'],
    sampleFileName: 'sample.sub',
    useCases: [
      'Convert frame-based MicroDVD .sub subtitles to standard SRT.',
      'Move older DVD-rip subtitle files into editors that expect SubRip timing.',
      'Create an upload-ready copy from a MicroDVD subtitle file.',
      'Prepare MicroDVD captions for SRT validation, cleanup, or timing review workflows.',
    ],
    faqs: [
      {
        question: 'How do I convert a MicroDVD SUB file to SRT?',
        answer:
          'Open the MicroDVD to SRT converter, paste or upload the .sub file, and export frame-based subtitle rows as numbered SRT cues.',
      },
      {
        question: 'What is a MicroDVD subtitle file?',
        answer:
          'MicroDVD is a frame-based subtitle format that usually stores cues as {start frame}{end frame}text lines in a .sub file.',
      },
      {
        question: 'Does MicroDVD to SRT conversion need a frame rate?',
        answer:
          'Yes. If the file declares a frame rate in the first row, the converter uses it. Otherwise it assumes 25 fps, so review timing before upload.',
      },
      {
        question: 'Are MicroDVD files uploaded to a server?',
        answer:
          'No. The MicroDVD to SRT conversion runs locally in your browser, so the subtitle file stays on your device.',
      },
    ],
    relatedTools: ['lrc-to-srt', 'srt-validator'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-microdvd-to-srt/',
        title: 'How to convert MicroDVD to SRT',
      },
      {
        href: '/guides/how-to-validate-srt-files/',
        title: 'How to validate SRT files',
      },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes/',
        title: 'Common subtitle format errors and fixes',
      },
    ],
    sampleInput: sharedSamples.microdvd,
  },
  {
    id: 'lrc-to-srt',
    title: 'LRC to SRT Converter',
    shortTitle: 'LRC to SRT',
    description:
      'Convert LRC lyric files to SRT subtitles online for free, locally in your browser with no upload.',
    summary:
      'Use this free LRC to SRT converter when timestamped lyrics need a standard SubRip caption file for lyric videos, review, editing, or upload workflows.',
    buttonLabel: 'Convert to SRT',
    inputLabel: 'LRC input',
    outputLabel: 'SRT output',
    placeholder: 'Paste your LRC lyrics here',
    acceptedExtensions: ['.lrc', '.txt'],
    sampleFileName: 'sample.lrc',
    useCases: [
      'Convert timestamped LRC lyrics to standard SRT captions.',
      'Prepare lyric lines for a video editor that imports SubRip files.',
      'Create a simple caption file for lyric video review.',
      'Move LRC timing into SRT validation, cleanup, or upload workflows.',
    ],
    faqs: [
      {
        question: 'How do I convert an LRC lyric file to SRT?',
        answer:
          'Open the LRC to SRT converter, paste or upload the .lrc file, and export timestamped lyric lines as numbered SRT cues.',
      },
      {
        question: 'What is an LRC file?',
        answer:
          'LRC is a timestamped lyric format that stores song lines with time tags such as [00:12.34] before each lyric line.',
      },
      {
        question: 'How are LRC cue end times created?',
        answer:
          'Each SRT cue ends at the next LRC timestamp. The final lyric line gets a short default duration, so review the last cue before upload.',
      },
      {
        question: 'Are LRC files uploaded to a server?',
        answer:
          'No. The LRC to SRT conversion runs locally in your browser, so the lyric file stays on your device.',
      },
    ],
    relatedTools: ['srt-validator', 'subtitle-time-shifter'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-lrc-to-srt/',
        title: 'How to convert LRC to SRT',
      },
      {
        href: '/guides/how-to-validate-srt-files/',
        title: 'How to validate SRT files',
      },
      {
        href: '/guides/why-subtitles-drift-out-of-sync/',
        title: 'Why subtitles drift out of sync',
      },
    ],
    sampleInput: sharedSamples.lrc,
  },
  {
    id: 'subviewer-to-srt',
    title: 'SubViewer to SRT Converter',
    shortTitle: 'SubViewer to SRT',
    description:
      'Convert SubViewer SUB subtitles to SRT online for free, locally in your browser with no upload.',
    summary:
      'Use this free SubViewer to SRT converter when an older .sub caption file needs standard SubRip timing for editing, upload, review, or archive handoff.',
    buttonLabel: 'Convert to SRT',
    inputLabel: 'SubViewer SUB input',
    outputLabel: 'SRT output',
    placeholder: 'Paste your SubViewer .sub subtitles here',
    acceptedExtensions: ['.sub', '.txt'],
    sampleFileName: 'sample.sub',
    useCases: [
      'Convert time-based SubViewer .sub subtitles to standard SRT.',
      'Move older SubViewer caption files into editors that expect SubRip timing.',
      'Create an upload-ready copy from a SubViewer subtitle file.',
      'Prepare SubViewer captions for SRT validation, cleanup, or archive workflows.',
    ],
    faqs: [
      {
        question: 'How do I convert a SubViewer SUB file to SRT?',
        answer:
          'Open the SubViewer to SRT converter, paste or upload the .sub file, and export time-based subtitle blocks as numbered SRT cues.',
      },
      {
        question: 'What is a SubViewer subtitle file?',
        answer:
          'SubViewer is an older time-based subtitle format that usually stores cues as start and end timestamps followed by caption text in a .sub file.',
      },
      {
        question: 'Does SubViewer to SRT preserve line breaks?',
        answer:
          'Yes. The converter turns SubViewer [br] markers into regular SRT line breaks and keeps readable caption text.',
      },
      {
        question: 'Are SubViewer files uploaded to a server?',
        answer:
          'No. The SubViewer to SRT conversion runs locally in your browser, so the subtitle file stays on your device.',
      },
    ],
    relatedTools: ['microdvd-to-srt', 'srt-validator'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-subviewer-to-srt/',
        title: 'How to convert SubViewer to SRT',
      },
      {
        href: '/guides/how-to-validate-srt-files/',
        title: 'How to validate SRT files',
      },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes/',
        title: 'Common subtitle format errors and fixes',
      },
    ],
    sampleInput: sharedSamples.subviewer,
  },
  {
    id: 'youtube-subtitle-converter',
    title: 'YouTube Subtitle Converter',
    shortTitle: 'YouTube converter',
    description:
      'Convert VTT, ASS, or SSA subtitles to YouTube-ready SRT captions directly in your browser with no upload.',
    summary:
      'Use this free YouTube subtitle converter when your source file is VTT, ASS, or SSA but your upload workflow needs a clean SRT caption file.',
    buttonLabel: 'Convert for YouTube',
    inputLabel: 'Subtitle input',
    outputLabel: 'YouTube SRT output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'youtube-captions.vtt',
    useCases: [
      'Prepare subtitles for YouTube uploads.',
      'Convert WebVTT captions into SRT for a YouTube handoff.',
      'Flatten ASS styling before uploading captions.',
      'Create a simple SRT copy for creator review.',
    ],
    faqs: [
      {
        question: 'What subtitle format should I upload to YouTube?',
        answer:
          'SRT is the safest default for most YouTube caption upload workflows because it is simple and easy to inspect.',
      },
      {
        question: 'Can this convert VTT or ASS captions for YouTube?',
        answer:
          'Yes. VTT input is converted to comma-based SRT timing with numbered cue blocks, and ASS or SSA input is flattened into readable SRT captions.',
      },
      {
        question: 'What happens to ASS styling?',
        answer:
          'ASS styling and positioning are removed because YouTube captions mainly need timing and readable text.',
      },
      {
        question: 'Are my subtitle files uploaded to a server?',
        answer:
          'No. YouTube subtitle conversion runs locally in your browser, so your file stays on your device.',
      },
    ],
    relatedTools: ['vtt-to-srt', 'ass-to-srt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-subtitles-for-youtube/',
        title: 'How to convert subtitles for YouTube',
      },
      {
        href: '/guides/why-youtube-subtitles-upload-failed/',
        title: 'Why YouTube subtitle upload failed',
      },
      {
        href: '/guides/best-srt-settings-for-youtube-upload/',
        title: 'Best SRT settings for YouTube upload',
      },
      { href: '/guides/best-subtitle-format-for-youtube/', title: 'Best subtitle format for YouTube' },
    ],
    sampleInput: sharedSamples.vtt,
  },
  {
    id: 'html5-video-subtitle-converter',
    title: 'HTML5 Video Subtitle Converter',
    shortTitle: 'HTML5 converter',
    description:
      'Convert SRT or ASS subtitles to WebVTT for HTML5 video tracks and browser playback.',
    summary:
      'Use this free HTML5 video subtitle converter when a browser video player needs VTT output with a WEBVTT header and dot-based timestamps.',
    buttonLabel: 'Convert for HTML5 video',
    inputLabel: 'Subtitle input',
    outputLabel: 'HTML5 VTT output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'html5-captions.srt',
    useCases: [
      'Prepare captions for an HTML5 video track.',
      'Convert SRT files into WebVTT before publishing.',
      'Flatten ASS subtitles into browser-friendly captions.',
      'Create a VTT file for a web page or static site.',
    ],
    faqs: [
      {
        question: 'What format does HTML5 video need?',
        answer:
          'HTML5 track elements normally expect WebVTT, so this tool outputs VTT for supported subtitle input.',
      },
      {
        question: 'Does the output include the WEBVTT header?',
        answer:
          'Yes. The VTT output includes the WEBVTT header and dot-based timestamp formatting.',
      },
      {
        question: 'Can I paste SRT input?',
        answer:
          'Yes. SRT input is converted to browser-ready VTT output.',
      },
      {
        question: 'Are my subtitle files uploaded to a server?',
        answer:
          'No. HTML5 subtitle conversion runs locally in your browser.',
      },
    ],
    relatedTools: ['srt-to-vtt', 'ass-to-vtt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-subtitles-for-html5-video/',
        title: 'How to convert subtitles for HTML5 video',
      },
      {
        href: '/guides/how-to-fix-vtt-mime-type-for-html5-video/',
        title: 'How to fix VTT MIME type for HTML5 video',
      },
      {
        href: '/guides/how-to-fix-cors-errors-for-vtt-subtitles/',
        title: 'How to fix CORS errors for VTT subtitles',
      },
      {
        href: '/guides/how-to-add-multiple-subtitle-languages-to-html5-video/',
        title: 'How to add multiple subtitle languages to HTML5 video',
      },
      { href: '/guides/best-subtitle-format-for-html5-video/', title: 'Best subtitle format for HTML5 video' },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'videojs-subtitle-converter',
    title: 'Video.js Subtitle Converter',
    shortTitle: 'Video.js converter',
    description:
      'Convert SRT or ASS subtitles to WebVTT captions for Video.js players and web video workflows.',
    summary:
      'Use this free Video.js subtitle converter to create VTT captions that fit common Video.js and browser playback workflows.',
    buttonLabel: 'Convert for Video.js',
    inputLabel: 'Subtitle input',
    outputLabel: 'Video.js VTT output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'videojs-captions.srt',
    useCases: [
      'Prepare captions for Video.js players.',
      'Convert SRT subtitles into WebVTT for a web player.',
      'Create browser-ready VTT output before testing playback.',
      'Flatten ASS captions before using them in Video.js.',
    ],
    faqs: [
      {
        question: 'What subtitle format should I use with Video.js?',
        answer:
          'WebVTT is the safest default for Video.js captions because it matches browser video track expectations.',
      },
      {
        question: 'Can this fix a missing WEBVTT header?',
        answer:
          'Yes. When converting parsed subtitle cues to VTT, the output includes a WEBVTT header.',
      },
      {
        question: 'Should I test the output in Video.js?',
        answer:
          'Yes. Conversion prepares the file, but you should still test captions in the actual player setup.',
      },
      {
        question: 'Are my subtitle files uploaded to a server?',
        answer:
          'No. Video.js subtitle conversion runs locally in your browser.',
      },
    ],
    relatedTools: ['srt-to-vtt', 'webvtt-validator'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-subtitles-for-videojs/',
        title: 'How to convert subtitles for Video.js',
      },
      {
        href: '/guides/why-videojs-captions-are-not-showing/',
        title: 'Why Video.js captions are not showing',
      },
      { href: '/guides/best-subtitle-format-for-videojs/', title: 'Best subtitle format for Video.js' },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'jw-player-subtitle-converter',
    title: 'JW Player Subtitle Converter',
    shortTitle: 'JW Player converter',
    description:
      'Convert SRT or ASS subtitles to WebVTT captions for JW Player and browser-based video delivery.',
    summary:
      'Use this free JW Player subtitle converter when your web video workflow needs clean VTT captions from SRT or ASS source files.',
    buttonLabel: 'Convert for JW Player',
    inputLabel: 'Subtitle input',
    outputLabel: 'JW Player VTT output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'jw-player-captions.srt',
    useCases: [
      'Prepare subtitles for JW Player captions.',
      'Convert SRT to WebVTT before web delivery.',
      'Create VTT captions from ASS editing files.',
      'Check caption format before debugging player setup.',
    ],
    faqs: [
      {
        question: 'What format should I use for JW Player captions?',
        answer:
          'WebVTT is usually the safest web delivery format for JW Player and browser-based players.',
      },
      {
        question: 'Can I convert SRT to VTT here?',
        answer:
          'Yes. The converter turns SRT cue blocks into WebVTT output.',
      },
      {
        question: 'Does this configure JW Player for me?',
        answer:
          'No. It prepares the subtitle file. You still need to attach the VTT file in your player configuration.',
      },
      {
        question: 'Are my subtitle files uploaded to a server?',
        answer:
          'No. JW Player subtitle conversion runs locally in your browser.',
      },
    ],
    relatedTools: ['srt-to-vtt', 'webvtt-validator'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-subtitles-for-jw-player/',
        title: 'How to convert subtitles for JW Player',
      },
      {
        href: '/guides/why-jw-player-captions-are-not-showing/',
        title: 'Why JW Player captions are not showing',
      },
      { href: '/guides/best-subtitle-format-for-jw-player/', title: 'Best subtitle format for JW Player' },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'plex-subtitle-converter',
    title: 'Plex Subtitle Converter',
    shortTitle: 'Plex converter',
    description:
      'Convert VTT or ASS subtitles to SRT for Plex libraries, media folders, and broad playback compatibility.',
    summary:
      'Use this free Plex subtitle converter when you want a simple SRT copy for a media library or device-friendly playback workflow.',
    buttonLabel: 'Convert for Plex',
    inputLabel: 'Subtitle input',
    outputLabel: 'Plex SRT output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'plex-captions.ass',
    useCases: [
      'Prepare subtitles for Plex libraries.',
      'Convert ASS subtitles to a simpler SRT copy.',
      'Convert VTT captions for media library storage.',
      'Create a portable subtitle file for device playback.',
    ],
    faqs: [
      {
        question: 'What format is safest for Plex subtitles?',
        answer:
          'SRT is the safest default for broad Plex library compatibility because it keeps timing and text simple.',
      },
      {
        question: 'Can this convert ASS subtitles for Plex?',
        answer:
          'Yes. ASS input is flattened into SRT timing and readable subtitle text.',
      },
      {
        question: 'Will ASS styling be preserved?',
        answer:
          'No. SRT output does not preserve ASS colors, positioning, or effects.',
      },
      {
        question: 'Are my subtitle files uploaded to a server?',
        answer:
          'No. Plex subtitle conversion runs locally in your browser.',
      },
    ],
    relatedTools: ['ass-to-srt', 'vtt-to-srt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-subtitles-for-plex/',
        title: 'How to convert subtitles for Plex',
      },
      {
        href: '/guides/why-plex-subtitles-are-not-showing/',
        title: 'Why Plex subtitles are not showing',
      },
      {
        href: '/guides/how-to-name-subtitle-files-for-plex/',
        title: 'How to name subtitle files for Plex',
      },
      { href: '/guides/best-subtitle-format-for-plex/', title: 'Best subtitle format for Plex' },
    ],
    sampleInput: sharedSamples.ass,
  },
  {
    id: 'vimeo-subtitle-converter',
    title: 'Vimeo Subtitle Converter',
    shortTitle: 'Vimeo converter',
    description:
      'Convert SRT or ASS subtitles to WebVTT for Vimeo embeds, web playback, and caption delivery.',
    summary:
      'Use this free Vimeo subtitle converter when a web embed workflow needs VTT captions from SRT or ASS source files.',
    buttonLabel: 'Convert for Vimeo',
    inputLabel: 'Subtitle input',
    outputLabel: 'Vimeo VTT output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'vimeo-captions.srt',
    useCases: [
      'Prepare captions for Vimeo embed workflows.',
      'Convert SRT subtitles to WebVTT for web playback.',
      'Create VTT captions from ASS subtitle exports.',
      'Check caption files before publishing a video page.',
    ],
    faqs: [
      {
        question: 'What format does this converter output for Vimeo?',
        answer:
          'It outputs WebVTT because VTT is the safer default for browser and embed caption workflows.',
      },
      {
        question: 'Can I use SRT input?',
        answer:
          'Yes. SRT input is converted to VTT with a WEBVTT header and dot-based timestamps.',
      },
      {
        question: 'Should I keep the original subtitle file?',
        answer:
          'Yes. Keep the source SRT or ASS file if you may need to edit captions again later.',
      },
      {
        question: 'Are my subtitle files uploaded to a server?',
        answer:
          'No. Vimeo subtitle conversion runs locally in your browser.',
      },
    ],
    relatedTools: ['srt-to-vtt', 'ass-to-vtt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-subtitles-for-vimeo/',
        title: 'How to convert subtitles for Vimeo',
      },
      {
        href: '/guides/why-vimeo-captions-are-not-showing/',
        title: 'Why Vimeo captions are not showing',
      },
      { href: '/guides/best-subtitle-format-for-vimeo-embeds/', title: 'Best subtitle format for Vimeo embeds' },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'subtitle-time-shifter',
    title: 'Subtitle Time Shifter',
    shortTitle: 'Time shifter',
    description:
      'Shift subtitle timing online for SRT, VTT, and ASS files when captions are too early or too late.',
    summary:
      'Use this free subtitle time shifter when subtitles start too early or too late, but the cue order is otherwise correct.',
    buttonLabel: 'Shift timestamps',
    inputLabel: 'Subtitle input',
    outputLabel: 'Shifted subtitle output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Fix subtitle delay without opening a video editor.',
      'Fix subtitles that lag behind the speaker.',
      'Repair captions after editing the intro of a video.',
      'Quickly offset a whole subtitle file without opening a timeline editor.',
    ],
    faqs: [
      {
        question: 'Is this subtitle time shifter free?',
        answer:
          'Yes. You can shift subtitle timing for free in your browser without signup.',
      },
      {
        question: 'Can I use negative numbers?',
        answer:
          'Yes. Negative values move subtitles earlier and positive values delay them.',
      },
      {
        question: 'Will this preserve the original format?',
        answer:
          'Yes. SRT stays SRT, VTT stays VTT, and ASS stays ASS after the shift.',
      },
      {
        question: 'Should I shift subtitles forward or backward?',
        answer:
          'If subtitles appear too early, use a positive value to delay them. If they appear too late, use a negative value to move them earlier.',
      },
      {
        question: 'Are my subtitle files uploaded to a server?',
        answer:
          'No. Timing changes run locally in your browser, so your subtitle file stays on your device.',
      },
    ],
    relatedTools: ['subtitle-cleaner', 'vtt-to-srt'],
    relatedGuides: [
      {
        href: '/guides/fix-out-of-sync-subtitles/',
        title: 'How to fix out-of-sync subtitles',
      },
      {
        href: '/guides/why-subtitles-drift-out-of-sync/',
        title: 'Why subtitles drift out of sync',
      },
      {
        href: '/guides/why-subtitles-are-out-of-sync-after-export/',
        title: 'Why subtitles are out of sync after export',
      },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes/',
        title: 'Common subtitle format errors and fixes',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'subtitle-cleaner',
    title: 'Subtitle Cleaner Online',
    shortTitle: 'Cleaner',
    description:
      'Clean subtitle files online by removing HTML tags, fixing spacing, and keeping SRT, VTT, or ASS timing intact.',
    summary:
      'Use this free subtitle cleaner when SRT, VTT, or ASS text has leftover HTML tags, messy spacing, or formatting that should be cleaned before upload.',
    buttonLabel: 'Clean subtitles',
    inputLabel: 'Subtitle input',
    outputLabel: 'Cleaned subtitle output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Remove leftover HTML tags from subtitle text before upload.',
      'Fix messy subtitle spacing without changing cue timing.',
      'Clean imported SRT, VTT, or ASS text before conversion.',
      'Prepare a cleaner subtitle file for review, handoff, or platform testing.',
    ],
    faqs: [
      {
        question: 'Is this subtitle cleaner free?',
        answer:
          'Yes. You can clean subtitle files for free in your browser without signup or upload.',
      },
      {
        question: 'Does this change timing?',
        answer:
          'No. The cleaner keeps timing as-is and focuses on text normalization and consistent output structure.',
      },
      {
        question: 'Can it remove leftover HTML-style subtitle tags?',
        answer:
          'Yes. The cleaner strips common inline HTML tags such as `<b>`, `<i>`, and similar markup while keeping the subtitle text itself.',
      },
      {
        question: 'Will the file extension stay the same?',
        answer:
          'Yes. The cleaner outputs the same detected subtitle format whenever possible.',
      },
      {
        question: 'Are my subtitle files uploaded to a server?',
        answer:
          'No. Subtitle cleanup runs locally in your browser, so your SRT, VTT, or ASS file stays on your device.',
      },
    ],
    relatedTools: ['clean-srt-file', 'srt-validator'],
    relatedGuides: [
      {
        href: '/guides/how-to-remove-html-tags-from-subtitles/',
        title: 'How to remove HTML tags from subtitles',
      },
      {
        href: '/guides/how-to-fix-subtitle-line-breaks/',
        title: 'How to fix subtitle line breaks',
      },
      {
        href: '/guides/how-to-fix-overlapping-subtitles/',
        title: 'How to fix overlapping subtitles',
      },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes/',
        title: 'Common subtitle format errors and fixes',
      },
      {
        href: '/guides/how-to-convert-subtitle-files-for-web-players/',
        title: 'How to convert subtitle files for web players',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'subtitle-delay-fixer',
    title: 'Subtitle Delay Fixer',
    shortTitle: 'Delay fixer',
    description:
      'Fix out-of-sync subtitles by shifting SRT, VTT, or ASS captions earlier or later in milliseconds.',
    summary:
      'Use this free subtitle delay fixer when every caption is ahead of audio, behind speech, or out of sync by the same number of milliseconds.',
    buttonLabel: 'Fix delay',
    inputLabel: 'Subtitle input',
    outputLabel: 'Fixed subtitle output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Fix subtitles that appear ahead of audio or behind speech by a constant offset.',
      'Delay captions by entering a positive millisecond value after a video intro was added.',
      'Move all subtitle cues earlier with a negative millisecond value after trimming a video start.',
      'Repair out-of-sync SRT, VTT, ASS, or SSA files without opening a video editor.',
    ],
    faqs: [
      {
        question: 'Is this subtitle delay fixer free?',
        answer:
          'Yes. You can fix subtitle delay for free in your browser without signup.',
      },
      {
        question: 'Should I use a positive or negative value?',
        answer:
          'Use a positive value when subtitles are ahead of audio. Use a negative value when subtitles are behind speech.',
      },
      {
        question: 'How many milliseconds should I shift subtitles?',
        answer:
          'Estimate the offset between the spoken audio and the matching caption. For example, use 1500 to delay subtitles by 1.5 seconds, or -1500 to move them 1.5 seconds earlier.',
      },
      {
        question: 'Can this fix out-of-sync subtitles?',
        answer:
          'Yes, when the whole subtitle file is off by a constant amount. If only one section drifts out of sync, use the partial subtitle shifter instead.',
      },
      {
        question: 'Can this fix subtitles ahead of audio?',
        answer:
          'Yes. If every caption appears before the matching speech by the same amount, enter a positive millisecond value to move captions later.',
      },
      {
        question: 'Can this fix subtitles behind audio?',
        answer:
          'Yes. If every caption appears after the matching speech by the same amount, enter a negative millisecond value to move captions earlier.',
      },
      {
        question: 'Does this preserve the subtitle format?',
        answer:
          'Yes. SRT stays SRT, VTT stays VTT, and ASS stays ASS after the delay fix.',
      },
      {
        question: 'Are my subtitle files uploaded to a server?',
        answer:
          'No. The delay fix runs locally in your browser, so your subtitle file stays on your device.',
      },
    ],
    relatedTools: ['subtitle-time-shifter', 'fix-out-of-sync-subtitles'],
    relatedGuides: [
      { href: '/guides/how-to-fix-subtitle-delay/', title: 'How to fix subtitle delay' },
      {
        href: '/guides/why-subtitles-drift-out-of-sync/',
        title: 'Why subtitles drift out of sync',
      },
      {
        href: '/guides/why-subtitles-are-out-of-sync-after-export/',
        title: 'Why subtitles are out of sync after export',
      },
      { href: '/guides/fix-out-of-sync-subtitles/', title: 'How to fix out-of-sync subtitles' },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'fix-out-of-sync-subtitles',
    title: 'Fix Out-of-Sync Subtitles',
    shortTitle: 'Fix sync',
    description:
      'Fix out-of-sync subtitles online by shifting SRT, VTT, or ASS cues to match the video.',
    summary:
      'Use this when subtitles are consistently ahead of or behind the audio and need a global timing correction.',
    buttonLabel: 'Fix sync',
    inputLabel: 'Subtitle input',
    outputLabel: 'Synced subtitle output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Move out-of-sync subtitles earlier or later.',
      'Repair captions after a video export changed timing.',
      'Fix a constant timing offset across the whole file.',
      'Create a corrected subtitle file for review or upload.',
    ],
    faqs: [
      {
        question: 'Can this fix drifting subtitles?',
        answer:
          'This tool fixes a constant offset. If subtitles drift more over time, the file may need a more advanced retiming workflow.',
      },
      {
        question: 'Can I move subtitles earlier?',
        answer:
          'Yes. Enter a negative millisecond value to move subtitles earlier.',
      },
      {
        question: 'Can I move subtitles later?',
        answer:
          'Yes. Enter a positive millisecond value to delay subtitles.',
      },
      {
        question: 'Are my subtitle files uploaded to a server?',
        answer:
          'No. Sync fixes run locally in your browser, so your subtitle file stays on your device.',
      },
    ],
    relatedTools: ['subtitle-delay-fixer', 'partial-subtitle-shifter'],
    relatedGuides: [
      { href: '/guides/fix-out-of-sync-subtitles/', title: 'How to fix out-of-sync subtitles' },
      {
        href: '/guides/why-subtitles-drift-out-of-sync/',
        title: 'Why subtitles drift out of sync',
      },
      {
        href: '/guides/why-subtitles-are-out-of-sync-after-export/',
        title: 'Why subtitles are out of sync after export',
      },
      {
        href: '/guides/fix-subtitle-sync-after-a-scene-cut/',
        title: 'Fix subtitle sync after a scene cut',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'clean-srt-file',
    title: 'Clean SRT File Online',
    shortTitle: 'Clean SRT',
    description:
      'Clean an SRT file online by normalizing cue numbers, timestamps, spacing, and subtitle text.',
    summary:
      'Use this free SRT cleaner when a SubRip file has messy spacing, stray inline tags, or inconsistent cue numbering before upload.',
    buttonLabel: 'Clean SRT',
    inputLabel: 'SRT input',
    outputLabel: 'Clean SRT output',
    placeholder: 'Paste your SRT subtitles here',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Clean messy SRT files before upload.',
      'Remove stray inline HTML tags from subtitle text.',
      'Normalize SRT cue numbering and timestamp formatting.',
      'Prepare a cleaner SRT file for review or handoff.',
    ],
    faqs: [
      {
        question: 'Does this change subtitle timing?',
        answer:
          'No. The cleaner preserves parsed cue timing while normalizing structure and text.',
      },
      {
        question: 'Can it remove HTML tags from SRT text?',
        answer:
          'Yes. It strips common inline tags and normalizes spacing in subtitle text.',
      },
      {
        question: 'Will SRT cue numbers be renumbered?',
        answer:
          'Yes. The output is serialized as clean SRT with sequential cue numbers.',
      },
      {
        question: 'Are my SRT files uploaded to a server?',
        answer:
          'No. SRT cleaning runs locally in your browser, so your subtitle file stays on your device.',
      },
    ],
    relatedTools: ['subtitle-cleaner', 'remove-srt-line-numbers'],
    relatedGuides: [
      {
        href: '/guides/how-to-clean-an-srt-file/',
        title: 'How to clean an SRT file',
      },
      {
        href: '/guides/why-srt-file-wont-upload/',
        title: 'Why your SRT file will not upload',
      },
      {
        href: '/guides/how-to-clean-subtitle-formatting-before-upload/',
        title: 'How to clean subtitle formatting before upload',
      },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes/',
        title: 'Common subtitle format errors and fixes',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'remove-srt-line-numbers',
    title: 'Remove SRT Line Numbers',
    shortTitle: 'Remove SRT numbers',
    description:
      'Remove and rebuild SRT line numbers online while keeping subtitle timing and text readable.',
    summary:
      'Use this when SRT cue numbers are missing, duplicated, out of order, or need to be regenerated before upload.',
    buttonLabel: 'Renumber SRT',
    inputLabel: 'SRT input',
    outputLabel: 'Renumbered SRT output',
    placeholder: 'Paste your SRT subtitles here',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Fix duplicated SRT cue numbers.',
      'Rebuild missing or out-of-order SRT numbering.',
      'Normalize line numbers before uploading subtitles.',
      'Create a clean SRT file from readable cue blocks.',
    ],
    faqs: [
      {
        question: 'Does this remove subtitle text?',
        answer:
          'No. It keeps subtitle text and timing, then rebuilds sequential SRT cue numbers.',
      },
      {
        question: 'Can I use it when line numbers are missing?',
        answer:
          'Yes. The parser looks for timing lines and outputs a clean numbered SRT file.',
      },
      {
        question: 'Does this output TXT or SRT?',
        answer:
          'It outputs SRT. If you want text without timestamps, use the SRT to TXT converter instead.',
      },
      {
        question: 'Are my SRT files uploaded to a server?',
        answer:
          'No. Renumbering runs locally in your browser, so your subtitle file stays on your device.',
      },
    ],
    relatedTools: ['srt-to-txt', 'clean-srt-file'],
    relatedGuides: [
      {
        href: '/guides/how-to-remove-subtitle-line-numbers/',
        title: 'How to remove subtitle line numbers',
      },
      {
        href: '/guides/how-to-fix-malformed-srt-timestamps/',
        title: 'How to fix malformed SRT timestamps',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'fix-srt-timestamps',
    title: 'Fix SRT Timestamps',
    shortTitle: 'Fix SRT timestamps',
    description:
      'Fix malformed SRT timestamps online by parsing cues, converting dot timing to commas, and exporting clean SubRip timing.',
    summary:
      'Use this free SRT timestamp fixer when an upload fails because timing lines use dots, inconsistent arrows, bad spacing, or broken cue numbers.',
    buttonLabel: 'Fix timestamps',
    inputLabel: 'SRT input',
    outputLabel: 'Fixed SRT output',
    placeholder: 'Paste your SRT subtitles here',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Repair malformed SRT timestamp lines before upload.',
      'Convert dot-based milliseconds back to comma-based SRT timing.',
      'Fix spacing around SRT timestamp arrows.',
      'Rebuild sequential cue numbers from parseable cue blocks.',
    ],
    faqs: [
      {
        question: 'Is this SRT timestamp fixer free?',
        answer:
          'Yes. You can fix parseable SRT timestamp formatting for free in your browser without signup or upload.',
      },
      {
        question: 'Can this fix every broken SRT file?',
        answer:
          'No. It can normalize parseable cue blocks. Severely damaged timing lines may still need manual repair.',
      },
      {
        question: 'Can it fix dot timestamps in an SRT file?',
        answer:
          'Yes. If the cue line can be parsed, the output converts dot-based milliseconds into comma-based SRT timestamps.',
      },
      {
        question: 'Can this help when an SRT upload fails?',
        answer:
          'Yes. It is useful when the upload error comes from malformed timing lines, wrong separators, arrow spacing, or cue numbering.',
      },
      {
        question: 'Does this preserve subtitle text?',
        answer:
          'Yes. It keeps parsed subtitle text and exports clean SRT timing.',
      },
      {
        question: 'Will cue numbers be rebuilt?',
        answer:
          'Yes. The output uses sequential SRT cue numbers.',
      },
      {
        question: 'Are my SRT files uploaded to a server?',
        answer:
          'No. Timestamp fixing runs locally in your browser, so your subtitle file stays on your device.',
      },
    ],
    relatedTools: ['srt-validator', 'clean-srt-file'],
    relatedGuides: [
      {
        href: '/guides/how-to-fix-malformed-srt-timestamps/',
        title: 'How to fix malformed SRT timestamps',
      },
      {
        href: '/guides/why-srt-file-wont-upload/',
        title: 'Why your SRT file will not upload',
      },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes/',
        title: 'Common subtitle format errors and fixes',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'srt-validator',
    title: 'SRT Validator Online',
    shortTitle: 'SRT validator',
    description:
      'Validate SRT subtitles online and check upload errors, timestamp format, cue order, and numbering.',
    summary:
      'Use this free SRT validator before upload to find timestamp errors, out-of-order cues, numbering problems, and parse issues without sending the file to a server.',
    buttonLabel: 'Validate SRT',
    inputLabel: 'SRT input',
    outputLabel: 'Validation report',
    placeholder: 'Paste your SRT subtitles here',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Check SRT files before YouTube or platform upload.',
      'Find comma, arrow, and timestamp separator problems.',
      'Confirm how many subtitle cues can be parsed.',
      'Diagnose SRT files that an editor or upload form rejects.',
    ],
    faqs: [
      {
        question: 'Is this SRT validator free?',
        answer:
          'Yes. You can validate SRT subtitles for free in your browser without signup or upload.',
      },
      {
        question: 'Does the validator change my subtitle file?',
        answer:
          'No. It outputs a text report. Use the SRT timestamp fixer or cleaner if you want a repaired file.',
      },
      {
        question: 'Can this help when an SRT file will not upload?',
        answer:
          'Yes. The report checks common upload blockers such as malformed timestamps, cue order problems, and numbering issues so you know what to fix next.',
      },
      {
        question: 'Can it detect dot-based timestamps?',
        answer:
          'Yes. It flags dot-based milliseconds because standard SRT uses commas.',
      },
      {
        question: 'Does it count parsed cues?',
        answer:
          'Yes. The report includes how many subtitle cues were detected.',
      },
      {
        question: 'Are my SRT files uploaded to a server?',
        answer:
          'No. Validation runs locally in your browser, so your subtitle file stays on your device.',
      },
    ],
    relatedTools: ['fix-srt-timestamps', 'clean-srt-file'],
    relatedGuides: [
      {
        href: '/guides/why-srt-file-wont-upload/',
        title: 'Why your SRT file will not upload',
      },
      {
        href: '/guides/how-to-validate-srt-files/',
        title: 'How to validate SRT files',
      },
      {
        href: '/guides/how-to-fix-malformed-srt-timestamps/',
        title: 'How to fix malformed SRT timestamps',
      },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes/',
        title: 'Common subtitle format errors and fixes',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'webvtt-validator',
    title: 'WebVTT Validator Online',
    shortTitle: 'VTT validator',
    description:
      'Validate WebVTT captions online and check missing WEBVTT headers, timestamp syntax, cue order, and HTML5 caption issues.',
    summary:
      'Use this free WebVTT validator when captions do not load in HTML5 video or a browser player rejects a VTT file. Check the header, timestamps, cue order, and parseable cues locally.',
    buttonLabel: 'Validate VTT',
    inputLabel: 'VTT input',
    outputLabel: 'Validation report',
    placeholder: 'Paste your VTT subtitles here',
    acceptedExtensions: ['.vtt', '.txt'],
    sampleFileName: 'sample.vtt',
    useCases: [
      'Check WebVTT files before using them in HTML5 video.',
      'Find missing WEBVTT headers that stop captions from loading.',
      'Detect comma-based SRT timestamps inside VTT files.',
      'Diagnose VTT captions that do not render in a browser player.',
    ],
    faqs: [
      {
        question: 'Is this WebVTT validator free?',
        answer:
          'Yes. You can validate WebVTT captions for free in your browser without signup or upload.',
      },
      {
        question: 'Does the validator repair VTT files?',
        answer:
          'No. It outputs a validation report. Use the SRT to VTT converter or edit the file if repairs are needed.',
      },
      {
        question: 'Can this help when VTT captions are not showing?',
        answer:
          'Yes. The report checks file-level blockers such as a missing WEBVTT header, invalid timestamps, cue order problems, and parse errors before you debug the player setup.',
      },
      {
        question: 'Can it detect a missing WEBVTT header?',
        answer:
          'Yes. The report flags VTT files that do not start with the WEBVTT header.',
      },
      {
        question: 'Does it count parsed cues?',
        answer:
          'Yes. The report includes how many WebVTT cues were detected.',
      },
      {
        question: 'Are my VTT files uploaded to a server?',
        answer:
          'No. Validation runs locally in your browser, so your caption file stays on your device.',
      },
    ],
    relatedTools: ['srt-to-vtt', 'vtt-to-srt'],
    relatedGuides: [
      {
        href: '/guides/why-vtt-captions-are-not-loading/',
        title: 'Why VTT captions are not loading',
      },
      {
        href: '/guides/how-to-fix-cors-errors-for-vtt-subtitles/',
        title: 'How to fix CORS errors for VTT subtitles',
      },
      {
        href: '/guides/how-to-validate-webvtt-files/',
        title: 'How to validate WebVTT files',
      },
      {
        href: '/guides/how-to-fix-invalid-webvtt-timestamps/',
        title: 'How to fix invalid WebVTT timestamps',
      },
      {
        href: '/guides/why-subtitles-do-not-show-in-html5-video/',
        title: 'Why subtitles do not show in HTML5 video',
      },
    ],
    sampleInput: sharedSamples.vtt,
  },
  {
    id: 'subtitle-transcript-generator',
    title: 'Subtitle Transcript Generator',
    shortTitle: 'Transcript generator',
    description:
      'Generate a plain text transcript from SRT, VTT, or ASS subtitle files directly in your browser.',
    summary:
      'Use this free subtitle transcript generator when you want readable dialogue text from a timed subtitle file without timestamps.',
    buttonLabel: 'Generate transcript',
    inputLabel: 'Subtitle input',
    outputLabel: 'Transcript output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Create a transcript draft from subtitle files.',
      'Extract readable dialogue for review or notes.',
      'Remove timing metadata before translation.',
      'Turn captions into plain text without uploading files.',
    ],
    faqs: [
      {
        question: 'Is this subtitle transcript generator free?',
        answer:
          'Yes. You can generate plain text transcripts from subtitle files for free in your browser.',
      },
      {
        question: 'Does it support SRT and VTT?',
        answer:
          'Yes. It supports SRT, VTT, and ASS subtitle input when the cues can be parsed.',
      },
      {
        question: 'Will timestamps be included?',
        answer:
          'No. The transcript output keeps readable subtitle text and removes timing metadata.',
      },
      {
        question: 'Are my subtitle files uploaded to a server?',
        answer:
          'No. Transcript generation runs locally in your browser, so your subtitle file stays on your device.',
      },
    ],
    relatedTools: ['srt-to-txt', 'vtt-to-txt'],
    relatedGuides: [
      {
        href: '/guides/how-to-create-a-transcript-from-subtitles/',
        title: 'How to create a transcript from subtitles',
      },
      {
        href: '/guides/how-to-convert-subtitle-files-for-web-players/',
        title: 'How to convert subtitle files for web players',
      },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes/',
        title: 'Common subtitle format errors and fixes',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'subtitle-encoding-fixer',
    title: 'Subtitle Encoding Fixer',
    shortTitle: 'Encoding fixer',
    description:
      'Fix garbled subtitles online by converting SRT, VTT, ASS, SSA, and SMI files to clean UTF-8 text.',
    summary:
      'Use this free subtitle encoding fixer when an SRT, VTT, ASS, SSA, or SMI file opens with broken characters because it was saved with the wrong text encoding.',
    buttonLabel: 'Convert to UTF-8',
    inputLabel: 'Subtitle input',
    outputLabel: 'UTF-8 subtitle output',
    placeholder: 'Paste your subtitle text here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.smi', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Fix garbled SRT subtitles before sharing or uploading them.',
      'Fix garbled subtitles before uploading them to a video platform.',
      'Convert legacy subtitle files into UTF-8 for modern editors.',
      'Repair broken accents and non-English characters when the source encoding is known.',
    ],
    faqs: [
      {
        question: 'Is this subtitle encoding fixer free?',
        answer:
          'Yes. You can fix garbled subtitle text and export UTF-8 output for free in your browser.',
      },
      {
        question: 'Does this upload my subtitle file?',
        answer:
          'No. The file is decoded and exported locally in your browser.',
      },
      {
        question: 'Which source encodings can I try?',
        answer:
          'The tool supports common encodings such as UTF-8, Windows-1252, ISO-8859-1, GB18030, Big5, Shift JIS, EUC-KR, and Windows-1250.',
      },
      {
        question: 'Will the subtitle timing change?',
        answer:
          'No. The tool only changes how text is decoded and saved. Subtitle timing and cue order stay the same.',
      },
      {
        question: 'What should I try if the output is still garbled?',
        answer:
          'Try another source encoding such as Windows-1252, ISO-8859-1, GB18030, Big5, Shift JIS, or EUC-KR, then export again.',
      },
    ],
    relatedTools: ['subtitle-cleaner', 'srt-to-vtt'],
    relatedGuides: [
      {
        href: '/guides/how-to-fix-subtitles-showing-boxes/',
        title: 'How to fix subtitles showing boxes',
      },
      {
        href: '/guides/how-to-fix-garbled-subtitles/',
        title: 'How to fix garbled subtitles',
      },
      {
        href: '/guides/how-to-convert-subtitles-to-utf-8/',
        title: 'How to convert subtitles to UTF-8',
      },
    ],
    sampleInput: sharedSamples.encodedSrt,
  },
  {
    id: 'subtitle-merger',
    title: 'Subtitle Merger',
    shortTitle: 'Merger',
    description:
      'Merge two SRT, VTT, or ASS subtitle files into one sorted subtitle file in your browser.',
    summary:
      'Use this when captions are split across two files, a translator sends a second track, or you need one clean subtitle file before delivery.',
    buttonLabel: 'Merge subtitles',
    inputLabel: 'First subtitle input',
    outputLabel: 'Merged subtitle output',
    placeholder: 'Paste the first subtitle file here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'part-one.srt',
    secondaryInputLabel: 'Second subtitle input',
    secondarySampleFileName: 'part-two.srt',
    secondarySampleInput: sharedSamples.secondSrt,
    useCases: [
      'Join subtitle files that were exported in separate parts.',
      'Create one sorted subtitle file from two subtitle sources.',
      'Merge SRT, VTT, or ASS cues before doing a final timing pass.',
    ],
    faqs: [
      {
        question: 'Can I merge different subtitle formats?',
        answer:
          'The safest workflow is to merge two files in the same format. If formats differ, the output uses the first file format and keeps timing plus text.',
      },
      {
        question: 'Does the merger renumber SRT cues?',
        answer:
          'Yes. Merged SRT output is sorted by start time and renumbered from 1.',
      },
      {
        question: 'Will ASS styling be preserved?',
        answer:
          'No. ASS output keeps timing and text in a clean default ASS structure. Advanced styling should be checked in a subtitle editor afterward.',
      },
    ],
    relatedTools: ['subtitle-time-shifter', 'subtitle-cleaner'],
    relatedGuides: [
      {
        href: '/guides/how-to-merge-two-srt-files/',
        title: 'How to merge two SRT files',
      },
      {
        href: '/guides/how-to-create-dual-language-subtitles/',
        title: 'How to create dual-language subtitles',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'partial-subtitle-shifter',
    title: 'Partial Subtitle Shifter',
    shortTitle: 'Partial shifter',
    description:
      'Shift only a selected time range inside an SRT, VTT, or ASS subtitle file.',
    summary:
      'Use this when only one scene or one edited segment is out of sync, while the rest of the subtitle file already matches the video.',
    buttonLabel: 'Shift selected range',
    inputLabel: 'Subtitle input',
    outputLabel: 'Partially shifted subtitle output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Fix sync after a scene cut without moving the whole file.',
      'Repair a middle section that drifts while the intro and ending are correct.',
      'Move a selected subtitle range earlier or later before final review.',
    ],
    faqs: [
      {
        question: 'Which cues are shifted?',
        answer:
          'The tool shifts cues whose start time falls inside the selected start and end range.',
      },
      {
        question: 'Can I use a negative shift?',
        answer:
          'Yes. Negative milliseconds move the selected cues earlier; positive milliseconds delay them.',
      },
      {
        question: 'Will cues outside the range change?',
        answer:
          'No. Cues outside the selected range keep their original timing.',
      },
    ],
    relatedTools: ['subtitle-time-shifter', 'subtitle-merger'],
    relatedGuides: [
      {
        href: '/guides/how-to-fix-subtitle-timing-after-cutting-video/',
        title: 'How to fix subtitle timing after cutting a video',
      },
      {
        href: '/guides/how-to-fix-overlapping-subtitles/',
        title: 'How to fix overlapping subtitles',
      },
      {
        href: '/guides/how-to-shift-only-part-of-a-subtitle-file/',
        title: 'How to shift only part of a subtitle file',
      },
      {
        href: '/guides/fix-subtitle-sync-after-a-scene-cut/',
        title: 'Fix subtitle sync after a scene cut',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'extract-subtitles-from-video',
    title: 'Extract Subtitles from Video',
    shortTitle: 'Video extractor',
    description:
      'Extract embedded text subtitle tracks from MKV, MP4, MOV, and WebM files locally with no video upload.',
    summary:
      'Use this free video subtitle extractor when an MKV, MP4, MOV, or WebM file contains embedded text captions and you need a separate subtitle file without uploading the video.',
    buttonLabel: 'Extract subtitles',
    inputLabel: 'Video input',
    outputLabel: 'Extracted subtitle output',
    placeholder: 'Choose a video file with an embedded subtitle track',
    acceptedExtensions: ['.mkv', '.mp4', '.mov', '.webm', '.m4v'],
    sampleFileName: 'video.mkv',
    useCases: [
      'Extract an embedded text subtitle track from an MKV file.',
      'Check whether an MP4, MOV, or WebM file contains a caption stream.',
      'Create a separate SRT-style subtitle file before conversion, cleanup, or timing repair.',
      'Confirm whether subtitles are embedded text tracks instead of burned-in video pixels.',
    ],
    faqs: [
      {
        question: 'Can this extract burned-in subtitles?',
        answer:
          'No. Burned-in subtitles are part of the video image and require OCR. This tool extracts embedded text subtitle tracks only.',
      },
      {
        question: 'Can I extract subtitles from MKV or MP4 files?',
        answer:
          'Yes, when the video contains an embedded text subtitle stream. MKV files often work best; MP4, MOV, and WebM files work when they include supported text captions.',
      },
      {
        question: 'Does the video upload to a server?',
        answer:
          'No. FFmpeg runs in your browser. The video file stays on your device.',
      },
      {
        question: 'Which subtitle track does it extract?',
        answer:
          'The tool attempts to extract the first embedded subtitle stream as SRT. If the stream is image-based, conversion may fail.',
      },
    ],
    relatedTools: ['subtitle-encoding-fixer', 'subtitle-cleaner'],
    relatedGuides: [
      {
        href: '/guides/how-to-extract-subtitles-from-video/',
        title: 'How to extract subtitles from a video',
      },
      {
        href: '/guides/how-to-extract-subtitles-from-mkv/',
        title: 'How to extract subtitles from MKV',
      },
      {
        href: '/guides/embedded-vs-burned-in-subtitles/',
        title: 'Embedded vs burned-in subtitles',
      },
    ],
    sampleInput:
      'Choose a video file that contains an embedded text subtitle stream. Burned-in subtitles cannot be extracted as text.',
  },
];



const catalogs: Record<SupportedLocale, SubtitleCatalog> = {
  en: {
    toolsPage: {
      eyebrow: 'Free subtitle toolkit',
      title: 'Browser-based subtitle tools for creators and editors',
      description:
        'Convert, shift, clean, and repair subtitle files without opening a heavy video editor or uploading them to a server.',
      whyLocalTitle: 'Why this format works for a first tool site',
      whyLocalItems: [
        'Processing stays in the browser, so privacy is easy to explain and fast to trust.',
        'Subtitle jobs are small, repeated, and task-driven. Search intent is clean.',
        'Every tool can be paired with a short guide, which helps avoid thin pages.',
      ],
      guideTitle: 'Start with the guides users actually search for',
      guideDescription:
        'These guides support the tool pages and give you the first internal-linking cluster.',
      guides: [
        { href: '/guides/srt-vs-vtt/', title: 'SRT vs VTT' },
        { href: '/guides/ass-vs-srt/', title: 'ASS vs SRT' },
        {
          href: '/guides/fix-out-of-sync-subtitles/',
          title: 'How to fix out-of-sync subtitles',
        },
      ],
    },
    pageLabels: {
      loadSample: 'Load sample',
      clear: 'Clear',
      copyOutput: 'Copy output',
      copied: 'Copied',
      downloadOutput: 'Download output',
      uploadTab: 'Upload file',
      pasteTab: 'Paste text',
      uploadTitle: 'Drop a subtitle file here or choose one manually',
      uploadHint: 'Supports SRT, VTT, and ASS where relevant to the tool.',
      selectedFile: 'Selected file',
      noFileSelected: 'No file selected yet',
      processingHint: 'Runs locally in your browser',
      shiftLabel: 'Shift by milliseconds',
      shiftHelp:
        'Use positive numbers to delay captions and negative numbers to move them earlier.',
      shiftPlaceholder: 'e.g. 1200 or -800',
      partialStartLabel: 'Range start time',
      partialEndLabel: 'Range end time',
      partialRangeHelp:
        'Use SRT-style timestamps such as 00:01:20,000. Only cues starting inside this range are shifted.',
      encodingLabel: 'Source text encoding',
      encodingHelp:
        'If the output still looks garbled, try a different source encoding and upload the file again.',
      secondInputTitle: 'Second subtitle file',
      videoUploadTitle: 'Choose a video file with embedded subtitles',
      videoUploadHint:
        'Runs FFmpeg locally. Text subtitle streams can be extracted; burned-in subtitles cannot.',
      ffmpegLoading: 'Loading FFmpeg in the browser...',
      ffmpegExtracting: 'Extracting the first embedded subtitle stream...',
      runLocally: 'No signup. No server upload. Browser-only processing.',
      useCasesTitle: 'When to use this tool',
      faqTitle: 'FAQ',
      relatedToolsTitle: 'Related tools',
      relatedGuidesTitle: 'Related guides',
    },
    tools: enTools,
  }
};


export function getSubtitleCatalog(locale: string): SubtitleCatalog {
  return catalogs.en;
}

export function getSubtitleTool(locale: string, id: string) {
  return getSubtitleCatalog(locale).tools.find((tool) => tool.id === id);
}
