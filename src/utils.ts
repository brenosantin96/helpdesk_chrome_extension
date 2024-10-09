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