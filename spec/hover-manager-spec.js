'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const ready = require('../lib/ready.js');
const metrics = require('../lib/metrics.js');
const HoverManager = require('../lib/hover-manager');
const {hoverPath} = require('../lib/utils');
const {
  withKiteWhitelistedPaths, withRoutes, fakeResponse,
} = require('./spec-helpers');

const projectPath = path.join(__dirname, 'fixtures');

// By enabling this constant, it's possible to visually debug a test.
// It should only be used when a single test is focused as it will make every
// test last for one minute before completing.
// During that time the atom's workspace will be visible in the test. After that
// the normal test cleanup occurs and the workspace will be cleaned of all its
// content.
const VISUAL_DEBUG = false;
let jasmineContent;

fdescribe('HoverManager', () => {
  let editor;
  beforeEach(() => {
    jasmineContent = !VISUAL_DEBUG
      ? document.body.querySelector('#jasmine-content')
      : document.body;

    const styleNode = document.createElement('style');
    styleNode.textContent = !VISUAL_DEBUG
      ? ''
      : `
        atom-workspace {
          z-index: 100000;
          position: relative;
        }
      `;

    jasmineContent.appendChild(styleNode);
    jasmineContent.appendChild(atom.views.getView(atom.workspace));

    spyOn(metrics, 'track');
    jasmine.useRealClock();
    atom.config.set('kite.checkReadiness', true);
    waitsForPromise(() => atom.packages.activatePackage('language-python'));
    waitsForPromise(() => atom.workspace.open('sample.py').then(e => {
      editor = e;
    }));
  });

  afterEach(() => {
    if (VISUAL_DEBUG) {
      let done = false;
      setTimeout(() => done = true, 59500);
      waitsFor('nothing', 60000, () => done);
    }
  });

  withKiteWhitelistedPaths([projectPath], () => {
    beforeEach(() => {
      waitsForPromise(() => atom.packages.activatePackage('kite'));
      waitsForPromise(() => ready.ensure());
    });

    describe('.showHoverAtPosition()', () => {
      it('triggers a request for the editor at the given position', () => {
        HoverManager.showHoverAtPosition(editor, [3, 8]);

        expect(http.request.mostRecentCall.args[0].path)
        .toEqual(hoverPath(editor, [[3, 5], [3, 10]]));
      });

      describe('when the position match the position of a token', () => {
        withRoutes([
          [
            o => /^\/api\/buffer\/atom/.test(o.path),
            o => fakeResponse(200, fs.readFileSync('./fixtures/hello.json')),
          ],
        ]);

      });
    });
  });
});
