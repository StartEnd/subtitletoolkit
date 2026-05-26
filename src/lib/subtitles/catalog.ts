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
      'Convert SRT subtitles to VTT WebVTT format online for HTML5 video and browser players.',
    summary:
      'Use this free SRT to VTT converter when you already have an `.srt` file and need a clean `.vtt` WebVTT file with the `WEBVTT` header and dot-based timestamps.',
    buttonLabel: 'Convert to VTT',
    inputLabel: 'SRT input',
    outputLabel: 'VTT output',
    placeholder: 'Paste your SRT subtitles here',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Prepare subtitles for HTML5 video players.',
      'Convert SRT to WebVTT before adding captions to a website.',
      'Convert captions for custom web video components.',
      'Clean up SRT files before uploading them into browser-based workflows.',
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
      'Convert VTT WebVTT captions to SRT subtitle files online for editors, uploads, and legacy players.',
    summary:
      'Use this free VTT to SRT converter when a website or player exports `.vtt`, but your editor, archive workflow, or client asks for `.srt`.',
    buttonLabel: 'Convert to SRT',
    inputLabel: 'VTT input',
    outputLabel: 'SRT output',
    placeholder: 'Paste your VTT subtitles here',
    acceptedExtensions: ['.vtt', '.txt'],
    sampleFileName: 'sample.vtt',
    useCases: [
      'Convert VTT to SRT before uploading captions to a platform that expects SubRip files.',
      'Move browser captions into legacy editors.',
      'Prepare subtitle files for offline review and archive workflows.',
      'Convert player-ready WebVTT into a format many teams already use.',
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
        question: 'What happens to the WEBVTT header?',
        answer: 'It is removed, because SRT files do not use that header.',
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
      'Convert simple SubRip captions into ASS format for workflows that need style-ready subtitle files.',
    summary:
      'Use this when your source subtitle file is plain SRT, but the next step of the workflow expects ASS subtitles.',
    buttonLabel: 'Convert to ASS',
    inputLabel: 'SRT input',
    outputLabel: 'ASS output',
    placeholder: 'Paste your SRT subtitles here',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Move plain subtitles into style-capable workflows.',
      'Create an ASS starting point before manual styling.',
      'Prepare subtitles for editors that prefer ASS as an exchange format.',
    ],
    faqs: [
      {
        question: 'Will this create advanced styling automatically?',
        answer:
          'No. It creates a clean ASS structure with a default style so you can keep working from there.',
      },
      {
        question: 'Does line break information stay intact?',
        answer:
          'Yes. Multi-line subtitles are converted into ASS line breaks using the standard `\\N` syntax.',
      },
    ],
    relatedTools: ['ass-to-srt', 'ass-to-vtt'],
    relatedGuides: [
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
      'Convert ASS subtitles to SRT online by flattening styled dialogue into simple SubRip captions.',
    summary:
      'Use this free ASS to SRT converter when you need to move away from styled ASS subtitles and hand a simpler `.srt` file to clients, editors, or upload workflows.',
    buttonLabel: 'Convert to SRT',
    inputLabel: 'ASS input',
    outputLabel: 'SRT output',
    placeholder: 'Paste your ASS subtitles here',
    acceptedExtensions: ['.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.ass',
    useCases: [
      'Convert ASS to SRT for platforms that reject styled subtitle files.',
      'Deliver a simpler subtitle format to clients.',
      'Prepare styled ASS subtitles for platforms that only want SRT.',
      'Flatten ASS dialogue into a more portable file format.',
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
    id: 'youtube-subtitle-converter',
    title: 'YouTube Subtitle Converter',
    shortTitle: 'YouTube converter',
    description:
      'Convert VTT or ASS subtitles to YouTube-ready SRT captions directly in your browser.',
    summary:
      'Use this free YouTube subtitle converter when your source file is VTT or ASS but your upload workflow needs a simple SRT caption file.',
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
        question: 'Can this convert VTT captions for YouTube?',
        answer:
          'Yes. VTT input is converted to comma-based SRT timing with numbered cue blocks.',
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
        href: '/guides/common-subtitle-format-errors-and-fixes/',
        title: 'Common subtitle format errors and fixes',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'subtitle-cleaner',
    title: 'Subtitle Cleaner',
    shortTitle: 'Cleaner',
    description:
      'Clean subtitle text by removing leftover HTML tags, normalizing spacing, and keeping the same file format.',
    summary:
      'Use this when subtitle text is messy, leftover tags slipped in, spacing is inconsistent, or you want a cleaner handoff before the next editing step.',
    buttonLabel: 'Clean subtitles',
    inputLabel: 'Subtitle input',
    outputLabel: 'Cleaned subtitle output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Normalize spacing before sending subtitle files to someone else.',
      'Strip leftover inline HTML tags from imported subtitle text.',
      'Clean imported subtitle text before doing more edits.',
      'Standardize line formatting without changing the target format.',
    ],
    faqs: [
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
    ],
    relatedTools: ['subtitle-time-shifter', 'ass-to-srt'],
    relatedGuides: [
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
      'Fix subtitle delay online by shifting SRT, VTT, or ASS timestamps earlier or later.',
    summary:
      'Use this free subtitle delay fixer when every caption is consistently too early or too late by the same amount.',
    buttonLabel: 'Fix delay',
    inputLabel: 'Subtitle input',
    outputLabel: 'Fixed subtitle output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Fix subtitles that appear too early or too late.',
      'Delay captions after a video intro was added.',
      'Move all subtitle cues earlier after trimming a video start.',
      'Repair a constant subtitle offset without opening a video editor.',
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
          'Use a positive value when subtitles appear too early. Use a negative value when subtitles appear too late.',
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
      'Fix SRT timestamp formatting online by parsing cues and exporting clean comma-based SubRip timing.',
    summary:
      'Use this free SRT timestamp fixer when timing lines have inconsistent separators, spacing, or numbering before upload.',
    buttonLabel: 'Fix timestamps',
    inputLabel: 'SRT input',
    outputLabel: 'Fixed SRT output',
    placeholder: 'Paste your SRT subtitles here',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Normalize SRT timestamps before upload.',
      'Convert dot-based milliseconds back to comma-based SRT timing.',
      'Rebuild a clean SRT file from parseable cue blocks.',
      'Fix spacing around SRT timestamp arrows.',
    ],
    faqs: [
      {
        question: 'Can this fix every broken SRT file?',
        answer:
          'No. It can normalize parseable cue blocks. Severely damaged timing lines may still need manual repair.',
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
        href: '/guides/common-subtitle-format-errors-and-fixes/',
        title: 'Common subtitle format errors and fixes',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'srt-validator',
    title: 'SRT Validator',
    shortTitle: 'SRT validator',
    description:
      'Validate SRT subtitles online and check for missing cues, timestamp issues, and format problems.',
    summary:
      'Use this free SRT validator to check whether a SubRip file has parseable cues, comma-based timestamps, and valid cue order.',
    buttonLabel: 'Validate SRT',
    inputLabel: 'SRT input',
    outputLabel: 'Validation report',
    placeholder: 'Paste your SRT subtitles here',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Check SRT files before uploading them.',
      'Find timestamp separator problems.',
      'Confirm how many cues can be parsed.',
      'Diagnose SRT files that a platform rejects.',
    ],
    faqs: [
      {
        question: 'Does the validator change my subtitle file?',
        answer:
          'No. It outputs a text report. Use the SRT timestamp fixer or cleaner if you want a repaired file.',
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
    title: 'WebVTT Validator',
    shortTitle: 'VTT validator',
    description:
      'Validate WebVTT captions online and check for missing WEBVTT headers, timestamp issues, and cue problems.',
    summary:
      'Use this free WebVTT validator to check whether a VTT file has a valid header, dot-based timestamps, and parseable cues.',
    buttonLabel: 'Validate VTT',
    inputLabel: 'VTT input',
    outputLabel: 'Validation report',
    placeholder: 'Paste your VTT subtitles here',
    acceptedExtensions: ['.vtt', '.txt'],
    sampleFileName: 'sample.vtt',
    useCases: [
      'Check WebVTT files before using them in HTML5 video.',
      'Find missing WEBVTT headers.',
      'Detect comma-based timestamps in VTT files.',
      'Diagnose VTT captions that do not render in a browser.',
    ],
    faqs: [
      {
        question: 'Does the validator repair VTT files?',
        answer:
          'No. It outputs a validation report. Use the SRT to VTT converter or edit the file if repairs are needed.',
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
      'Extract embedded text subtitle tracks from MKV, MP4, MOV, and WebM files locally in your browser.',
    summary:
      'Use this when a video file contains an embedded subtitle stream and you need a separate subtitle file without uploading the video.',
    buttonLabel: 'Extract subtitles',
    inputLabel: 'Video input',
    outputLabel: 'Extracted subtitle output',
    placeholder: 'Choose a video file with an embedded subtitle track',
    acceptedExtensions: ['.mkv', '.mp4', '.mov', '.webm', '.m4v'],
    sampleFileName: 'video.mkv',
    useCases: [
      'Extract a text subtitle track from an MKV file.',
      'Check whether an MP4 contains an embedded caption stream.',
      'Create a separate subtitle file before conversion or cleanup.',
    ],
    faqs: [
      {
        question: 'Can this extract burned-in subtitles?',
        answer:
          'No. Burned-in subtitles are part of the video image and require OCR. This tool extracts embedded text subtitle tracks only.',
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
