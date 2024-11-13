export const textToHtmlParagraph = (text: string): HTMLElement => {
  // Create a <p> element
  const paragraph = document.createElement('p');

  // Break the text by line breaks
  const lines = text.split('\n');

  // Add each line to the <p> with <br /> when necessary
  lines.forEach((line, index) => {
    // Add the line text
    paragraph.appendChild(document.createTextNode(line));

    // If it's not the last line, add a <br />
    if (index < lines.length - 1) {
      paragraph.appendChild(document.createElement('br'));
    }
  });

  return paragraph;
}

// Function to monitor when an element with a specific class or ID is added
export function observeElement(selector: string, callback: (element: HTMLElement) => void) {
  const targetElement = document.querySelector(selector) as HTMLElement;
  if (targetElement) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Checks if the mutation was an attribute change (class)
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const element = mutation.target as HTMLElement;
          if (element.classList.contains('showedShortcutBox')) {
            callback(element);
          }
        }
      });
    });

    observer.observe(targetElement, {
      attributes: true, // Observe changes to attributes (including classes)
      attributeFilter: ['class'] // Just look at the change in classes
    });
  }
}


export function getCaretPositionXY2(element: HTMLElement): { x: number, y: number } | null {
  let x = 0, y = 0;

  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
      const startPos = element.selectionStart ?? 0;

      // We created an invisible span inside a div to simulate the text and obtain the position of the caret
      const div = document.createElement('div');
      const span = document.createElement('span');
      const style = getComputedStyle(element);

      // We copy the styles from the input/textarea to the div
      div.style.position = 'absolute';
      div.style.whiteSpace = 'pre-wrap';
      div.style.wordWrap = 'break-word'; // To break it into multiple lines like textarea
      div.style.visibility = 'hidden';
      div.style.fontFamily = style.fontFamily;
      div.style.fontSize = style.fontSize;
      div.style.lineHeight = style.lineHeight;
      div.style.padding = style.padding;
      div.style.border = style.border;
      div.style.width = `${element.offsetWidth}px`; // The width of the div must be the same as that of the textarea/input
      div.style.height = `${element.offsetHeight}px`; // We define the height of the div
      
      // We define the text in the div up to the caret and a span to represent the position of the caret
      div.textContent = element.value.substring(0, startPos);
      span.textContent = '|'; // We use a vertical bar as a caret marker

      // adding the span to div
      div.appendChild(span);

      // adding div to body DOM
      document.body.appendChild(div);

      // getting coords from caret from SPAN
      const spanRect = span.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // We correct the coordinates based on the position of the textarea and the scroll
      x = spanRect.left - elementRect.left - element.scrollLeft;
      y = spanRect.top - elementRect.top - element.scrollTop;

      // Removing temporary div.

      document.body.removeChild(div);
  } else if (element.isContentEditable) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0).cloneRange();
          const rect = range.getClientRects()[0]; // Get the position of the caret on the screen

          if (rect) {
              x = rect.left;
              y = rect.top;
          }
      }
  }

  return { x, y };
}

