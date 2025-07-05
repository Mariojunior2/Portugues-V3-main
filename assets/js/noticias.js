import * as pdfjsLib from '/assets/pdfjs/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.mjs';

const url = '/assets/noticias/jornal.pdf';

let pdfDoc = null,
    pageNum = 1,
    canvas = document.getElementById('pdf-render'),
    ctx = canvas.getContext('2d'),
    modalCanvas = document.getElementById('pdf-modal-render'),
    modalCtx = modalCanvas.getContext('2d'),
    modal = document.getElementById('pdf-modal'),
    flipContainer = document.getElementById('flip-container');

// Função para renderizar páginas
function renderPage(num, canvasElement, context) {
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale: 1.5 });
    canvasElement.width = viewport.width;
    canvasElement.height = viewport.height;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    page.render(renderContext);
  });
}

// Renderização normal
function renderNormalPage(num) {
  renderPage(num, canvas, ctx);
}

// Renderização no modal
function renderModalPage(num) {
  renderPage(num, modalCanvas, modalCtx);
}

// Abrir modal
document.getElementById('pdf-container').addEventListener('click', () => {
  modal.style.display = 'flex';
  renderModalPage(pageNum);
});

// Fechar modal
document.querySelector('.close').addEventListener('click', () => {
  modal.style.display = 'none';
});

// Navegação normal
document.getElementById('prev').addEventListener('click', () => {
  if (pageNum <= 1) return;
  pageNum--;
  renderNormalPage(pageNum);
});

document.getElementById('next').addEventListener('click', () => {
  if (pageNum >= pdfDoc.numPages) return;
  pageNum++;
  renderNormalPage(pageNum);
});

// Navegação no modal com animação
document.getElementById('modal-prev').addEventListener('click', () => {
  if (pageNum <= 1) return;
  
  flipContainer.classList.add('flip-animation-right');
  setTimeout(() => {
    pageNum--;
    renderModalPage(pageNum);
    flipContainer.classList.remove('flip-animation-right');
  }, 400);
});

document.getElementById('modal-next').addEventListener('click', () => {
  if (pageNum >= pdfDoc.numPages) return;
  
  flipContainer.classList.add('flip-animation-left');
  setTimeout(() => {
    pageNum++;
    renderModalPage(pageNum);
    flipContainer.classList.remove('flip-animation-left');
  }, 400);
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'flex') {
    modal.style.display = 'none';
  }
});

// Carregar PDF
pdfjsLib.getDocument(url).promise.then(pdf => {
  pdfDoc = pdf;
  renderNormalPage(pageNum);
});