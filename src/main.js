import { request, RpcErrorCode } from 'sats-connect';

// 1) Imposta la durata della GIF in millisecondi
const GIF_DURATION = 2000; // 5 secondi

// 2) Righe da mostrare con l'effetto typewriter
const instructionsLines = [
  'BURN 1 -> GET 1',
  'BURN 2 -> GET 2',
  'BURN 3 -> GET 3',
];

// 3) Riferimenti ai vari elementi del DOM
const connectBtn = document.getElementById('connectWalletBtn');
const gifEl = document.getElementById('myGif');
const finalFrameEl = document.getElementById('finalFrame');
const instructionsEl = document.getElementById('instructions');

// 4) Funzione principale richiamata al click su "Connect Wallet"
async function connectAndShowGif() {
  try {
    // Richiesta di connessione al wallet (Xverse)
    const connectResponse = await request('wallet_connect', {
      addresses: ['ordinals', 'payment', 'stacks'],
      message: 'Connettiti al wallet per procedere!',
    });

    if (connectResponse.status === 'success') {
      // Nascondiamo il pulsante
      connectBtn.classList.add('hidden');

      // Mostriamo la GIF
      gifEl.classList.remove('hidden');

      // Allo scadere dei 5 secondi, consideriamo la GIF “finita”
      setTimeout(() => {
        // Nascondiamo la GIF
        gifEl.classList.add('hidden');

        // Mostriamo l’immagine finale (fermo immagine)
        finalFrameEl.classList.remove('hidden');

        // Avviamo l'effetto typewriter con le istruzioni
        showInstructionsTypewriter(instructionsLines);
      }, GIF_DURATION);
    } else {
      // Se non "success", potrebbe essere un rifiuto o un errore
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

// 5) Effetto macchina da scrivere per le istruzioni finali
function showInstructionsTypewriter(lines) {
  // Mostriamo il contenitore delle istruzioni
  instructionsEl.classList.remove('hidden');

  let currentLineIndex = 0;

  function typeLine() {
    if (currentLineIndex >= lines.length) {
      return; // Nessuna riga rimasta
    }

    const line = lines[currentLineIndex];
    let charIndex = 0;
    let currentText = '';
    const speed = 50; // millisecondi per carattere

    function typeChar() {
      // Aggiungiamo il carattere successivo
      currentText += line[charIndex];
      // Rimuoviamo un eventuale cursore "|" vecchio
      instructionsEl.textContent = instructionsEl.textContent.replace(/\|\s*$/, '');
      // Aggiungiamo il testo + il cursore
      instructionsEl.textContent = instructionsEl.textContent + currentText + '|';

      charIndex++;
      if (charIndex < line.length) {
        // Non abbiamo ancora finito la riga
        setTimeout(typeChar, speed);
      } else {
        // Fine riga
        instructionsEl.textContent = instructionsEl.textContent.replace(/\|\s*$/, '');
        instructionsEl.textContent += '\n';
        currentLineIndex++;
        // Aspettiamo 500ms e passiamo alla prossima riga
        setTimeout(typeLine, 500);
      }
    }

    // Iniziamo a digitare la prima riga
    typeChar();
  }

  // Avviamo la stampa della riga corrente
  typeLine();
}

// 6) Colleghiamo l'evento click al pulsante
connectBtn.addEventListener('click', connectAndShowGif);
