import {
    request,
    AddressPurpose
  } from 'sats-connect';
  
  async function connectWallet() {
    try {
      // Richiedi gli account dal wallet
      const accountsResponse = await request('getAccounts', {
        purposes: [
          AddressPurpose.Payment,
          AddressPurpose.Ordinals,
          AddressPurpose.Stacks,
        ],
        message: 'Questa app vuole connettersi al tuo wallet!',
      });
  
      console.log('accountsResponse', accountsResponse);
  
      if (accountsResponse.status === 'success') {
        alert('Wallet connesso con successo!');
      } else {
        alert('Connessione annullata o errore');
      }
    } catch (error) {
      console.error('Errore nella connessione:', error);
      alert('Errore durante la connessione: ' + error.message);
    }
  }
  
  document
    .getElementById('connectWalletBtn')
    .addEventListener('click', connectWallet);
  