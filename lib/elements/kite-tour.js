'use strict';

require('./kite-logo');

const {DisposableEvent} = require('../utils');

class KiteTour extends HTMLElement {
  static initClass() {
    return document.registerElement('kite-tour', {
      prototype: this.prototype,
    });
  }

  createdCallback() {
    this.innerHTML = `
    <div class="kite-tour-gutter scrollbars-visible-always">
      <kite-logo></kite-logo>

      <h5>Kite for Python is installed and ready!</h5>

      <p>Here's how to get completions, docs, and all the other features Kite has to offer.</p>

      <div class="kite-tour-scroll-section">

        <section class="kite-tour-example">
          <figure>
            <img src="atom://kite/assets/screenshot-hover.png">
          </figure>

          <article>
            <h5>Hover for info</h5>
            <p>
              Hover on any Python identifier to <b>jump to definition</b>,
              <b>find usages</b>, <b>open in web</b>, or <b>see more</b>
            </p>
          </article>
        </section>

        <section class="kite-tour-example">
          <figure>
            <img src="atom://kite/assets/screenshot-moreinfopanel.png">
          </figure>

          <article>
            <h5>More info panel</h5>
            <p>
              Click “more” on hover to navigate APIs, docs, examples, usages, and definitions.
            </p>
          </article>
        </section>

        <section class="kite-tour-example">
          <figure>
            <img src="atom://kite/assets/screenshot-webapp.png">
          </figure>

          <article>
            <h5>Web docs</h5>
            <p>
              Browse your local code and all of Kite's knowledge base on your browser by clicking “web” on hover.
            </p>
          </article>
        </section>

        <section class="kite-tour-example">
          <figure>
            <img src="atom://kite/assets/screenshot-completions.png">
          </figure>

          <article>
            <h5>Completions and Call Signatures</h5>
            <p>
              See completions and call signatures as you write Python. Kite has more completions and docs than any other Python engine.
            </p>
          </article>
        </section>

        <section class="kite-tour-example">
          <figure>
            <img src="atom://kite/assets/screenshot-rightclick.png">
          </figure>

          <article>
            <h5>Right click</h5>
            <p>
              You can also right click on any Python identifier to access Kite's content.
            </p>
          </article>
        </section>

      </div>

      <div class="control-group">
        <div class="controls">
          <div class="checkbox">
            <label>
              <input id="kite.showKiteTourOnStatup"
                     type="checkbox"
                     class="input-checkbox"
                     ${atom.config.get('kite.showKiteTourOnStatup')
                      ? 'checked'
                      : ''}>
              <div class="setting-title">Show Kite tour on startup</div>
            </label>
          </div>
        </div>
      </div>

      <p>For more help topics, go to <a href="http://help.kite.com">help.kite.com</a></p>
      <p>We always love feedback ❤️ <a href="mailto:feedback@kite.com">feedback@kite.com</a></p>
    </div>
    `;

    this.checkbox = this.querySelector('input');
    this.subcriptions = new DisposableEvent(this.checkbox, 'change', () => {
      atom.config.set('kite.showKiteTourOnStatup', this.checkbox.checked);
    });
  }

  getTitle() {
    return 'Welcome to Kite';
  }

  getIconName() {
    return 'kite';
  }
}

module.exports = KiteTour.initClass();