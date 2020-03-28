## DevNotes for the new TimelineView repo

### Work Plan

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

### Testing best practices

See https://github.com/jest-community/eslint-plugin-jest

### Follow-up

Posterization with imagemagick