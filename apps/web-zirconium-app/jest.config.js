module.exports = {
  name: 'web-zirconium-app',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/web-zirconium-app',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
