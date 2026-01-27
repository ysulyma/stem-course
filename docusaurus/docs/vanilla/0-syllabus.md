# Syllabus

This is a course on **frontend JavaScript** for _interactive_ scientific visualization. It is aimed at anyone who needs to present graphs, code, data, equations, and so on. It is especially oriented towards education (whether in traditional classrooms or edfluencers), but is equally useful for presentations and even research.

The examples will be taken from undergraduate math and data science courses, since that is my background; but the same techniques are applicable to coding, physics, chemistry, engineering, etc. at all levels. Take a look at the [showcase](/showcase) to see examples of the amazing things you will learn to make in this course.

## Why JavaScript?

- **JavaScript is interactive.** This is the decisive reason for choosing JavaScript. Although other languages can produce static graphics or animation, no other language can come close to the level of _interactivity_ that is possible with JavaScript (except by exporting to JavaScript, or by asking the user to install additional software).  
  Even if you primarily program in other languages, JavaScript will be useful for you to share your work. If you are teaching a Python course, you can use JavaScript to make your code samples runnable in a browser; if you are doing some hardcore computation in C++, you can have a JavaScript frontend that connects to your C++ backend in order to visualize them in a browser.

- **JavaScript is ubiquitous.** Anyone with access to a computer or smartphone can access your content without needing to install additional software. (They also need an internet connection, but it's fairly easy to make JavaScript code work offline if your target audience requires it.)  
  This has a few sub-benefits:
  - Lots of JS code is available "off the shelf". This allows you to focus on creating _content_ instead of (re)inventing your own framework.

  - Despite being an interpreted language, JavaScript is _fast_. Because of its ubiquity, browser vendors have aggressively optimized JavaScript, to the point that even 3d games run smoothly in JavaScript. For extreme situations, you can use [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly) or [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API), both of which integrate seamlessly with JavaScript.

- **JavaScript is forwards-compatible.** Browsers and standards committees have an aggressive commitment to backwards-compatibility. JavaScript code written in 1995 still works today; JavaScript code written today will continue to work 50 years into the future. <small>(Exception: features occasionally get removed for security reasons, but this is very rare.)</small> Code written in other languages is often broken by major version upgrades (e.g. the Python 2 -> 3 debacle), or when proprietary technologies are decomissioned in favor of open standards (e.g. Java and Flash applets).

More cynically,

- **JavaScript is profitable.** 🤑 If you are currently an undergraduate student, graduate student, or postdoc in STEM, you will likely end up working in the tech industry sooner or later. Being good at JavaScript will be very helpful for your career.

## Organization

This course is running as part of the [Illustration as a Mathematical Research Technique](https://indico.math.cnrs.fr/event/13123/) trimester at the Institut Henri Poincaré. You can join the [Liqvid Discord](https://discord.gg/u8Qab99zHx) under the channel `#stem-course`. There is also a [GitHub repository](https://github.com/ysulyma/stem-course) containing all the examples, as well as this documentation.

The course is split into three sections.

### Vanilla web development

We will cover the fundamentals of web development from the ground up:

- the core technologies of <abbr title="HyperText Markup Language">HTML</abbr>, <abbr title="Cascading Style Sheets">CSS</abbr>, and <abbr title="JavaScript">JS</abbr> for making webpages
- how to put your content online
- 2D and 3D graphics
- animation and interactivity

Then we will cover various techniques specific to STEM visualization:

- libraries to render LaTeX equations
- plotting both parametric and implicit equations, in 2D and 3D
- libraries for drawing graphs and plots
- allowing your audience to enter their own equations/functions
- (interactive) code samples and executing Python in a browser

### Modern web development (Framework)

Many STEM practioners are already somewhat familiar with JavaScript, but find the modern landscape of web development bewildering. The second section of the course is intended to bridge this gap. Modern web development is largely driven by the needs of social networks and e-commerce sites, which is very different from the kind of web development we are doing here. Some of these advances make our lives significantly easier, but a lot of them are irrelevant.

[React](https://react.dev) and [TypeScript](https://www.typescriptlang.org)

- additional libraries that make it easy to quickly build beautiful and accessible interfaces

### Interactive videos

Finally, we will learn to make interactive videos with [Liqvid](https://liqvidjs.org).

### Not included

This is exclusively a frontend course. We will not discuss any server-side JavaScript, or interacting with servers.
