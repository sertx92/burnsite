import {
    request,
    AddressPurpose,
    RpcErrorCode,
  } from 'sats-connect';
  
  async function connectAndSign() {
    try {
      // 1) Richiedi gli indirizzi dal wallet
      const addressesResponse = await request('getAddresses', {
        // Indichiamo i types di address che vogliamo richiedere
        purposes: ['ordinals', 'payment', 'stacks'],
        message: 'Questa app vuole accedere ai tuoi indirizzi per firmare un messaggio',
      });
  
      console.log('addressesResponse', addressesResponse);
  
      if (addressesResponse.status !== 'success') {
        alert('Richiesta di indirizzi rifiutata o errore generico.');
        return;
      }
  
      // 2) Prendiamo l’array di indirizzi
      const allAddresses = addressesResponse.result; // array di { address, publicKey, purpose, ... }
  
      // Ad esempio, cerchiamo un payment address
      const paymentAddressItem = allAddresses.find(
        (item) => item.purpose === 'payment'
      );
  
      if (!paymentAddressItem) {
        alert('Nessun indirizzo di tipo "payment" trovato.');
        return;
      }
  
      // 3) Ora firmiamo un messaggio col payment address
      const signResponse = await request('signMessage', {
        address: paymentAddressItem.address,
        message: 'Hello from SatsConnect!',
      });
  
      console.log('signResponse', signResponse);
  
      if (signResponse.status === 'success') {
        // Firma avvenuta con successo
        alert(
          'Messaggio firmato!\n\n' +
            `Signature: ${signResponse.signature}\n` +
            `Message Hash: ${signResponse.messageHash}\n` +
            `Address: ${signResponse.address}`
        );
      } else {
        // Se non è "success", può essere un errore o rifiuto
        if (signResponse.error?.code === RpcErrorCode.USER_REJECTION) {
          alert('Richiesta di firma annullata dall’utente.');
        } else {
          alert(
            `Errore nella firma: ${signResponse.error?.message || 'Sconosciuto'}`
          );
        }
      }
    } catch (err) {
      console.error('Errore generale:', err);
      alert('Si è verificato un errore: ' + err.message);
    }
  }
  
  // Attacchiamo la funzione al click del pulsante
  document
    .getElementById('connectWalletBtn')
    .addEventListener('click', connectAndSign);
  