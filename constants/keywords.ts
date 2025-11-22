
export const HTML_TAGS = [
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'
];

export const HTML_ATTRS = [
  'accept', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'background', 'bgcolor', 'border', 'charset', 'checked', 'class', 'cols', 'colspan', 'content', 'controls', 'coords', 'data', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'enctype', 'for', 'form', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'id', 'ismap', 'kind', 'label', 'lang', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'onchange', 'onclick', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'tabindex', 'target', 'title', 'translate', 'type', 'usemap', 'value', 'width', 'wrap'
];

export const CSS_PROPS = [
  'align-content', 'align-items', 'align-self', 'all', 'animation', 'background', 'background-clip', 'background-color', 'background-image', 'background-position', 'background-repeat', 'background-size', 'border', 'border-bottom', 'border-color', 'border-radius', 'border-top', 'bottom', 'box-shadow', 'box-sizing', 'color', 'column-gap', 'cursor', 'display', 'filter', 'flex', 'flex-basis', 'flex-direction', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-wrap', 'float', 'font', 'font-family', 'font-size', 'font-weight', 'gap', 'grid', 'grid-area', 'grid-column', 'grid-gap', 'grid-row', 'grid-template-areas', 'grid-template-columns', 'grid-template-rows', 'height', 'justify-content', 'justify-items', 'justify-self', 'left', 'letter-spacing', 'line-height', 'list-style', 'margin', 'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'max-height', 'max-width', 'min-height', 'min-width', 'object-fit', 'opacity', 'order', 'outline', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'pointer-events', 'position', 'resize', 'right', 'text-align', 'text-decoration', 'text-overflow', 'text-shadow', 'text-transform', 'top', 'transform', 'transition', 'user-select', 'vertical-align', 'visibility', 'white-space', 'width', 'word-break', 'word-wrap', 'z-index'
];

export const CSS_PROP_VALUES: Record<string, string[]> = {
    'display': ['block', 'inline', 'flex', 'grid', 'inline-block', 'none', 'contents', 'inline-flex', 'inline-grid'],
    'position': ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    'flex-direction': ['row', 'column', 'row-reverse', 'column-reverse'],
    'justify-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    'align-items': ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
    'text-align': ['left', 'right', 'center', 'justify'],
    'cursor': ['default', 'pointer', 'text', 'move', 'not-allowed', 'grab', 'grabbing'],
    'color': ['red', 'blue', 'green', 'white', 'black', 'transparent', 'inherit', 'currentColor', 'aqua', 'fuchsia', 'gray', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'silver', 'teal', 'yellow'],
    'background-color': ['red', 'blue', 'green', 'white', 'black', 'transparent', 'inherit', '#'],
    'visibility': ['visible', 'hidden', 'collapse'],
    'overflow': ['visible', 'hidden', 'scroll', 'auto'],
    'box-sizing': ['content-box', 'border-box'],
    'font-weight': ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    'text-transform': ['none', 'capitalize', 'uppercase', 'lowercase'],
    'text-decoration': ['none', 'underline', 'overline', 'line-through'],
    'float': ['left', 'right', 'none'],
    'clear': ['left', 'right', 'both', 'none'],
    'white-space': ['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line', 'break-spaces'],
    'word-break': ['normal', 'break-all', 'keep-all', 'break-word'],
    'object-fit': ['fill', 'contain', 'cover', 'none', 'scale-down'],
};

export const JS_KEYWORDS = [
  'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'let', 'static', 'enum', 'implements', 'interface', 'package', 'private', 'protected', 'public', 'console', 'window', 'document', 'alert', 'prompt', 'JSON', 'Math', 'Date', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Map', 'Set', 'Promise', 'setTimeout', 'setInterval', 'addEventListener', 'getElementById', 'querySelector', 'querySelectorAll'
];

export const VOID_ELEMENTS = [
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
];
