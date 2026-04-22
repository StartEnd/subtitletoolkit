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
      'Normalize subtitle spacing and line formatting while keeping the same file format.',
    summary:
      'Use this when subtitle text is messy, spacing is inconsistent, or you want a cleaner handoff before the next editing step.',
    buttonLabel: 'Clean subtitles',
    inputLabel: 'Subtitle input',
    outputLabel: 'Cleaned subtitle output',
    placeholder: 'Paste SRT, VTT, or ASS subtitles here',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      'Normalize spacing before sending subtitle files to someone else.',
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

const zhTools: SubtitleTool[] = [
  {
    id: 'srt-to-vtt',
    title: 'SRT 转 VTT',
    shortTitle: 'SRT 转 VTT',
    description: '把 SubRip 字幕转换成适合 HTML5 视频和浏览器播放器的 WebVTT。',
    summary:
      '适合你已经有 `.srt` 文件，但要给网页视频或浏览器播放器使用 `.vtt` 的场景。',
    buttonLabel: '转换为 VTT',
    inputLabel: 'SRT 输入',
    outputLabel: 'VTT 输出',
    placeholder: '在这里粘贴 SRT 字幕',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      '给 HTML5 视频准备字幕文件。',
      '给自定义网页播放器生成可用字幕。',
      '在上传到网页工作流之前先把 SRT 转为浏览器友好的格式。',
    ],
    faqs: [
      {
        question: 'SRT 转 VTT 具体改了什么？',
        answer: '会去掉序号、加上 WEBVTT 头部，并把时间戳里的逗号改成点号。',
      },
      {
        question: '字幕文本会被改动吗？',
        answer: '不会。工具只处理格式包装，不会改字幕正文。',
      },
    ],
    relatedTools: ['vtt-to-srt', 'srt-to-ass'],
    relatedGuides: [
      { href: '/guides/srt-vs-vtt', title: 'SRT 和 VTT 有什么区别' },
      {
        href: '/guides/best-subtitle-format-for-html5-video',
        title: 'HTML5 视频最适合什么字幕格式',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'vtt-to-srt',
    title: 'VTT 转 SRT',
    shortTitle: 'VTT 转 SRT',
    description:
      '把 WebVTT 字幕转换成传统的编号 SubRip 格式，方便老播放器和剪辑工具使用。',
    summary:
      '适合网站导出的是 `.vtt`，但你的编辑器、客户或归档流程要求 `.srt` 的场景。',
    buttonLabel: '转换为 SRT',
    inputLabel: 'VTT 输入',
    outputLabel: 'SRT 输出',
    placeholder: '在这里粘贴 VTT 字幕',
    acceptedExtensions: ['.vtt', '.txt'],
    sampleFileName: 'sample.vtt',
    useCases: [
      '把网页字幕转到老式编辑器里继续处理。',
      '为线下审校或归档准备更常见的 SRT 文件。',
      '把播放器可用的 VTT 转成团队更习惯的 SRT。',
    ],
    faqs: [
      {
        question: '转换后会保留原来的顺序吗？',
        answer: '会。工具会保留 cue 顺序，并自动补上 SRT 所需的序号。',
      },
      {
        question: 'WEBVTT 头部会怎样处理？',
        answer: '会被移除，因为 SRT 不需要这个头部。',
      },
    ],
    relatedTools: ['srt-to-vtt', 'vtt-to-ass'],
    relatedGuides: [
      { href: '/guides/srt-vs-vtt', title: 'SRT 和 VTT 有什么区别' },
      {
        href: '/guides/how-to-convert-subtitle-files-for-web-players',
        title: '网页播放器字幕文件怎么转换',
      },
    ],
    sampleInput: sharedSamples.vtt,
  },
  {
    id: 'srt-to-ass',
    title: 'SRT 转 ASS',
    shortTitle: 'SRT 转 ASS',
    description: '把简单的 SubRip 字幕转换成 ASS，方便进入样式更丰富的字幕流程。',
    summary:
      '适合你的源文件是普通 SRT，但下一步需要 ASS 作为中间格式或编辑格式的场景。',
    buttonLabel: '转换为 ASS',
    inputLabel: 'SRT 输入',
    outputLabel: 'ASS 输出',
    placeholder: '在这里粘贴 SRT 字幕',
    acceptedExtensions: ['.srt', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      '把纯字幕文件导入更复杂的样式工作流。',
      '先生成一个基础 ASS 结构，再继续手动加样式。',
      '给偏向 ASS 的编辑器准备交换格式。',
    ],
    faqs: [
      {
        question: '会自动生成复杂样式吗？',
        answer: '不会。工具只会生成一个带默认样式的基础 ASS 结构，方便你继续编辑。',
      },
      {
        question: '多行字幕会保留吗？',
        answer: '会。多行会被转换成 ASS 标准的 `\\N` 换行形式。',
      },
    ],
    relatedTools: ['ass-to-srt', 'ass-to-vtt'],
    relatedGuides: [
      { href: '/guides/ass-vs-srt', title: 'ASS 和 SRT 有什么区别' },
      {
        href: '/guides/when-to-use-ass-instead-of-srt',
        title: '什么时候该用 ASS 而不是 SRT',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'ass-to-srt',
    title: 'ASS 转 SRT',
    shortTitle: 'ASS 转 SRT',
    description: '把 ASS 对话行压平为更通用的 SubRip 字幕格式。',
    summary:
      '适合你需要从 ASS 回到更简单、更容易交付的字幕文件时使用。',
    buttonLabel: '转换为 SRT',
    inputLabel: 'ASS 输入',
    outputLabel: 'SRT 输出',
    placeholder: '在这里粘贴 ASS 字幕',
    acceptedExtensions: ['.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.ass',
    useCases: [
      '把 ASS 字幕交付给只接受 SRT 的平台或客户。',
      '去掉样式信息，只保留时间轴和正文。',
      '把复杂字幕格式压平成更便于归档的格式。',
    ],
    faqs: [
      {
        question: '样式和定位信息会保留吗？',
        answer: '不会。ASS 的样式和定位会被去掉，只保留时间轴和字幕文本。',
      },
      {
        question: 'ASS 里的 `\\N` 换行会被处理吗？',
        answer: '会。它会被转换成普通的多行字幕文本。',
      },
    ],
    relatedTools: ['srt-to-ass', 'ass-to-vtt'],
    relatedGuides: [
      { href: '/guides/ass-vs-srt', title: 'ASS 和 SRT 有什么区别' },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes',
        title: '常见字幕格式错误及修复',
      },
    ],
    sampleInput: sharedSamples.ass,
  },
  {
    id: 'vtt-to-ass',
    title: 'VTT 转 ASS',
    shortTitle: 'VTT 转 ASS',
    description: '把浏览器友好的 WebVTT 转成 ASS，方便进入字幕编辑和样式流程。',
    summary:
      '适合字幕起点在网页工作流里，但下一步需要进入 ASS 样式编辑流程的场景。',
    buttonLabel: '转换为 ASS',
    inputLabel: 'VTT 输入',
    outputLabel: 'ASS 输出',
    placeholder: '在这里粘贴 VTT 字幕',
    acceptedExtensions: ['.vtt', '.txt'],
    sampleFileName: 'sample.vtt',
    useCases: [
      '把网页播放字幕转到样式更丰富的编辑流程里。',
      '为偏向 ASS 的编辑器准备输入文件。',
      '把浏览器优先的字幕文件转成样式工作流的起点。',
    ],
    faqs: [
      {
        question: 'VTT 的注释和元信息会保留吗？',
        answer: '不会。工具主要提取可见字幕 cue，忽略注释块和额外元信息。',
      },
      {
        question: '结果可以继续做样式编辑吗？',
        answer: '可以。输出会包含一个基础 ASS 结构和默认样式。',
      },
    ],
    relatedTools: ['ass-to-vtt', 'vtt-to-srt'],
    relatedGuides: [
      {
        href: '/guides/how-to-convert-subtitle-files-for-web-players',
        title: '网页播放器字幕文件怎么转换',
      },
      {
        href: '/guides/when-to-use-ass-instead-of-srt',
        title: '什么时候该用 ASS 而不是 SRT',
      },
    ],
    sampleInput: sharedSamples.vtt,
  },
  {
    id: 'ass-to-vtt',
    title: 'ASS 转 VTT',
    shortTitle: 'ASS 转 VTT',
    description: '把 ASS 字幕转换成适合浏览器和 HTML5 视频的 WebVTT。',
    summary:
      '适合源文件是 ASS，但最终要进入网页播放器或 web-native 视频组件的场景。',
    buttonLabel: '转换为 VTT',
    inputLabel: 'ASS 输入',
    outputLabel: 'VTT 输出',
    placeholder: '在这里粘贴 ASS 字幕',
    acceptedExtensions: ['.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.ass',
    useCases: [
      '把编辑器里的 ASS 字幕输出给网页播放器。',
      '去掉 ASS 样式，只保留浏览器可用字幕。',
      '把样式工作流里的字幕转成 HTML5 交付格式。',
    ],
    faqs: [
      {
        question: '样式会保留吗？',
        answer: '不会。输出保留时间轴和字幕文本，但不带 ASS 样式信息。',
      },
      {
        question: '结果适合浏览器播放器吗？',
        answer: '适合。输出是标准的 WebVTT，带正确的头部和时间戳。',
      },
    ],
    relatedTools: ['vtt-to-ass', 'srt-to-vtt'],
    relatedGuides: [
      {
        href: '/guides/best-subtitle-format-for-html5-video',
        title: 'HTML5 视频最适合什么字幕格式',
      },
      { href: '/guides/ass-vs-srt', title: 'ASS 和 SRT 有什么区别' },
    ],
    sampleInput: sharedSamples.ass,
  },
  {
    id: 'subtitle-time-shifter',
    title: '字幕时间轴平移',
    shortTitle: '时间轴平移',
    description: '对 SRT、VTT、ASS 的整份时间轴整体前移或后移。',
    summary:
      '适合字幕整体提前或整体延后，但顺序本身没有乱掉的情况。',
    buttonLabel: '平移时间轴',
    inputLabel: '字幕输入',
    outputLabel: '平移后的字幕',
    placeholder: '在这里粘贴 SRT、VTT 或 ASS 字幕',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      '修复字幕明显落后于说话内容的问题。',
      '视频前面剪掉了一段后，快速整体补偿时间轴。',
      '不打开时间线编辑器，直接把整份字幕整体偏移。',
    ],
    faqs: [
      {
        question: '可以输入负数吗？',
        answer: '可以。负数表示字幕提前，正数表示字幕延后。',
      },
      {
        question: '会保留原格式吗？',
        answer: '会。SRT 还是 SRT，VTT 还是 VTT，ASS 还是 ASS。',
      },
    ],
    relatedTools: ['subtitle-cleaner', 'vtt-to-srt'],
    relatedGuides: [
      {
        href: '/guides/fix-out-of-sync-subtitles',
        title: '字幕不同步怎么修',
      },
      {
        href: '/guides/common-subtitle-format-errors-and-fixes',
        title: '常见字幕格式错误及修复',
      },
    ],
    sampleInput: sharedSamples.srt,
  },
  {
    id: 'subtitle-cleaner',
    title: '字幕清理器',
    shortTitle: '清理器',
    description: '在保留格式的前提下，规范字幕空格和文本排版。',
    summary:
      '适合字幕文本比较乱、空格不统一，或者你想在继续处理前先做一次规范化时使用。',
    buttonLabel: '清理字幕',
    inputLabel: '字幕输入',
    outputLabel: '清理后的字幕',
    placeholder: '在这里粘贴 SRT、VTT 或 ASS 字幕',
    acceptedExtensions: ['.srt', '.vtt', '.ass', '.ssa', '.txt'],
    sampleFileName: 'sample.srt',
    useCases: [
      '在发给别人之前先统一字幕文本格式。',
      '清理导入字幕里的多余空格和不规则行。',
      '在不改变目标格式的前提下做一次基础规范化。',
    ],
    faqs: [
      {
        question: '会改时间轴吗？',
        answer: '不会。它只做文本和结构规范化，不改时间轴。',
      },
      {
        question: '输出格式会变吗？',
        answer: '不会。只要能识别格式，输出就会保持和输入一致。',
      },
    ],
    relatedTools: ['subtitle-time-shifter', 'ass-to-srt'],
    relatedGuides: [
      {
        href: '/guides/common-subtitle-format-errors-and-fixes',
        title: '常见字幕格式错误及修复',
      },
      {
        href: '/guides/how-to-convert-subtitle-files-for-web-players',
        title: '网页播放器字幕文件怎么转换',
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
  },
  zh: {
    toolsPage: {
      eyebrow: '免费字幕工具集',
      title: '给创作者和剪辑师的浏览器字幕工具',
      description:
        '直接在浏览器里转换、平移、清理和修复字幕文件，不用打开笨重的视频编辑器，也不用把文件上传到服务器。',
      whyLocalTitle: '为什么这个方向适合做第一站',
      whyLocalItems: [
        '本地处理容易讲清楚，用户也更容易信任隐私安全。',
        '字幕需求小而高频，搜索意图明确，适合做长尾页面。',
        '每个工具页都能配一篇简短 guide，避免页面变成薄工具页。',
      ],
      guideTitle: '先做用户真正会搜的 guide',
      guideDescription:
        '这些 guide 能给工具页补上下文，也能形成第一批内链主题簇。',
      guides: [
        { href: '/guides/srt-vs-vtt', title: 'SRT 和 VTT 有什么区别' },
        { href: '/guides/ass-vs-srt', title: 'ASS 和 SRT 有什么区别' },
        {
          href: '/guides/fix-out-of-sync-subtitles',
          title: '字幕不同步怎么修',
        },
      ],
    },
    pageLabels: {
      loadSample: '载入示例',
      clear: '清空',
      copyOutput: '复制结果',
      copied: '已复制',
      downloadOutput: '下载结果',
      uploadTab: '上传文件',
      pasteTab: '粘贴文本',
      uploadTitle: '拖入字幕文件，或手动选择文件',
      uploadHint: '按当前工具支持 SRT、VTT、ASS 等相关格式。',
      selectedFile: '当前文件',
      noFileSelected: '还没有选择文件',
      processingHint: '本地浏览器处理',
      shiftLabel: '整体平移毫秒数',
      shiftHelp: '正数表示字幕延后，负数表示字幕提前。',
      shiftPlaceholder: '例如 1200 或 -800',
      runLocally: '无需注册，不上传文件，不经过服务器。',
      useCasesTitle: '适合什么场景',
      faqTitle: '常见问题',
      relatedToolsTitle: '相关工具',
      relatedGuidesTitle: '相关 guide',
    },
    tools: zhTools,
  },
};

export function getSubtitleCatalog(locale: string): SubtitleCatalog {
  return catalogs[(locale as SupportedLocale) || 'en'] ?? catalogs.en;
}

export function getSubtitleTool(locale: string, id: string) {
  return getSubtitleCatalog(locale).tools.find((tool) => tool.id === id);
}

