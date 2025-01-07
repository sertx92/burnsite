import { request, AddressPurpose, RpcErrorCode } from 'sats-connect';

async function connectWalletAndSign() {
  try {
    // Richiedi la connessione al wallet con gli indirizzi desiderati
    const connectResponse = await request('wallet_connect', {
      addresses: ['payment', 'ordinals'],
      message: 'Questa app vuole connettersi al tuo wallet!'
    });

    if (connectResponse.status === 'success') {
      console.log('Risposta wallet_connect:', connectResponse);

      // Estrai gli indirizzi richiesti
      const paymentAddress = connectResponse.addresses.find(
        (address) => address.purpose === AddressPurpose.Payment
      );
      const ordinalsAddress = connectResponse.addresses.find(
        (address) => address.purpose === AddressPurpose.Ordinals
      );

      if (paymentAddress) {
        console.log('Indirizzo di pagamento:', paymentAddress.address);
      }
      if (ordinalsAddress) {
        console.log('Indirizzo ordinals:', ordinalsAddress.address);
      }

      // Firma un messaggio con l'indirizzo di pagamento (esempio)
      const messageToSign = 'Questo è un messaggio di test da firmare.';
      const signResponse = await request('signMessage', {
        address: paymentAddress.address, // Usa l'indirizzo di pagamento
        message: messageToSign
      });

      if (signResponse.status === 'success') {
        console.log('Firma completata con successo:', signResponse);
        alert('Messaggio firmato con successo!');
      } else {
        if (signResponse.error.code === RpcErrorCode.USER_REJECTION) {
          alert('Firma annullata dall'utente.');
        } else {
          alert('Errore nella firma del messaggio: ' + signResponse.error.message);
        }
      }
    } else {
      if (connectResponse.error.code === RpcErrorCode.USER_REJECTION) {
        alert('Connessione annullata dall'utente.');
      } else {
        alert('Errore nella connessione: ' + connectResponse.error.message);
      }
    }
  } catch (error) {
    console.error('Errore durante il processo:', error);
    alert('Errore durante il processo: ' + error.message);
  }
}

document
  .getElementById('connectWalletBtn')
  .addEventListener('click', connectWalletAndSign);
