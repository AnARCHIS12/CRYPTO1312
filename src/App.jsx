import { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js';
import QRCode from 'react-qr-code';
import './App.css'
import logoAnar from './assets/Ajouter un titre (8).png';

function generateKey(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

function generateSecret(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

// Permet de configurer l'URL du backend facilement (Render, local, etc.)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://crypto1312.onrender.com';

function App() {
  const [myKey, setMyKey] = useState('');
  const [receivedKey, setReceivedKey] = useState('');
  const [keyId, setKeyId] = useState('');
  const [fetchId, setFetchId] = useState('');
  const [fetchedKey, setFetchedKey] = useState('');
  const [apiError, setApiError] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [showQR, setShowQR] = useState(false);
  // Ajout d'un état pour l'onglet sélectionné
  const [tab, setTab] = useState('send');

  // Envoie la clé générée au backend
  async function sendKeyToBackend() {
    setApiError('');
    setKeyId('');
    let secret = encryptionKey;
    if (!secret) {
      secret = generateSecret();
      setEncryptionKey(secret);
    }
    try {
      const encrypted = CryptoJS.AES.encrypt(myKey, secret).toString();
      const res = await fetch(`${BACKEND_URL}/api/cle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cle: encrypted })
      });
      const data = await res.json();
      if (res.ok) setKeyId(data.id);
      else setApiError(data.error || 'Erreur inconnue');
    } catch {
      setApiError('Erreur de connexion au backend');
    }
  }

  // Récupère une clé depuis le backend
  async function fetchKeyFromBackend(idParam) {
    setApiError('');
    setFetchedKey('');
    const idToFetch = idParam || fetchId;
    try {
      const res = await fetch(`${BACKEND_URL}/api/cle/${idToFetch}`);
      const data = await res.json();
      if (res.ok) setFetchedKey(data.cle);
      else setApiError(data.error || 'Erreur inconnue');
    } catch {
      setApiError('Erreur de connexion au backend');
    }
  }

  // Récupération automatique de la clé si un id est présent dans l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get('id');
    const urlSecret = params.get('secret');
    if (urlId) {
      setFetchId(urlId);
      fetchKeyFromBackend(urlId);
      setTab('receive'); // Bascule automatiquement sur l'onglet Recevoir
    }
    if (urlSecret) {
      setEncryptionKey(urlSecret);
    }
    // eslint-disable-next-line
  }, []);

  // Génère et copie le lien de partage
  function getShareLink() {
    if (!keyId || !encryptionKey) return '';
    return `${window.location.origin}/?id=${keyId}&secret=${encodeURIComponent(encryptionKey)}`;
  }
  function copyShareLink() {
    const url = getShareLink();
    if (!url) return;
    navigator.clipboard.writeText(url);
    alert('Lien de partage copié !');
  }

  // Déchiffre la clé récupérée
  function tryDecryptFetchedKey() {
    try {
      const bytes = CryptoJS.AES.decrypt(fetchedKey, encryptionKey);
      const original = bytes.toString(CryptoJS.enc.Utf8);
      if (!original) throw new Error();
      setReceivedKey(original);
      setApiError('');
    } catch {
      setApiError('Erreur de déchiffrement : clé ou phrase incorrecte');
    }
  }

  return (
    <div className="container" style={{maxWidth:'100vw',width:'100%',margin:'0 auto',padding:'1rem',boxSizing:'border-box'}}>
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',margin:'0 auto 1.2rem',width:'100%'}}>
        <div style={{
          background:'linear-gradient(135deg,#fff 0%,#e33 100%)',
          borderRadius:'18px',
          boxShadow:'0 6px 24px #e33a, 0 2px 8px #0005',
          padding:'0.6em',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          width:'min(90px,28vw)',
          height:'min(90px,28vw)',
          overflow:'hidden'
        }}>
          <img src={logoAnar} alt="Logo anarcho-syndicaliste" style={{
            width:'100%',
            height:'100%',
            objectFit:'cover',
            borderRadius:'12px',
            display:'block',
            background:'#fff',
            boxShadow:'0 1px 8px #e33a',
            border:'none',
            filter:'drop-shadow(0 0 8px #e33a)'
          }} />
        </div>
      </div>
      <h1 style={{fontSize:'clamp(1.1em,4vw,1.3em)',textAlign:'center',marginBottom:'1.2rem',lineHeight:1.2,wordBreak:'break-word'}}>CRYPTO1312 – Échange de clés (mots de passe)</h1>
      {/* Onglets */}
      <div style={{display:'flex',justifyContent:'center',gap:8,marginBottom:'1.2rem'}}>
        <button onClick={()=>setTab('send')} style={{flex:1,padding:'0.7em',fontWeight:tab==='send'?'bold':'normal',background:tab==='send'?'#e33':'#222',color:'#fff',borderRadius:8,border:'none',boxShadow:tab==='send'?'0 2px 8px #e33a':'none'}}>Envoyer</button>
        <button onClick={()=>setTab('receive')} style={{flex:1,padding:'0.7em',fontWeight:tab==='receive'?'bold':'normal',background:tab==='receive'?'#e33':'#222',color:'#fff',borderRadius:8,border:'none',boxShadow:tab==='receive'?'0 2px 8px #e33a':'none'}}>Recevoir</button>
      </div>
      {/* Contenu selon l'onglet */}
      {tab==='send' && (
        <div className="section" style={{marginBottom:'1.2rem',padding:'0.7em',background:'#181818',borderRadius:12,boxShadow:'0 1px 6px #0003',marginLeft:'auto',marginRight:'auto',maxWidth:480}}>
          <button style={{width:'100%',padding:'0.7em',fontSize:'1em',marginBottom:'0.7em'}} onClick={() => setMyKey(generateKey())}>
            Générer une clé (mot de passe)
          </button>
          <div style={{display:'flex',gap:8,marginBottom:'0.7em'}}>
            <input
              type="text"
              value={myKey}
              onChange={e => setMyKey(e.target.value)}
              placeholder="Ou saisissez votre propre clé"
              style={{flex:1,minWidth:0,padding:'0.5em',fontSize:'1em',borderRadius:8,border:'1px solid #444',background:'#222',color:'#fff'}}
            />
          </div>
          {myKey && (
            <div className="key-display" style={{marginTop:'0.5em'}}>
              <strong>Votre clé :</strong>
              <div className="key-box" style={{wordBreak:'break-all',fontSize:'1.1em',padding:'0.5em',margin:'0.5em 0',background:'#222',borderRadius:8}}>{myKey}</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                <button style={{flex:1,minWidth:0}} onClick={() => navigator.clipboard.writeText(myKey)}>
                  Copier la clé
                </button>
                <button style={{flex:1,minWidth:0}} onClick={sendKeyToBackend}>
                  Partager la clé
                </button>
              </div>
              {keyId && (
                <div style={{marginTop:'0.7em'}}>
                  <span>ID de partage : </span>
                  <span className="key-box" style={{fontSize:'0.95em',padding:'0.3em 0.6em',wordBreak:'break-all',display:'block',maxWidth:'100%',background:'#222',borderRadius:8}}>{keyId}</span>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:'0.5em',flexDirection:'column'}}>
                    <button style={{width:'100%'}} onClick={() => navigator.clipboard.writeText(keyId)}>
                      Copier l'ID
                    </button>
                    <button style={{width:'100%'}} onClick={copyShareLink}>
                      Générer un lien de partage
                    </button>
                    <button style={{width:'100%'}} onClick={() => setShowQR(!showQR)}>
                      {showQR ? 'Cacher QR code' : 'Afficher QR code'}
                    </button>
                  </div>
                  {showQR && (
                    <div style={{marginTop:'1rem',display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
                      <div style={{width:'100%',maxWidth:220}}>
                        <QRCode value={getShareLink()} size={180} style={{width:'100%',height:'auto',maxWidth:'100%'}} />
                      </div>
                      <div style={{fontSize:'0.9em',marginTop:'0.5rem',textAlign:'center'}}>Scannez pour ouvrir le lien</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="section" style={{marginTop:'1.2rem'}}>
            <label htmlFor="encryptionKey">Phrase secrète de chiffrement :</label>
            <input
              id="encryptionKey"
              type="password"
              value={encryptionKey}
              onChange={e => setEncryptionKey(e.target.value)}
              placeholder="À partager avec le destinataire"
              style={{width:'100%',padding:'0.5em',marginTop:4,fontSize:'1em',borderRadius:8,border:'1px solid #444'}}
            />
          </div>
        </div>
      )}
      {tab==='receive' && (
        <div className="section" style={{marginBottom:'1.2rem',padding:'0.7em',background:'#181818',borderRadius:12,boxShadow:'0 1px 6px #0003',marginLeft:'auto',marginRight:'auto',maxWidth:480}}>
          <label htmlFor="fetchId">Récupérer une clé par ID :</label>
          <div style={{display:'flex',gap:8,marginTop:4,flexDirection:'row',flexWrap:'wrap'}}>
            <input
              id="fetchId"
              type="text"
              value={fetchId}
              onChange={e => setFetchId(e.target.value)}
              placeholder="Entrez l'ID reçu"
              style={{flex:1,minWidth:0,padding:'0.5em',fontSize:'1em',borderRadius:8,border:'1px solid #444'}}
            />
            <button style={{flex:'none',padding:'0.5em 1em',fontSize:'1em'}} onClick={fetchKeyFromBackend}>
              Récupérer
            </button>
          </div>
          <div style={{marginTop:'0.5em',fontSize:'0.95em',color:'#aaa'}}>
            Ce lien peut être utilisé jusqu'à <b>50 fois</b> maximum.<br />
            Après 50 utilisations, la clé ne sera plus disponible.
          </div>
          {fetchedKey && (
            <div className="key-display" style={{marginTop:'1em'}}>
              <strong>Clé récupérée (chiffrée) :</strong>
              <div className="key-box" style={{wordBreak:'break-all',fontSize:'1.1em',padding:'0.5em',margin:'0.5em 0',background:'#222',borderRadius:8}}>{fetchedKey}</div>
              <button style={{width:'100%',marginTop:8}} onClick={tryDecryptFetchedKey}>
                Déchiffrer avec la phrase secrète
              </button>
              <button style={{width:'100%',marginTop:8}} onClick={()=>fetchKeyFromBackend()}>
                Rafraîchir la clé
              </button>
            </div>
          )}
          <div className="section" style={{marginTop:'1.2rem'}}>
            <label htmlFor="encryptionKey">Phrase secrète de chiffrement :</label>
            <input
              id="encryptionKey"
              type="password"
              value={encryptionKey}
              onChange={e => setEncryptionKey(e.target.value)}
              placeholder="À obtenir du partageur"
              style={{width:'100%',padding:'0.5em',marginTop:4,fontSize:'1em',borderRadius:8,border:'1px solid #444'}}
            />
          </div>
          <div className="section" style={{marginTop:'1.2rem'}}>
            <label htmlFor="received">Clé reçue (déchiffrée) :</label>
            <input
              id="received"
              type="text"
              value={receivedKey}
              onChange={e => setReceivedKey(e.target.value)}
              placeholder="Collez ici la clé reçue"
              style={{width:'100%',padding:'0.5em',marginTop:4,fontSize:'1em',borderRadius:8,border:'1px solid #444'}}
            />
          </div>
        </div>
      )}
      {apiError && <div style={{color:'red',marginTop:'1em',textAlign:'center'}}>{apiError}</div>}
    </div>
  )
}

export default App
