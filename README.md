# @sync-labs/eslint-config

A TypeScript ESLint ruleset designed for large teams and projects.

## Philosophy

When you work in a small repo, you spend most of your time writing code.  You know what each file does.  You want lint
rules that keep things concise and won't slow you down.  That's the situation for the 99% of open source projects
that shape popular coding conventions.

But as your organization scales up, things may change.  People come and go.  Projects frequently get handed off between
teams.  Every day, you find yourself working with files that you've never seen before, created by strangers whom
you may never meet.  It's annoying to constantly come across inconsistent styles.  It can be frustrating to decipher
expressions that seem to require a TypeScript Ph.D. -- especially for newcomers and junior contributors.  When
refactoring in bulk, you may edit lots of files without reading them very carefully.  In short, the linting needs
reflect different priorities:

**Small scale:** We can assume developers are _familiar_ with the project.  We want code to be _easy to write_.

**Large scale:** Developers are generally _unfamiliar_ with projects.  Code must be _easy to read_.  If not,
there's a risk of fragmentation, duplication of efforts, and costly rewrites.  (Enabling people to churn out
lots of code really fast is still a goal of course; just not the #1 priority.)

Welcome to the world of [Rush Stack](https://rushstack.io/)!  The `@sync-labs/eslint-config` package was specifically
designed around the the requirements of large teams and projects.


## Implementation

- **Monorepo friendly:** The `@sync-labs/eslint-config` package has direct dependencies on all the ESLint plugins
  that it needs.  This avoids encumbering each consuming project with the obligation to satisfy a peer dependencies.
  It also ensures that the installed plugin versions were tested for compatibility together.

- **Battle tested:**  The `@sync-labs/eslint-config` rules have been vetted on large production monorepos, across
  a broad set of projects, teams, and requirements.  These rules embody a way of working that scales.  Quite
  a lot of discussion and evolution went into them.

- **Designed for Prettier:** The `@sync-labs/eslint-config` ruleset is designed to be used together with
  the [Prettier](https://prettier.io/) code formatter.  This separation of workflows avoids hassling developers with
  lint "errors" for frivolous issues like spaces and commas.  Instead, those issues get fixed automatically whenever
  you save or commit a file.  Prettier also avoids frivolous debates: its defaults have already been debated
  at length and adopted by a sizeable community.  No need to reinvent the wheel!

- **Explicit:**  The ruleset does not import any "recommended" templates from other ESLint packages.  This avoids
  worrying about precedence issues due to import order.  It also eliminates confusion caused by files
  overriding/undoing settings from another file.  Each rule is configured once, in one
  [easy-to-read file](https://github.com/microsoft/rushstack/blob/master/stack/eslint-config/profile/_common.js).

- **Minimal configuration:**  To use this ruleset, your **.eslintrc.js** will need to choose one **"profile"**
  and possibly one or two **"mixins"** that cover special cases.  Beyond that, our goal is to reduce monorepo
  maintenance by providing a small set of **.eslintrc.js** recipes that can be reused across many different projects.
  (This sometimes means that rules will be included which have no effect for a particular project, however in practice
  the installation/execution cost for unused rules turns out to be negligible.)


## Getting started in 3 steps

Applying the ruleset to your project is quick and easy. You install the package, then create an **.eslintrc.js** file
and select an appropriate project profile.  Optionally you can also add some "mixins" to enable additional rules.
Let's walk through those three steps in more detail.

### 1. Install the package

To install the package, do this:

```sh
$ cd your-project-folder
$ npm install --save-dev eslint
$ npm install --save-dev typescript
$ npm install --save-dev @sync-labs/eslint-config
```

### 2. Choose one profile

The ruleset currently supports three different "profile" strings, which select lint rules applicable for
your project:

- `@sync-labs/eslint-config/profile/node` - This profile enables lint rules intended for a general Node.js project,
  typically a web service.  It enables security rules that assume the service could receive malicious inputs from an
  untrusted user.

- `@sync-labs/eslint-config/profile/node-trusted-tool` - This profile enables lint rules intended for a Node.js project
  whose inputs will always come from a developer or other trusted source.  Most build system tasks are like this,
  since they operate exclusively on files prepared by a developer.  This profile disables certain security rules that
  would otherwise prohibit APIs that could cause a denial-of-service by consuming too many resources, or which might
  interact with the filesystem in unsafe ways.  Such activities are safe and commonplace for a trusted tool.
  **DO NOT use this profile for a library project that might also be loaded by a Node.js service.**

- `@sync-labs/eslint-config/profile/web-app` - This profile enables lint rules intended for a web application, for
  example security rules that are relevant to web browser APIs such as DOM.
  _Also use this profile if you are creating a library that can be consumed by both Node.js and web applications._

After choosing a profile, create an **.eslintrc.js** config file that provides the NodeJS `__dirname` context
for TypeScript. Add your profile string in the `extends` field, as shown below:

**.eslintrc.js**
```ts
// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@sync-labs/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [ "@sync-labs/eslint-config/profile/node" ],  // <---- put your profile string here
  parserOptions: { tsconfigRootDir: __dirname }
};
```

The `@sync-labs/eslint-config` ruleset is intended to be used with the Prettier code formatter.  For general
instructions on setting that up, please refer to the [Prettier docs](https://prettier.io/docs/en/index.html).
For Rush-specific settings, see the article
[Rush: Enabling Prettier](https://rushjs.io/pages/maintainer/enabling_prettier/).


### 3. Add any relevant mixins

Optionally, you can add some "mixins" to your `extends` array to opt-in to some extra behaviors.

Important: Your **.eslintrc.js** `"extends"` field must load mixins after the profile entry.


#### `@sync-labs/eslint-config/mixins/react`

For projects using the [React](https://reactjs.org/) library, the `"@sync-labs/eslint-config/mixins/react"` mixin
enables some recommended additional rules.  These rules are selected via a mixin because they require you to:

- Add `"jsx": "react"` to your **tsconfig.json**
- Configure your `settings.react.version` as shown below.  This determines which React APIs will be considered
  to be deprecated.  (If you omit this, the React version will be detected automatically by
  [loading the entire React library](https://github.com/yannickcr/eslint-plugin-react/blob/4da74518bd78f11c9c6875a159ffbae7d26be693/lib/util/version.js#L23)
  into the linter's process, which is costly.)

Add the mixin to your `"extends"` field like this:

**.eslintrc.js**
```ts
// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@sync-labs/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    "@sync-labs/eslint-config/profile/web-app",
    "@sync-labs/eslint-config/mixins/react" // <----
  ],
  parserOptions: { tsconfigRootDir: __dirname },

  settings: {
    react: {
      "version": "16.9" // <----
    }
  }
};
```

#### `@sync-labs/eslint-config/mixins/tsdoc`

If your project is using [API Extractor](https://api-extractor.com/) or another tool that uses
the [TSDoc](https://github.com/Microsoft/tsdoc) standard for doc comments, it's recommended to use the
`"@sync-labs/eslint-config/mixins/tsdoc"` mixin.  It will enable
[eslint-plugin-tsdoc](https://www.npmjs.com/package/eslint-plugin-tsdoc) validation for TypeScript doc comments.

Add the mixin to your `"extends"` field like this:

**.eslintrc.js**
```ts
// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@sync-labs/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    "@sync-labs/eslint-config/profile/node",
    "@sync-labs/eslint-config/profile/mixins/tsdoc" // <----
  ],
  parserOptions: { tsconfigRootDir: __dirname }
};
```


## Learn more

This package was forked from Microsoft's Rush Stack project and adapted to Sync Labs guidelines.