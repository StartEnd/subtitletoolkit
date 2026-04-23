export type SubtitleToolId =
  | 'srt-to-vtt'
  | 'vtt-to-srt'
  | 'srt-to-ass'
  | 'ass-to-srt'
  | 'vtt-to-ass'
  | 'ass-to-vtt'
  | 'subtitle-time-shifter'
  | 'subtitle-cleaner';

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
};

const enTools: SubtitleTool[] = [
  {
    id: 'srt-to-vtt',
    title: 'SRT to VTT Converter',
    shortTitle: 'SRT to VTT',
    description:
      'Convert SubRip subtitle files into WebVTT format for HTML5 video and browser players.',
    summary:
      'Use this when you already have an `.srt` file and need a clean `.vtt` file with the `WEBVTT` header and dot-based timestamps.',
    buttonLabel: 'Convert to VTT',
    inputLabel: 'SRT input',
    outputLabel: 'VTT output',
    placeholder: 'Paste your SRT subtitles here',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Prepare subtitles for HTML5 video players.',
      'Convert captions for custom web video components.',
      'Clean up SRT files before uploading them into browser-based workflows.',
    ],
    faqs: [
      {
        question: 'What changes during SRT to VTT conversion?',
        answer:
          'Sequence numbers are removed, the WEBVTT header is added, and commas in timestamps become dots.',
      },
      {
        question: 'Will cue text be changed?',
        answer:
          'No. The tool keeps caption text as-is and only adjusts the format wrapper.',
      },
    ],
    relatedTools: ['vtt-to-srt', 'srt-to-ass'],
    relatedGuides: [
      { href: '/guides/srt-vs-vtt', title: 'SRT vs VTT' },
      {
        href: '/guides/best-subtitle-format-for-html5-video',
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
      'Turn WebVTT captions into numbered SubRip blocks that work with older editors and players.',
    summary:
      'Use this when a website or player exports `.vtt`, but your editor, archive workflow, or client asks for `.srt`.',
    buttonLabel: 'Convert to SRT',
    inputLabel: 'VTT input',
    outputLabel: 'SRT output',
    placeholder: 'Paste your VTT subtitles here',
    acceptedExtensions: ['.vtt', '.txt'],
    sampleFileName: 'sample.vtt',
    useCases: [
      'Move browser captions into legacy editors.',
      'Prepare subtitle files for offline review and archive workflows.',
      'Convert player-ready WebVTT into a format many teams already use.',
    ],
    faqs: [
      {
        question: 'Does the tool keep the cue order?',
        answer:
          'Yes. It preserves the existing order and adds sequence numbers for SRT output.',
      },
      {
        question: 'What happens to the WEBVTT header?',
        answer: 'It is removed, because SRT files do not use that header.',
      },
    ],
    relatedTools: ['srt-to-vtt', 'vtt-to-ass'],
    relatedGuides: [
      { href: '/guides/srt-vs-vtt', title: 'SRT vs VTT' },
      {
        href: '/guides/how-to-convert-subtitle-files-for-web-players',
        title: 'How to convert subtitle files for web players',
      },
    ],
    sampleInput: sharedSamples.vtt,
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
      { href: '/guides/ass-vs-srt', title: 'ASS vs SRT' },
      {
        href: '/guides/when-to-use-ass-instead-of-srt',
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
      'Flatten ASS dialogue lines into simple SubRip subtitles for broader compatibility.',
    summary:
      'Use this when you need to move away from ASS and hand a simpler subtitle file to clients, editors, or upload workflows.',
    buttonLabel: 'Convert to SRT',
    inputLabel: 'ASS input',
    outputLabel: 'SRT output',
    placeholder: 'Paste your ASS subtitles here',
    acceptedExtensions: ['.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.ass',
    useCases: [
      'Deliver a simpler subtitle format to clients.',
      'Prepare styled ASS subtitles for platforms that only want SRT.',
      'Flatten ASS dialogue into a more portable file format.',
    ],
    faqs: [
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
    ],
    relatedTools: ['srt-to-ass', 'ass-to-vtt'],
    relatedGuides: [
      { href: '/guides/ass-vs-srt', title: 'ASS vs SRT' },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes',
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
        href: '/guides/how-to-convert-subtitle-files-for-web-players',
        title: 'How to convert subtitle files for web players',
      },
      {
        href: '/guides/when-to-use-ass-instead-of-srt',
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
        href: '/guides/best-subtitle-format-for-html5-video',
        title: 'Best subtitle format for HTML5 video',
      },
      { href: '/guides/ass-vs-srt', title: 'ASS vs SRT' },
    ],
    sampleInput: sharedSamples.ass,
  },
  {
    id: 'subtitle-time-shifter',
    title: 'Subtitle Time Shifter',
    shortTitle: 'Time shifter',
    description:
      'Move subtitle timestamps forward or backward for SRT, VTT, and ASS files.',
    summary:
      'Use this when subtitles start too early or too late, but the cue order is otherwise correct.',
    buttonLabel: 'Shift timestamps',
    inputLabel: 'Subtitle input',
    outputLabel: 'Shifted subtitle output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Fix subtitles that lag behind the speaker.',
      'Repair captions after editing the intro of a video.',
      'Quickly offset a whole subtitle file without opening a timeline editor.',
    ],
    faqs: [
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
    ],
    relatedTools: ['subtitle-cleaner', 'vtt-to-srt'],
    relatedGuides: [
      {
        href: '/guides/fix-out-of-sync-subtitles',
        title: 'How to fix out-of-sync subtitles',
      },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes',
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
        href: '/guides/common-subtitle-format-errors-and-fixes',
        title: 'Common subtitle format errors and fixes',
      },
      {
        href: '/guides/how-to-convert-subtitle-files-for-web-players',
        title: 'How to convert subtitle files for web players',
      },
    ],
    sampleInput: sharedSamples.srt,
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
        { href: '/guides/srt-vs-vtt', title: 'SRT vs VTT' },
        { href: '/guides/ass-vs-srt', title: 'ASS vs SRT' },
        {
          href: '/guides/fix-out-of-sync-subtitles',
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
