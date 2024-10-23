export const textToHtmlParagraph = (text: string): HTMLElement => {
  // Criar um elemento <p>
  const paragraph = document.createElement('p');

  // Quebrar o texto por quebras de linha
  const lines = text.split('\n');

  // Adicionar cada linha ao <p> com <br /> quando necessário
  lines.forEach((line, index) => {
    // Adicionar o texto da linha
    paragraph.appendChild(document.createTextNode(line));

    // Se não for a última linha, adicionar um <br />
    if (index < lines.length - 1) {
      paragraph.appendChild(document.createElement('br'));
    }
  });

  return paragraph;
}

// Função para monitorar quando um elemento com uma classe ou ID específico for adicionado
export function observeElement(selector: string, callback: (element: HTMLElement) => void) {
  const targetElement = document.querySelector(selector) as HTMLElement;
  if (targetElement) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Verifica se a mutação foi uma alteração de atributo (classe)
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const element = mutation.target as HTMLElement;
          if (element.classList.contains('showedShortcutBox')) {
            callback(element);
          }
        }
      });
    });

    observer.observe(targetElement, {
      attributes: true, // Observa mudanças nos atributos (incluindo classes)
      attributeFilter: ['class'] // Observa apenas a mudança de classes
    });
  }
}

export function getCaretCoordinates(element: HTMLElement) {

  let x = 0, y = 0;
  console.log("Elemento que dispoe do cursor: ", element)

  
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
      const { selectionStart } = element;
      
      // Cria um span invisível temporário com as mesmas propriedades
      const span = document.createElement('span');
      console.log("SPAN criado: ", span)
      const style = window.getComputedStyle(element);
      console.log("COMPUTED STYLE APLICADO NO SPAN: ", span)

      span.style.font = style.font;
      span.classList.add("caretText1")
      span.style.fontSize = style.fontSize;
      span.style.visibility = 'hidden'; // invisível, mas existe no DOM
      span.style.whiteSpace = 'pre'; // preserva espaços

      // Copia o valor até a posição do caret
      span.textContent = element.value.substring(0, selectionStart as number);
      document.body.appendChild(span);

      // Pega a posição do span
      const rect = span.getBoundingClientRect();
      x = rect.left;
      y = rect.top + window.scrollY; // Corrige para rolagem da página

      document.body.removeChild(span);
  } 
  else if (element.getAttribute('contenteditable') === 'true') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0).cloneRange();
          const rects = range.getClientRects();
          if (rects.length > 0) {
              const rect = rects[0];
              x = rect.left;
              y = rect.top + window.scrollY;
          }
      }
  }

  return { x, y };
}






// Exemplo de uso para observar um elemento com a classe .minha-classe
//observeElement('.minha-classe', (element) => {
//  console.log('Elemento com a classe .minha-classe foi adicionado:', element);
//});