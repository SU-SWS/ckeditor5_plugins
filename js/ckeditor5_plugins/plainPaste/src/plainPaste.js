import { Plugin } from 'ckeditor5/src/core';

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

    const allowedTags = [
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
    ];
    const tagRegex = new RegExp('</?(?!(?:' + allowedTags.join('|') + ')\\b)[a-z](?:[^>"\']|"[^"]*"|\'[^\']*\')*>', 'g');

    editingView.document.on('clipboardInput', (evt, data) => {
      const dataTransfer = data.dataTransfer;
      const html = dataTransfer.getData('text/html');
      // Replace new lines to a single line string.
      const cleanHtml = html.replace(/(?:\r\n|\r|\n)/g, ' ')
        // Replace extra spaces.1
        .replace(/ +/g, ' ')
        // Remove space between tags.
        .replace(/> </g, '><')
        // Remove all tags we don't want to paste in.
        .replace(tagRegex, '')
        // Remove the most common attributes from the tags above.
        .replace(/ style="[^\"]*"/g, '')
        .replace(/ id="[^\"]*"/g, '')
        .replace(/ class="[^\"]*"/g, '')
        .replace(/ data-([a-z\-]+)="[^\"]*"/g, '');
      data.content = this.editor.data.htmlProcessor.toView(cleanHtml);
    });
  }

}
