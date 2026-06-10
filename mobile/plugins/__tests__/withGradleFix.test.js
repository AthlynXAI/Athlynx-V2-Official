// Local sanity check for `withGradleFix.js`. Run with `node mobile/plugins/__tests__/withGradleFix.test.js`.
// Pins the exact 5 deprecated `.execute(...)` shapes emitted by Expo SDK 53 / React Native 0.76 prebuild.
const assert = require('assert');
const { fixExecuteCalls } = require('../withGradleFix');

const CANONICAL_REACT_BLOCK = `react {
    entryFile = file(["node", "-e", "require('expo/scripts/resolveAppEntry')", projectRoot, "android", "absolute"].execute(null, rootDir).text.trim())
    reactNativeDir = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()
    hermesCommand = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsolutePath() + "/sdks/hermesc/%OS-BIN%/hermesc"
    codegenDir = new File(["node", "--print", "require.resolve('@react-native/codegen/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()

    cliFile = new File(["node", "--print", "require.resolve('@expo/cli', { paths: [require.resolve('expo/package.json')] })"].execute(null, rootDir).text.trim())
}
`;

function count(s, re) { return (s.match(re) || []).length; }

const before = count(CANONICAL_REACT_BLOCK, /\.execute\(/g);
const fixed = fixExecuteCalls(CANONICAL_REACT_BLOCK);
const after = count(fixed, /\.execute\(/g);
const providersExec = count(fixed, /providers\.exec\s*\{/g);

console.log(`canonical: before=${before} after=${after} providers.exec=${providersExec}`);
assert.strictEqual(before, 5, 'expected 5 .execute() calls in canonical block');
assert.strictEqual(after, 0, '.execute() calls remain after fix');
assert.strictEqual(providersExec, 5, 'expected 5 providers.exec{ blocks after fix');

// Whitespace-drift variant: extra spaces inside the trailing call.
const DRIFTY = CANONICAL_REACT_BLOCK.replace(
  /\]\.execute\(null, rootDir\)\.text\.trim\(\)/g,
  '] . execute( null , rootDir ) . text . trim( )'
);
const driftyFixed = fixExecuteCalls(DRIFTY);
assert.strictEqual(count(driftyFixed, /\.execute\(/g), 0, 'whitespace-drifted .execute() not replaced');
assert.strictEqual(count(driftyFixed, /providers\.exec\s*\{/g), 5, 'whitespace-drifted block did not produce 5 providers.exec');
console.log('whitespace-drift variant: OK');

// If a generated build.gradle is present locally, assert against it too.
const fs = require('fs');
const path = require('path');
const generated = path.join(__dirname, '..', '..', 'android', 'app', 'build.gradle');
if (fs.existsSync(generated)) {
  const g = fs.readFileSync(generated, 'utf8');
  const gAfter = count(g, /\.execute\(/g);
  const gExec = count(g, /providers\.exec\s*\{/g);
  console.log(`generated android/app/build.gradle: .execute=${gAfter} providers.exec=${gExec}`);
  assert.strictEqual(gAfter, 0, 'generated build.gradle still contains .execute(');
  assert.ok(gExec >= 5, 'generated build.gradle should contain >=5 providers.exec blocks');
}

console.log('OK');
