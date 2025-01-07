import {
  request,
  AddressPurpose,
  RpcErrorCode
} from 'sats-connect';

async function connectWallet() {
  try {
    // 1) Per prima cosa, chiediamo il permesso di connetterci col wallet:
    const accountsResponse = await request('getAccounts', {
      purposes: [
        AddressPurpose.Payment,
        AddressPurpose.Ordinals,
        AddressPurpose.Stacks,
      ],
      message: 'Questa app vuole connettersi al tuo wallet!'
    });

    console.log('accountsResponse:', accountsResponse);

    if (accountsResponse.status !== 'success') {
      alert('Connessione annullata o errore');
      return;
    }
    alert('Wallet connesso con successo!');

    // 2) Recuperiamo gli indirizzi specifici (Ordinals, Payment, ecc.)
    const addressesResponse = await request('getAddresses', {
      purposes: ['ordinals', 'payment'],
      message: 'Recupero dei tuoi indirizzi per la firma'
    });

    console.log('addressesResponse:', addressesResponse);

    if (addressesResponse.status !== 'success') {
      alert('Errore nel recupero degli indirizzi o richiesta annullata.');
      return;
    }

    // 3) Cerchiamo un indirizzo di tipo "payment" (p2sh o p2wpkh)
    const paymentAddressItem = addressesResponse.result.find(
      (item) => item.purpose === 'payment'
    );

    if (!paymentAddressItem) {
      alert('Nessun indirizzo di tipo payment trovato.');
      return;
    }

    // 4) Facciamo firmare un messaggio con l’indirizzo payment
    const signResponse = await request('signMessage', {
      address: paymentAddressItem.address,
      message: 'Hello from SatsConnect!',
      // protocol: 'ECDSA' // facoltativo, se vuoi forzare ECDSA
      // protocol: 'BIP322' // facoltativo, se vuoi forzare BIP322
    });

    console.log('signResponse:', signResponse);

    if (signResponse.status === 'success') {
      // Firma avvenuta con successo
      alert(
        'Messaggio firmato!\n\n' +
          'Signature: ' + signResponse.signature + '\n' +
          'Message Hash: ' + signResponse.messageHash + '\n' +
          'Address: ' + signResponse.address
      );
    } else {
      // Se la firma non è "success", è un errore o rifiuto
      if (signResponse.error?.code === RpcErrorCode.USER_REJECTION) {
        alert('Richiesta di firma annullata dall’utente.');
      } else {
        alert(
          'Errore durante la firma: ' + (signResponse.error?.message || 'Sconosciuto')
        );
      }
    }
  } catch (error) {
    console.error('Errore generale:', error);
    alert('Si è verificato un errore: ' + error.message);
  }
}

// Collega la funzione al click sul pulsante
document
  .getElementById('connectWalletBtn')
  .addEventListener('click', connectWallet);
