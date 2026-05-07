# Subtitle Toolkit — Promotion Plan

> 一份可执行的推广操作手册。每天打开这个文件，按清单做。
> 创建于 2026-05-07。

---

## 目录

1. [现实预期](#现实预期)
2. [本周执行表](#本周执行表)
3. [Channel 1: Tool 聚合站提交](#channel-1-tool-聚合站提交)
4. [Channel 2: Reddit 有机参与](#channel-2-reddit-有机参与)
5. [Channel 3: Hacker News Show HN](#channel-3-hacker-news-show-hn)
6. [追踪表](#追踪表)
7. [常见坑](#常见坑)
8. [下一阶段（第 2 周后）](#下一阶段第-2-周后)

---

## 现实预期

**真相：GSC 收录 ≠ 排名。**

新站（0 backlinks, 0 authority）即使被 Google 收录，长尾词通常排在 50-100 位。要进前 10 需要：

1. **外链**（最关键）— 权威域的引用 > 内容本身
2. **用户行为信号** — Google 看搜索结果中你的页面被点击和停留的概率
3. **品牌搜索** — 直接搜你品牌名的人

| 时间线 | 现实预期 |
|--------|----------|
| 1-2 周 | 长尾词（< 50 月搜索量）开始进前 50 |
| 1 个月 | 如果有 3-5 个外链，部分长尾词进前 20 |
| 2-3 个月 | 第一个进前 10 的词，日访问 50-200 UV |
| 6 个月 | 商业词开始有起色（如果坚持外链 + 内容） |

**成功标准（本周末）：**

- [ ] 至少 4 个 tool 聚合站收录（→ 4 个外链）
- [ ] 至少 5 条 Reddit 真实回复，karma > 0
- [ ] HN Show HN 发布完成（无论上不上首页）

---

## 本周执行表

| 日期 | 任务 | 时长 | 优先级 |
|------|------|------|--------|
| 周三（今天） | AlternativeTo + tinytools.directory | 30 分 | 🔥 |
| 周四 | TheresAnAIForThat + SaaSHub + 1 个 awesome list | 45 分 | 🔥 |
| 周五 | Reddit 第 1 次：搜 + 回复 1-2 条 | 20 分 | 🟡 |
| 周六 | 写 HN 文案最终稿 + Reddit 1-2 条 | 60 分 | 🟡 |
| 周日 | Reddit 1-2 条 + HN 文案最后打磨 | 30 分 | 🟡 |
| 周二 23:00 | 发 Show HN | 30 分 | 🔥 |

---

## Channel 1: Tool 聚合站提交

### 准备素材（一次做好，反复用）

复制下面这段到记事本，每个站都要用：

```
名称：Subtitle Toolkit
URL：https://subtitletoolkit.tools

Tagline (≤120 字符):
Free browser-local subtitle converter and repair tool for SRT, VTT, and ASS — files never leave your device.

Long Description:
Subtitle Toolkit is a free, privacy-first web app for converting, repairing, and cleaning subtitle files. It supports SRT, VTT (WebVTT), and ASS (Advanced SubStation) formats, with six conversion directions and dedicated tools for fixing timing drift and formatting issues.

All processing happens locally in the browser — files are never uploaded to a server. There's no signup, no account, no upload limits, and no paywall.

Use cases:
• Converting SRT subtitles to VTT for HTML5 video players
• Converting ASS subtitles to SRT for YouTube uploads
• Fixing constant-offset subtitle delay (early or late captions)
• Cleaning up subtitle formatting before delivery to clients
• Removing styling from ASS files when targeting simple players

The site also includes 28+ guides covering common subtitle workflows — format comparisons, conversion how-tos, sync fixes, and delivery patterns for platforms like YouTube, Plex, JW Player, Video.js, and Vimeo.

Built with Astro, hosted on Cloudflare Pages. Static, fast, and no backend dependencies.

Tags: subtitle, srt, vtt, webvtt, ass, caption, converter, video, free, privacy, browser-based, no-signup, html5

Categories: Video & Movies, Online Services, Developer Tools, File Conversion

Pricing: Free / Freeware
Platform: Online / Web-based
```

### 提交清单

#### a. AlternativeTo（最重要，15 分钟）

URL: <https://alternativeto.net/>

1. 注册账号 → 验证邮箱
2. 右上角 `Submit new app`
3. 填名称、URL、Tagline、Long description（用上面的素材）
4. **关键步骤**：在 "This app is an alternative to" 字段，逐个加上：
   - Subtitle Edit
   - Aegisub
   - Subtitle Workshop
   - Happy Scribe
   - Rev.com
   - Kapwing
   - Veed.io
   - 3Play Media
5. License: Freeware；Pricing: Free
6. Platform: Online / Web-based
7. 上传 logo（用 `/logo.png`）
8. 截图：浏览器打开 https://subtitletoolkit.tools → Cmd+Shift+4 截首页主视觉区（hero + 工具卡片） → 上传

提交后 1-3 天审核。

**验收：** 一周后搜 `site:alternativeto.net subtitletoolkit`，应该出现。

- [ ] 已提交 AlternativeTo
- [ ] 提交日期：______
- [ ] 通过审核日期：______

---

#### b. tinytools.directory（5 分钟）

URL: <https://tinytools.directory/>

1. 进网站底部找 `Submit a tool` 或在 GitHub repo 发 PR
2. 填表单，用上面准备的素材

- [ ] 已提交 tinytools

---

#### c. TheresAnAIForThat（10 分钟）

URL: <https://theresanaiforthat.com/>

虽然你不是 AI，但有 `Utilities` 类目。

1. 注册账号
2. Submit tool
3. Category 选 `Utilities` 或 `Video`
4. 用上面素材填写

- [ ] 已提交 TheresAnAIForThat

---

#### d. SaaSHub（10 分钟）

URL: <https://www.saashub.com/>

1. 注册
2. Submit a SaaS
3. 用上面素材

- [ ] 已提交 SaaSHub

---

#### e. GitHub awesome lists（最高质量外链）

GitHub 搜 `awesome subtitle` 或 `awesome video tools`：

- <https://github.com/search?q=awesome+subtitle&type=repositories>
- <https://github.com/search?q=awesome+video&type=repositories>

操作：

1. 找一个 star > 100 的 awesome repo
2. Fork → 在合适的 section 加一行：
   ```markdown
   - [Subtitle Toolkit](https://subtitletoolkit.tools/) - Free browser-local subtitle converter and repair tool for SRT, VTT, and ASS. No upload, no signup.
   ```
3. Commit → 发 PR
4. PR 标题：`Add Subtitle Toolkit (free browser-based subtitle converter)`
5. PR 描述：简短说明这是免费工具，符合该 list 的规则

- [ ] PR 1 提交 to: ______（repo URL）
- [ ] PR 2 提交 to: ______

---

## Channel 2: Reddit 有机参与

### ⚠️ 前置：账号合规

Reddit 对新账号 + 自我推广极敏感。如果你的账号 < 30 天 或 < 100 karma，每个 sub 的 mod 都会自动删你的帖子。

**解决方案：**

1. 用现有老账号（如有）
2. 没有的话注册新号 → **先花 3 天养号**：
   - 在 `r/AskReddit`、`r/todayilearned`、`r/mildlyinteresting` 评论 10-20 条真实评论
   - 不谈字幕、不发链接
   - 攒到 ~50 comment karma

- [ ] Reddit 账号已就位
- [ ] 账号年龄：______ 天
- [ ] 当前 karma：______

### 关键规则（违反会被永久封号）

- 🚫 **绝不自发"我做了个工具"独立帖**（除非在 r/SideProject）
- 🚫 **绝不在每条评论留链接**——比例必须 < 10%
- 🚫 **绝不开小号刷赞**——Reddit 反作弊会识别
- ✅ 只在**别人提问时**回答，链接只在真正能解决问题时放
- ✅ 链接必须是完整 `https://...` 形式，不要用 markdown 隐藏

### 每日 15 分钟流程

#### Step 1: 搜索新问题（5 分钟）

把这 5 个 URL 加入书签栏：

```
https://www.reddit.com/search/?q=convert+srt&sort=new&t=week
https://www.reddit.com/search/?q=vtt+subtitle&sort=new&t=week
https://www.reddit.com/search/?q=subtitle+out+of+sync&sort=new&t=week
https://www.reddit.com/search/?q=%22ass+to+srt%22&sort=new&t=month
https://www.reddit.com/search/?q=webvtt+html5&sort=new&t=month
```

筛选条件：
- 帖子 < 24 小时
- 提问者还没被完美解决
- 至少有 2-3 个评论（死帖跳过）

#### Step 2: 判断该 sub 能否发链接

进 subreddit → 右侧 `about` → 看 Rules。

**友好 subs（一般允许工具推荐）：**
- `r/editors`
- `r/VideoEditing`
- `r/premiere`
- `r/davinciresolve`
- `r/plex`, `r/jellyfin`
- `r/youtubers`, `r/NewTubers`
- `r/webdev`

**严格 subs（慎用，只文字回答）：**
- `r/videography`
- 大部分 `r/programming` 系列

#### Step 3: 用模板回复

> ⚠️ 实际使用前，把每条模板里的链接前面都加上 `https://`，确保 Reddit 识别为真链接。

##### 模板 A：「how to convert SRT to VTT」

```
The format is actually super close. You can do it manually:

1. Rename your `.srt` to `.vtt`
2. Add `WEBVTT` as the very first line (followed by a blank line)
3. Replace the comma in timestamps with a dot
   `00:00:01,500` → `00:00:01.500`
4. Strip the cue numbers if you want (optional, browsers ignore them)

That's it for a basic file. If you have a bunch of files or your SRT has weird character encoding, I made https://subtitletoolkit.tools/tools/srt-to-vtt that does this in the browser without uploading the file. But for one or two files the manual route works fine.
```

##### 模板 B：「subtitles out of sync」

```
Sounds like one of two cases:

**Constant offset** (every line is X seconds late or early)
→ Just shift the whole file. Most subtitle editors have this, or you can use https://subtitletoolkit.tools/tools/subtitle-time-shifter in the browser.

**Drift** (sync is fine at the start but gets worse over time)
→ This usually means the subtitle file is from a different cut of the video (different framerate, missing intro, ad-break edits). Time-shifting won't fix it; you need to re-time it or find a different subtitle file matching your video's exact cut.

Check the start, middle, and end of the video. If all three are off by the same amount, it's case 1. If the gap grows, it's case 2.
```

##### 模板 C：「what format for YouTube」

```
SRT. Always SRT for YouTube.

YouTube ignores all subtitle styling, positioning, and font info, so anything beyond timing + text gets dropped. ASS or VTT can sometimes work but they introduce parsing edge cases that SRT doesn't have.

If your source file is ASS, convert it to SRT first. I have a free converter at https://subtitletoolkit.tools/tools/ass-to-srt that runs in the browser. But honestly any subtitle editor will also do this.

Workflow I follow:
1. Edit subtitles in whatever format you prefer
2. Export/convert to SRT for upload
3. Upload via YouTube Studio → Subtitles → "Upload file → With timing"
```

##### 模板 D：「VTT not showing in HTML5 video」

```
Most common causes (in order):

1. Missing `WEBVTT` header on line 1 — file silently fails to parse, browser shows nothing.
2. Comma in timestamps instead of dot — same silent failure.
3. Cross-origin issue — `<track>` requires CORS headers if served from a different origin than the video.
4. The `<track>` tag is missing `default` attribute and the user hasn't manually enabled captions.

Easiest debug: open the .vtt URL directly in a browser tab. If it shows raw text, the file's reachable. Then validate the contents against the WEBVTT format.

If your file came from SRT, the conversion is the usual culprit. There's a step-by-step at https://subtitletoolkit.tools/guides/why-subtitles-do-not-show-in-html5-video covering each cause.
```

##### 模板 E：「recommend a free subtitle tool」

```
Depends on what you need:

- **Desktop, full editor**: Subtitle Edit (Windows) is the gold standard. Free, open source.
- **Online, no install, just convert/fix**: I made https://subtitletoolkit.tools — handles SRT/VTT/ASS conversion, timing shifts, formatting cleanup. Files stay in your browser, no upload.
- **Transcription from audio**: Whisper (OpenAI's open source model) if you're comfortable with command line, or Happy Scribe if you want a web UI (paid).

For just converting between SRT and VTT, the browser tool is enough. For real subtitle editing with timeline preview, you want Subtitle Edit.
```

#### Step 4: 记录追踪

每发一条回复，记到 [追踪表](#追踪表)。

#### 成功指标（本周末）

- [ ] 累计 5-10 条回复
- [ ] 累计 karma > 20
- [ ] 被删 < 1 条

---

## Channel 3: Hacker News Show HN

### 发布时机

**周二 / 三 / 四 美西时间 8:00-10:00 AM**
= **北京时间 周三 / 四 / 五 23:00 - 次日 01:00**

为什么：
- 周一精神疲劳，HN 用户少
- 周末流量低
- 工作日上午是 HN 用户刷咖啡时段

**目标日期：______**

### 标题（直接复制）

```
Show HN: Subtitle Toolkit – browser-local SRT/VTT/ASS converter
```

### URL field

```
https://subtitletoolkit.tools
```

### 正文（发完帖子立刻自己回复第一条评论）

```
Hi HN,

Every time I needed to convert a subtitle file, I ended up on a site that wanted me to upload the file, sign up, or watch an ad before downloading the result. For something this trivial that felt wrong, so I built Subtitle Toolkit.

Everything runs locally in the browser. The conversion logic is plain JS/TS — no WebAssembly, no backend, no upload. Files never leave your device. The whole site is static, hosted on Cloudflare Pages.

Currently it covers:
- SRT ↔ VTT ↔ ASS conversion (6 directions)
- A time-shifter for fixing constant-offset sync issues
- A formatting cleaner that strips ASS styling, HTML tags, and normalizes timestamps

The ASS parser was the hardest part — styled subtitle files are messier than the spec suggests, especially when they come out of Aegisub or fan-translated batches. I'm sure there are edge cases I haven't hit yet.

What I'd love feedback on:
- ASS edge cases that break the parser (please paste a problematic file in a comment or open an issue if you hit one)
- Formats worth adding next (TTML? SubRip variants? STL?)
- Subtitle workflows you wish were easier — there's a guides section but it's clearly biased toward what I personally needed

No tracking beyond Plausible page views. No accounts, no rate limits, genuinely free. Source code isn't public yet but I'm happy to open it if there's interest.

Thanks for taking a look.
```

### 发布后注意事项

**前 30 分钟最关键**——5-10 个 upvote 就能进 "new" tab。

- ✅ 每条评论都认真回复，**尤其是批评**——HN 观众吃这套
- ✅ 回复批评时承认弱点，不要辩解
- 🚫 **绝不**让朋友刷票（HN 反作弊会 shadow ban 你的账号）
- 🚫 不要发完就走，至少挂着 2 小时

### 现实预期

- 70% 概率：0-10 upvote，不会上首页
- 20% 概率：上 "new" 或 "show" 页，10-50 UV
- 10% 概率：上首页，500-5000 UV 一天

**即使不上首页，发这一次 = 1 个 HN 外链（DA 90），对 SEO 也很值。**

### 发布前最终检查

- [ ] HN 账号已登录
- [ ] 账号年龄 > 7 天（新账号会被限流）
- [ ] 时间是周二/三/四 23:00 北京时间
- [ ] 标题精确为 `Show HN: Subtitle Toolkit – browser-local SRT/VTT/ASS converter`
- [ ] 第一条评论已写好，准备发完帖立刻贴

---

## 追踪表

### Tool 聚合站

| 站点 | 提交日期 | 状态 | 收录后 URL |
|------|----------|------|-----------|
| AlternativeTo |  |  |  |
| tinytools.directory |  |  |  |
| TheresAnAIForThat |  |  |  |
| SaaSHub |  |  |  |
| GitHub awesome (1) |  |  |  |
| GitHub awesome (2) |  |  |  |

### Reddit 回复

| 日期 | Subreddit | 帖子 URL | 我的评论 URL | 模板 | karma | 状态 |
|------|-----------|----------|-------------|------|-------|------|
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |

### Hacker News

- 发布日期：______
- 帖子 URL：______
- 最高 upvote：______
- 上首页时长：______
- 当日带来流量（Plausible）：______ UV

---

## 常见坑

### "我没时间每天 15 分钟做 Reddit"

→ 做不到就 2-3 次/周。质量 > 数量。一条高质量回答 > 五条敷衍的。

### "我 Reddit 回复 0 赞"

→ 前 3 次大概率 0 赞，正常。坚持 2 周才有体感。**不要因此放弃**。

### "我帖子被 mod 删了"

→ 检查该 sub 的 self-promotion 规则。下次换 sub 或换策略（不放链接）。**不要开小号**——Reddit 能识别。

### "AlternativeTo 审核 1 周还没过"

→ 邮件联系他们的 support，附上提交链接。

### "HN 发完没人看"

→ 大概率事件，不要心态崩。下个月可以再发一次（要有新东西，比如 "I added TTML support"）。

### "GitHub awesome list PR 被拒"

→ 看 maintainer 的 contribution guidelines。常见原因：你的工具没有满足该 list 的最低标准（比如要求开源）。换一个 list 试。

---

## 下一阶段（第 2 周后）

完成本周计划后，下一阶段重点：

### Week 2

- [ ] Product Hunt 发布准备（gallery 图、视频、tagline）
- [ ] Stack Overflow：搜 `[webvtt]` `[srt]` tag 老问题，补充答案
- [ ] 看 GSC：哪些词出现展示但没点击？刷 title/description
- [ ] 继续 Reddit（每周 5-10 条）

### Week 3

- [ ] Product Hunt 正式发布（周二/三美西时间 6:01 AM）
- [ ] Twitter/X：搜 "subtitle" "srt" "vtt" 找抱怨的人，回复
- [ ] 找 5-10 个 YouTube/视频创作博客做 outreach（个性化邮件）

### Week 4+

- [ ] 看 GSC 数据决定下一批 guide 选题（用真实搜索词）
- [ ] 如果有外链效果，开始针对**商业词**做内容（"subtitle converter", "srt to vtt"）

---

## 心态

- **3 个月内不要看每天的访问量**——会让你焦虑放弃
- **看每周的趋势**——只要在涨，就是对的
- **一个真实回答 > 一百条群发**——Google 看用户行为，刷出来的流量没用
- **失败的尝试也是数据**——被删的帖子告诉你哪些 sub 不行
- **6 个月才是真正起量的时间点**——做好长跑准备

---

**最后更新：** 2026-05-07  
**下次复盘：** 2026-05-14（一周后）
