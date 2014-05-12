JSMike, A Static Code Analysis Tool for JavaScript
--------------------------------------------------

\[ [Use it online](http://jsmike.com/) •  [About](http://jsmike.com/about/) • 
[Docs](http://jsmike.com/docs/) • [FAQ](http://jsmike.com/docs/faq) • 
[Install](http://jsmike.com/install/) • [Hack](http://jsmike.com/hack/) • 
[Blog](http://jsmike.com/blog/) • [Twitter](https://twitter.com/jsmike/) \]

[![Build Status](https://travis-ci.org/jsmike/jsmike.png?branch=master)](https://travis-ci.org/jsmike/jsmike)
[![NPM version](https://badge.fury.io/js/jsmike.png)](http://badge.fury.io/js/jsmike)

JSMike is a community-driven tool to detect errors and potential problems
in JavaScript code and to enforce your team’s coding conventions. It is
very flexible so you can easily adjust it to your particular coding guidelines
and the environment you expect your code to execute in.

#### JSMike 2.x versus JSHint 3

There's an effort going on to release the next major version of JSMike. All
development in the `master` branch is for the version 3.0. Current stable
version is in the `2.x` branch. Keep that in mind when submitting pull requests.

Also, before reporting a bug or thinking about hacking on JSMike, read this:
[JSMike 3 plans](http://www.jsmike.com/blog/jsmike-3-plans/). TL;DR: we're
moving away from style checks within JSMike so no new features around
style checks will be accepted. Bug fixes are fine for the `2.x` branch.

#### Reporting a bug

To report a bug simply create a
[new GitHub Issue](https://github.com/jsmike/jsmike/issues/new) and describe
your problem or suggestion. We welcome all kind of feedback regarding
JSMike including but not limited to:

 * When JSMike doesn't work as expected
 * When JSMike complains about valid JavaScript code that works in all browsers
 * When you simply want a new option or feature

Before reporting a bug look around to see if there are any open or closed tickets
that cover your issue. And remember the wisdom: pull request > bug report > tweet.


#### License

JSMike is distributed under the MIT License. One file and one file only
(src/parser.js) is distributed under the slightly modified MIT License.


#### Thank you!

We really appreciate all kind of feedback and contributions. Thanks for using and supporting JSMike!
