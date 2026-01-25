# Syllabus

This is a course on **frontend JavaScript** for _interactive_ scientific visualization. It is aimed at anyone who needs to present graphs, code, data, equations, and so on. It is especially oriented towards education (whether in traditional classrooms or edfluencers), but is equally useful for presentations and even research.

The examples will be taken from undergraduate math and data science courses, since that is my background.

## Why JavaScript?

- JavaScript is **interactive**. This is the decisive reason for choosing JavaScript. Although other languages can produce static graphics or animation, no other language can come close to the level of _interactivity_ that is possible with JavaScript (except by exporting to JavaScript, or by asking the user to install additional software).  
  Even if you primarily program in other languages, JavaScript will be useful for you to share your work. If you are teaching a Python course, you can use JavaScript to make your code samples runnable in a browser; if you are doing some hardcore computation in C++, you can have a JavaScript frontend that connects to your C++ backend in order to visualize them in a browser.

- JavaScript is **ubiquitous**.
  - Lots of JS code is available "off the shelf". This allows you to focus on creating _content_ instead of (re)inventing your own framework.

  - Despite being an interpreted language, JavaScript is _fast_. Because of its ubiquity, browser vendors have aggressively optimized JavaScript, to the point that even 3d games run smoothly in JavaScript. For extreme situations, you can use [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly) or [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API), both of which integrate seamlessly with JavaScript.

- JavaScript is forwards-compatible. Standards committees have an aggressive commitment to backwards-compatibility. JavaScript code written in 1995 still works today; JavaScript code written today will continue to work 50 years into the future. <small>(Exception: on rare occasions, features get removed for security reasons.)</small> Code written in other languages is often broken by major version upgrades (e.g. the Python 2 -> 3 debacle), or when proprietary technologies are decomissioned in favor of open standards (e.g. Java and Flash applets).

## Organization

- **Vanilla web development**
- **Framework**
- **Interactive videos**
