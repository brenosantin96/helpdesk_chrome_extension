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

export function getCaretPositionXY(element: HTMLElement): { x: number, y: number } | null {
  let x = 0, y = 0;

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const startPos = element.selectionStart ?? 0;

      // Criamos um div invisível para simular o texto e obter a posição do caret
      const div = document.createElement('div');
      const style = getComputedStyle(element);
      
      // Copiamos os estilos do input para o div
      div.style.position = 'absolute';
      div.style.whiteSpace = 'pre-wrap';
      div.style.visibility = 'hidden';
      div.style.fontFamily = style.fontFamily;
      div.style.fontSize = style.fontSize;
      div.style.lineHeight = style.lineHeight;
      div.style.padding = style.padding;
      div.style.border = style.border;
      div.style.width = style.width;
      div.style.height = style.height;

      // Definimos o texto até o caret e adicionamos o div ao documento
      div.textContent = element.value.substring(0, startPos);
      document.body.appendChild(div);

      console.log("div.style: ",div.style);
      console.log("div.style: ",div.style.left);
      console.log("div.style: ",div.style.right);



      // Obtemos as coordenadas do caret
      const caretRect = div.getBoundingClientRect();
      console.log("caretRect: ",caretRect);
    //resultado> caretRect:  DOMRect {x: 0, y: 0, width: 721.265625, height: 900.59375, top: 0, …}

      console.log("caretRect.left: ",caretRect.left); //0
      console.log("div.style: ",caretRect.top); //0
      x = caretRect.left;
      y = caretRect.top;

      // Removemos o div temporário
      document.body.removeChild(div);
  } else if (element.isContentEditable) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0).cloneRange();
          const rect = range.getClientRects()[0]; // Pega a posição do caret na tela

          if (rect) {
              x = rect.left;
              y = rect.top;
          }
      }
  }

  return { x, y };
}

export function getCaretPositionXY2(element: HTMLElement): { x: number, y: number } | null {
  let x = 0, y = 0;

  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
      const startPos = element.selectionStart ?? 0;

      // Criamos um span invisível dentro de um div para simular o texto e obter a posição do caret
      const div = document.createElement('div');
      const span = document.createElement('span');
      const style = getComputedStyle(element);

      // Copiamos os estilos do input/textarea para o div
      div.style.position = 'absolute';
      div.style.whiteSpace = 'pre-wrap';
      div.style.wordWrap = 'break-word'; // Para que quebre em múltiplas linhas como o textarea
      div.style.visibility = 'hidden';
      div.style.fontFamily = style.fontFamily;
      div.style.fontSize = style.fontSize;
      div.style.lineHeight = style.lineHeight;
      div.style.padding = style.padding;
      div.style.border = style.border;
      div.style.width = `${element.offsetWidth}px`; // O width do div deve ser igual ao do textarea/input
      div.style.height = `${element.offsetHeight}px`; // Definimos a altura do div
      
      // Definimos o texto no div até o caret e um span para representar a posição do caret
      div.textContent = element.value.substring(0, startPos);
      span.textContent = '|'; // Usamos uma barra vertical como marcador do caret

      // Adicionamos o span ao div
      div.appendChild(span);

      // Adicionamos o div ao documento
      document.body.appendChild(div);

      // Obtemos as coordenadas do caret a partir do span
      const spanRect = span.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // Corrigimos as coordenadas com base na posição do textarea e no scroll
      x = spanRect.left - elementRect.left - element.scrollLeft;
      y = spanRect.top - elementRect.top - element.scrollTop;

      // Removemos o div temporário
      document.body.removeChild(div);
  } else if (element.isContentEditable) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0).cloneRange();
          const rect = range.getClientRects()[0]; // Pega a posição do caret na tela

          if (rect) {
              x = rect.left;
              y = rect.top;
          }
      }
  }

  return { x, y };
}







// Exemplo de uso para observar um elemento com a classe .minha-classe
//observeElement('.minha-classe', (element) => {
//  console.log('Elemento com a classe .minha-classe foi adicionado:', element);
//});