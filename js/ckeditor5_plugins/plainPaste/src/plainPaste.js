import { Plugin } from 'ckeditor5/src/core';
import sanitizeHtml from 'sanitize-html';

export default class PlainPaste extends Plugin {

  static get requires() {
    return [];
  }

  /**
   * @inheritdoc
   */
  static get pluginName() {
    return 'PlainPaste';
  }

  /**
   * @inheritdoc
   */
  init() {
    const editor = this.editor;

    const editingView = editor.editing.view;

    editingView.document.on('clipboardInput', (evt, data) => {
      const dataTransfer = data.dataTransfer;
      const cleanHtml = sanitizeHtml(dataTransfer.getData('text/html'), {
        allowedTags: [
          'p',
          'a',
          'h2',
          'h3',
          'h4',
          'h5',
          'ul',
          'ol',
          'li',
          'table',
          'thead',
          'tbody',
          'th',
          'tr',
          'td',
          'b',
          'i',
          'strong',
          'em',
          'dl',
          'blockquote',
          'code',
        ],
        allowedAttributes: { a: ['href'] },
      });
      data.content = this.editor.data.htmlProcessor.toView(cleanHtml);
    });
  }

}
