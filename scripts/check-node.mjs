/**
 * Runs before dev and build. The Tailwind toolchain needs Node 22.12+ (it requires
 * ES modules), and an older Node fails with an obscure "require() of ES Module" error
 * on globals.css. Fail early with a message that says what to do instead.
 */
const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 22 || (major === 22 && minor < 12)) {
  console.error(
    `\nNadjektiv needs Node 22.12 or later; this shell is using ${process.versions.node}.\n` +
      'Run `nvm use` (the version is in .nvmrc), or open a new terminal tab, then try again.\n',
  );
  process.exit(1);
}
