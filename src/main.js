// Non usiamo connect wallet: solo il flusso video + testi, 
// e nel secondo blocco c'è l'indirizzo su una riga, e il tasto COPY su quella successiva.

let hasTypedFirstText = false;

/**
 * PRIMO BLOCCO DI TESTO
 */
const firstLines = [
  {
    align: 'center',
    segments: [{ text: 'BURN MECHANICS', color: '#fff' }]
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
      { text: ' WITH RED BACKGROUND OR SORCERER', color: '#fff' }
    ]
  },
  {
    align: 'left',
    segments: [
      { text: 'TO GET A ', color: '#fff' },
      { text: 'FREE AIRDROP', color: '#ffc700' }, 
      { text: ' OF 1X ACT II ALCHEMY ORDINALS', color: '#fff' }
    ]
  }
];

/**
 * SECONDO BLOCCO DI TESTO
 * - Riga per l'indirizzo
 * - Riga successiva (vuota, ma segnalata con "copyBtn: true") per inserire il pulsante COPY
 */
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
    copyBtn: true,
    segments: [
      // Niente testo digitato, è solo un "placeholder"
      { text: '', color: '#fff' }
    ]
  },
  {
    align: 'center',
    segments: [
      { text: "", color: '#fff' }
    ]
  },
  {
    align: 'center',
    segments: [
      { text: "YOU'LL RECEIVE THE AIRDROP TO THE SENDING WALLET", color: '#fff' }
    ]
  },
  // riga vuota
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

// Selettori dal DOM
const startBtn = document.getElementById('startBtn');
const startBackground = document.getElementById('startBackground');
const burnVideoEl = document.getElementById('burnVideo');
const burnImageEl = document.getElementById('burnImage');
const instructionsEl = document.getElementById('instructions');

startBtn.addEventListener('click', startVideoFlow);

function startVideoFlow() {
  startBtn.classList.add('hidden');
  startBackground.classList.add('hidden');
  burnVideoEl.classList.remove('hidden');

  burnVideoEl.addEventListener('ended', onVideoEnded, { once: true });
}

function onVideoEnded() {
  burnVideoEl.classList.add('hidden');
  burnImageEl.classList.remove('hidden');

  if (!hasTypedFirstText) {
    showInstructionsTypewriter(firstLines, () => {
      createBurnButton();
    });
    hasTypedFirstText = true;
  }
}

/**
 * Esegue l'effetto “typewriter” su un array di righe (lines).
 * Al termine, chiama onComplete().
 */
function showInstructionsTypewriter(lines, onComplete) {
  instructionsEl.innerHTML = '';
  instructionsEl.style.transform = 'translate(-50%, 0)';
  instructionsEl.classList.remove('hidden');

  let currentLineIndex = 0;
  const lineHeight = 60; // distanza in px tra le righe

  function nextLine() {
    if (currentLineIndex >= lines.length) {
      // Fine di tutte le righe
      if (onComplete) onComplete();
      return;
    }

    const line = lines[currentLineIndex];
    const { segments, align, copyBtn } = line;

    // Crea un div per la riga
    const lineEl = document.createElement('div');
    lineEl.className = 'instructions-line';
    lineEl.style.textAlign = align;
    lineEl.style.top = (currentLineIndex * lineHeight) + 'px';

    instructionsEl.appendChild(lineEl);

    let currentSegmentIndex = 0;

    function nextSegment() {
      if (currentSegmentIndex >= segments.length) {
        currentLineIndex++;
        // Se questa riga è "copyBtn: true", allora creiamo il pulsante COPY (sotto all'indirizzo)
        if (copyBtn) {
          createCopyButton(lineEl);
        }
        setTimeout(nextLine, 300);
        return;
      }

      const seg = segments[currentSegmentIndex];
      let charIndex = 0;
      let currentText = '';

      // Creiamo uno span dove digitare
      const spanEl = document.createElement('span');
      spanEl.style.color = seg.color || '#fff';
      lineEl.appendChild(spanEl);

      function typeChar() {
        currentText += seg.text.charAt(charIndex);
        // cursore fittizio '|'
        spanEl.textContent = currentText + '|';

        charIndex++;
        if (charIndex < seg.text.length) {
          setTimeout(typeChar, 60);
        } else {
          spanEl.textContent = currentText; // Fine del segment, rimuove cursore
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

/**
 * Crea il pulsante "BURN" al termine del primo blocco di testo
 */
function createBurnButton() {
  const burnBtn = document.createElement('button');
  burnBtn.className = 'burn-btn';
  burnBtn.textContent = 'BURN';

  const lineHeight = 60;
  // Posa il pulsante sotto l’ultima riga del primo blocco
  // (4 righe => ultima riga index 3 => (3+1)*60 + 120 = 420px, ad esempio)
  const topPos = (firstLines.length + 1) * lineHeight + 120;
  burnBtn.style.top = topPos + 'px';
  burnBtn.style.left = '50%';
  burnBtn.style.transform = 'translateX(-50%)';

  instructionsEl.appendChild(burnBtn);

  // Quando clicchiamo BURN, scompare il 1° blocco e appare il 2° blocco
  burnBtn.addEventListener('click', () => {
    instructionsEl.style.transform = 'translate(-50%, -200%)';

    setTimeout(() => {
      instructionsEl.innerHTML = '';
      instructionsEl.style.transform = 'translate(-50%, 0)';
      showInstructionsTypewriter(secondLines);
    }, 800);
  });
}

/**
 * Crea il pulsante COPY (in una riga a parte, sotto l'indirizzo)
 */
function createCopyButton(lineEl) {
  // Creiamo un container "blocco" in cui mettere il pulsante e un'eventuale label
  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.textContent = 'COPY';

  const copyLbl = document.createElement('span');
  copyLbl.className = 'copy-label';
  copyLbl.textContent = 'COPY ADDRESS';

  // Li appendiamo alla stessa riga (che è già vuota)
  // Quindi appariranno sotto all’indirizzo, perché questa "riga" si trova 
  // a lineIndex + 1 rispetto a quella dell’indirizzo
  lineEl.appendChild(copyBtn);
  lineEl.appendChild(copyLbl);

  // Logica di copia
  copyBtn.addEventListener('click', () => {
    navigator.clipboard
      .writeText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
      .then(() => {
        alert('Address copied to clipboard!');
      })
      .catch((err) => {
        alert('Error copying address: ' + err);
      });
  });
}
