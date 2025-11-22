
// Adapted from textarea-caret-position (MIT License)
// We need this to mirror the textarea's properties into a hidden div
// to calculate exactly where the cursor is in pixels.

const properties = [
  'direction',
  'boxSizing',
  'width',
  'height',
  'overflowX',
  'overflowY',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',
  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',
  'letterSpacing',
  'wordSpacing',
  'tabSize',
  'MozTabSize',
] as const;

export interface Coordinates {
  top: number;
  left: number;
  height: number;
}

export function getCaretCoordinates(element: HTMLTextAreaElement, position: number): Coordinates {
  const isFirefox = (window as any).mozInnerScreenX != null;

  // Mirror div creation
  const div = document.createElement('div');
  div.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  const style = div.style;
  const computed = window.getComputedStyle(element);

  // CRITICAL: The editor uses 'whitespace-pre', so the mirror must too.
  style.whiteSpace = 'pre'; 
  if (element.nodeName !== 'INPUT')
    style.wordWrap = 'normal'; // Corresponds to whitespace-pre

  // Position off-screen
  style.position = 'absolute';
  style.visibility = 'hidden';

  // Transfer properties to mirror
  properties.forEach(prop => {
    style[prop as any] = computed[prop as any];
  });

  if (isFirefox) {
    if (element.scrollHeight > parseInt(computed.height))
      style.overflowY = 'scroll';
  } else {
    style.overflow = 'hidden'; 
  }

  div.textContent = element.value.substring(0, position);
  
  // The second part of the text is a span to measure cursor position
  const span = document.createElement('span');
  span.textContent = element.value.substring(position) || '.';
  div.appendChild(span);

  const coordinates = {
    top: span.offsetTop + parseInt(computed.borderTopWidth),
    left: span.offsetLeft + parseInt(computed.borderLeftWidth),
    height: parseInt(computed.lineHeight)
  };

  document.body.removeChild(div);

  return coordinates;
}
