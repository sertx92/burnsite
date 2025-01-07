import { request, RpcErrorCode } from 'sats-connect';

async function connectAndPlayVideo() {
  try {
    // 1) Richiesta di connessione al wallet (Xverse)
    const connectResponse = await request('wallet_connect', {
      addresses: ['ordinals', 'payment', 'stacks'], // quali tipi di indirizzi vuoi
      message: 'Connettiti per avviare il video in full screen!'
    });

    console.log('connectResponse:', connectResponse);

    if (connectResponse.status === 'success') {
      // 2) Se la connessione è avvenuta, avviamo il video
      const videoEl = document.getElementById('myVideo');
      
      // Se stava nascosto, lo mostriamo
      videoEl.style.display = 'block';
      
      // Proviamo a mandarlo in full screen (se il browser lo consente)
      if (videoEl.requestFullscreen) {
        await videoEl.requestFullscreen();
      }

      // Facciamo partire la riproduzione
      await videoEl.play().catch((err) => {
        console.warn('Impossibile avviare la riproduzione automatica:', err);
      });

    } else {
      // 3) Se la connessione non è "success", può essere un errore o un rifiuto utente
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

document
  .getElementById('connectWalletBtn')
  .addEventListener('click', connectAndPlayVideo);
