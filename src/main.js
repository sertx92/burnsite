import { request, RpcErrorCode } from 'sats-connect';

// Variabile per gestire il primo testo
let hasTypedFirstText = false;

/*
  PRIMA FASE (firstLines):
  - Trasformiamo ogni "riga" in un oggetto con "align" e "segments".
  - Ogni "segments" è un array di pezzi { text, color }, così possiamo colorare selettivamente.
*/

const firstLines = [
  // 1) BURN MECHANICS
  {
    align: 'center',
    segments: [
      { text: 'BURN MECHANICS', color: '#fff' }
    ]
  },

  {
    align: 'left',
    segments: [
      { text: 'BURN ', color: '#fff' },
      { text: '3x', color: '#ffc700' },        
      { text: ' COMMON KINGDOM ', color: '#ffc700' },
      { text: 'PUPPETS', color: '#ffc700' },   
      { text: ' OR', color: '#fff' }
    ]
  },

  {
    align: 'left',
    segments: [
      { text: 'BURN ', color: '#fff' },
      { text: '1x', color: '#ffc700' },         
      { text: ' RARE KINGDOM ', color: '#ffc700' },
      { text: 'PUPPETS', color: '#ffc700' },    
      { text: ' WITH RED BACKGROUND', color: '#fff' }
    ]
  },

  {
    align: 'left',
    segments: [
      { text: 'TO GET A ', color: '#fff' },
      { text: 'FREE AIRDROP', color: '#ffc700' }, 
      { text: ' OF 1X ACT II ALCHEMY ORDINALS', color: '#fff' }
    ]
  },
];


const secondLines = [
  {
    align: 'center',
    segments: [
      { text: 'BURN YOUR PUPPETS SENDING THEM TO THIS ADDRESS:', color: '#fff' }
    ]
  },
  {
    align: 'center',
    segments: [
      { text: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', color: '#ffc700' } 
    ]
  },
  {
    align: 'center',
    segments: [
      { text: '', color: '#fff' } 
    ]
  },
  {
    align: 'center',
    segments: [
      { text: "YOU'LL RECEIVE THE AIRDROP TO THE SENDING WALLET", color: '#fff' }
    ]
  },
  {
    align: 'center',
    segments: [
      { text: '', color: '#fff' } 
    ]
  },
  {
    align: 'center',
    segments: [
      { text: 'REMEMBER', color: '#ffc700' } 
    ]
  },
  {
    align: 'center',
    segments: [
      { text: "DON'T BURN ANY 1/1 OR DRAKO TRAITS", color: '#fff' }
    ]
  }
];


const connectBtn = document.getElementById('connectWalletBtn');
const burnVideoEl = document.getElementById('burnVideo');
const burnImageEl = document.getElementById('burnImage');
const instructionsEl = document.getElementById('instructions');


async function connectAndShowVideo() {
  try {
    const connectResponse = await request('wallet_connect', {
      addresses: ['ordinals', 'payment', 'stacks'],
      message: 'Connettiti al wallet per procedere!',
    });

    if (connectResponse.status === 'success') {
      // Nascondi pulsante
      connectBtn.classList.add('hidden');
      // Mostra il video
      burnVideoEl.classList.remove('hidden');

      // Quando finisce il video, mostra l'immagine e avvia il 1° testo
      burnVideoEl.addEventListener('ended', onVideoEnded, { once: true });
    } else {
      // Errore o rifiuto
      if (connectResponse.error?.code === RpcErrorCode.USER_REJECTION) {
        alert('Connessione annullata dall’utente.');
      } else {
        alert(
          'Errore durante la connessione: ' +
            (connectResponse.error?.message || 'Sconosciuto')
        );
      }
    }
  } catch (error) {
    console.error('Errore generale:', error);
    alert('Errore durante la connessione al wallet: ' + error.message);
  }
}

// ======================
//   VIDEO FINITO
// ======================
function onVideoEnded() {
  // Nascondi il video
  burnVideoEl.classList.add('hidden');
  // Mostra l'immagine finale
  burnImageEl.classList.remove('hidden');

  // Digita il primo testo (se non già fatto)
  if (!hasTypedFirstText) {
    showInstructionsTypewriter(firstLines, () => {
      // Alla fine, crea il pulsante BURN
      createBurnButton();
    });
    hasTypedFirstText = true;
  }
}

// ======================
//   TYPEWRITER
// ======================
function showInstructionsTypewriter(lines, onComplete) {
  // Puliamo e resettiamo .instructions
  instructionsEl.innerHTML = '';
  instructionsEl.style.transform = 'translate(-50%, -50%)';
  instructionsEl.classList.remove('hidden');

  let currentLineIndex = 0;

  // Avvia la digitazione della prossima riga
  function nextLine() {
    if (currentLineIndex >= lines.length) {
      // Tutte le righe digitate
      if (onComplete) onComplete();
      return;
    }

    const { segments, align } = lines[currentLineIndex];
    // Crea un div per la riga
    const lineEl = document.createElement('div');
    lineEl.className = 'instructions-line';
    lineEl.style.textAlign = align;

    // Posizioniamo la riga in base all'indice
    const lineHeight = 60; // px tra una riga e l'altra
    const topPos = currentLineIndex * lineHeight + 'px';
    lineEl.style.top = topPos;

    instructionsEl.appendChild(lineEl);

    let currentSegmentIndex = 0;


    function nextSegment() {
      if (currentSegmentIndex >= segments.length) {
        currentLineIndex++;
        setTimeout(nextLine, 300); 
        return;
      }

      const seg = segments[currentSegmentIndex];
      let charIndex = 0;
      let currentText = '';


      const spanEl = document.createElement('span');

      spanEl.style.color = seg.color || '#fff';

      lineEl.appendChild(spanEl);


      function typeChar() {
        currentText += seg.text.charAt(charIndex);

        spanEl.textContent = currentText + '|';

        charIndex++;
        if (charIndex < seg.text.length) {
          setTimeout(typeChar, 60); 
        } else {

            spanEl.textContent = currentText;

          currentSegmentIndex++;
          setTimeout(nextSegment, 100); 
        }
      }

      typeChar();
    }

    nextSegment();
  }

  nextLine();
}



function createBurnButton() {
  const burnBtn = document.createElement('button');
  burnBtn.className = 'burn-btn';
  burnBtn.textContent = 'BURN';

  const lastLineIndex = firstLines.length - 1;
  const lineHeight = 60;
  const topPos = (lastLineIndex + 1) * lineHeight + 120;
  burnBtn.style.top = topPos + 'px';
  burnBtn.style.left = '50%';
  burnBtn.style.transform = 'translateX(-50%)';

  instructionsEl.appendChild(burnBtn);

  burnBtn.addEventListener('click', () => {
    instructionsEl.style.transform = 'translate(-50%, -200%)';

    setTimeout(() => {
      instructionsEl.innerHTML = '';
      instructionsEl.style.transform = 'translate(-50%, -50%)';
      showInstructionsTypewriter(secondLines);
    }, 800);
  });
}

connectBtn.addEventListener('click', connectAndShowVideo);
