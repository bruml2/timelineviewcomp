## DevNotes for the new TimelineView repo

### Work Plan

#### Wed Apr 8

 * TimeAxisView should work when props are undefined;

#### Sat Apr 4

 * make ErasMixin.js
 * removed prettier from eslint (again)
 * refresh self on studioapp1
 * create studio1 repo as new app

#### Wed Apr 1

 * explore echart component

#### Sat Mar 28

 * move defaults to rendering methods;
   - drawTimeAxis should be callable without all defaults;

#### Fri Mar 27

 * made new repo: timelineviewcomp
 * removed prettier from eslint:
   "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/essential",
      "eslint:recommended",
      // "@vue/prettier"

 * local to github repository:
   - create new github repo without README or gitignore
   - copy URL of new repo
   - git remote add origin <remote repository URL>
   - check remote URL: git remote -v
   - git push origin master

#### Thu Mar 26

 * check for too-close ticks

#### Fri Mar 20

3. Create ErasMixin with tests.
4. Create RangesMixin with tests (from original JS)

### ESlint

/* eslint-disable no-unused-vars */

### Jest Testing

- https://lmiller1990.github.io/vue-testing-handbook/#what-is-this-guide
- Jest watch mode (only tests for changes)
- See https://github.com/jest-community/eslint-plugin-jest
- Setting up vue project for jest: see https://vue-test-utils.vuejs.org/guides/testing-single-file-components-with-jest.html
- to use snapshot testing with Jest, you simply pass your serializable variable into expect and invoke toMatch(snapshot) on it.

### Follow-up

https://marozed.ma/vue-cheatsheet with links to documentation
Posterization with imagemagick
JS for DOM manipulation: https://htmldom.dev/
Excellent fast canvas-based line graphs, etc. https://github.com/leeoniya/uPlot

### Echarts

https://github.com/ecomfe/awesome-echarts
Echart timelines: https://echarts.apache.org/en/option.html#timeline
echart vue component: https://github.com/xlsdg/vue-echarts-v3

### Material Design UI components

 * https://github.com/matsp/material-components-vue  very simple and clear

### Syntax-Highlighted Code Blocks

 * Chris Fritz as components for VuePress for this
 * https://github.com/chrisvfritz/vuepress-enhanced-examples
 * vuepress-enhanced-examples/.vuepress/components/vue-example-simple/code-block.vue

### SVG to image conversion

 * for printing finished timelines;
 * https://sharp.pixelplumbing.com/

### For resizing timelines to container size

 * https://github.com/paulpflug/vue-mixins
 * getViewportSize, etc.
