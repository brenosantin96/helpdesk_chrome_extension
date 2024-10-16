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
  console.log("targetElement", targetElement);
  if (targetElement) {
    console.log("targetElement", targetElement);
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




// Exemplo de uso para observar um elemento com a classe .minha-classe
//observeElement('.minha-classe', (element) => {
//  console.log('Elemento com a classe .minha-classe foi adicionado:', element);
//});