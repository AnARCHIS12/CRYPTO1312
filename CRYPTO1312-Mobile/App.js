import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ScrollView, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import logo from './assets/Ajouter un titre (8).png';

const BACKEND_URL = 'https://crypto1312.onrender.com';

export default function App() {
  const [tab, setTab] = useState('send');
  const [myKey, setMyKey] = useState('');
  const [keyId, setKeyId] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [fetchId, setFetchId] = useState('');
  const [fetchedKey, setFetchedKey] = useState('');
  const [receivedKey, setReceivedKey] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [apiError, setApiError] = useState('');

  // Génération de clé aléatoire
  function generateKey(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';
    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  // Génération de phrase secrète
  function generateSecret(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let secret = '';
    for (let i = 0; i < length; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  // Envoi de la clé au backend
  async function sendKeyToBackend() {
    setApiError('');
    setKeyId('');
    let secret = encryptionKey;
    if (!secret) {
      secret = generateSecret();
      setEncryptionKey(secret);
    }
    try {
      // Chiffrement côté mobile (CryptoJS natif à ajouter si besoin)
      // Ici, on envoie la clé en clair pour la démo mobile
      const res = await fetch(`${BACKEND_URL}/api/cle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cle: myKey })
      });
      const data = await res.json();
      if (res.ok) setKeyId(data.id);
      else setApiError(data.error || 'Erreur inconnue');
    } catch {
      setApiError('Erreur de connexion au backend');
    }
  }

  // Récupération d'une clé
  async function fetchKeyFromBackend() {
    setApiError('');
    setFetchedKey('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/cle/${fetchId}`);
      const data = await res.json();
      if (res.ok) setFetchedKey(data.cle);
      else setApiError(data.error || 'Erreur inconnue');
    } catch {
      setApiError('Erreur de connexion au backend');
    }
  }

  // Générer le lien de partage
  function getShareLink() {
    if (!keyId || !encryptionKey) return '';
    return `${BACKEND_URL}/?id=${keyId}&secret=${encodeURIComponent(encryptionKey)}`;
  }

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#181818'}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={logo} style={{width:90,height:90,borderRadius:18,marginBottom:8,alignSelf:'center'}} />
        <Text style={styles.title}>CRYPTO1312</Text>
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, tab==='send' && styles.tabActive]} onPress={()=>setTab('send')}>
            <Text style={styles.tabText}>Envoyer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab==='receive' && styles.tabActive]} onPress={()=>setTab('receive')}>
            <Text style={styles.tabText}>Recevoir</Text>
          </TouchableOpacity>
        </View>
        {tab==='send' && (
          <View style={styles.section}>
            <Button title="Générer une clé" onPress={()=>setMyKey(generateKey())} />
            <TextInput
              style={styles.input}
              placeholder="Ou saisissez votre propre clé"
              value={myKey}
              onChangeText={setMyKey}
              autoCapitalize="none"
            />
            {myKey ? (
              <>
                <Text style={styles.label}>Votre clé :</Text>
                <Text selectable style={styles.keyBox}>{myKey}</Text>
                <Button title="Partager la clé" onPress={sendKeyToBackend} />
                {keyId ? (
                  <>
                    <Text style={styles.label}>ID de partage :</Text>
                    <Text selectable style={styles.keyBox}>{keyId}</Text>
                    <Button title={showQR ? 'Cacher QR code' : 'Afficher QR code'} onPress={()=>setShowQR(!showQR)} />
                    {showQR && (
                      <View style={{alignItems:'center',margin:16}}>
                        <QRCode value={getShareLink()} size={180} />
                        <Text selectable style={{color:'#fff',marginTop:8,fontSize:12}}>{getShareLink()}</Text>
                      </View>
                    )}
                  </>
                ) : null}
              </>
            ) : null}
            <Text style={styles.label}>Phrase secrète de chiffrement :</Text>
            <TextInput
              style={styles.input}
              placeholder="À partager avec le destinataire"
              value={encryptionKey}
              onChangeText={setEncryptionKey}
              autoCapitalize="none"
              secureTextEntry
            />
          </View>
        )}
        {tab==='receive' && (
          <View style={styles.section}>
            <Text style={styles.label}>Récupérer une clé par ID :</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez l'ID reçu"
              value={fetchId}
              onChangeText={setFetchId}
              autoCapitalize="none"
            />
            <Button title="Récupérer" onPress={fetchKeyFromBackend} />
            {fetchedKey ? (
              <>
                <Text style={styles.label}>Clé récupérée :</Text>
                <Text selectable style={styles.keyBox}>{fetchedKey}</Text>
                {/* Déchiffrement à ajouter si CryptoJS natif */}
              </>
            ) : null}
            <Text style={styles.label}>Phrase secrète de chiffrement :</Text>
            <TextInput
              style={styles.input}
              placeholder="À obtenir du partageur"
              value={encryptionKey}
              onChangeText={setEncryptionKey}
              autoCapitalize="none"
              secureTextEntry
            />
            <Text style={styles.label}>Clé reçue (déchiffrée) :</Text>
            <TextInput
              style={styles.input}
              placeholder="Collez ici la clé reçue"
              value={receivedKey}
              onChangeText={setReceivedKey}
              autoCapitalize="none"
            />
          </View>
        )}
        {apiError ? <Text style={{color:'red',marginTop:16}}>{apiError}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#181818',
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#222',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#222',
  },
  tabActive: {
    backgroundColor: '#c00',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  section: {
    width: '100%',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#181818',
    color: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#c00',
    padding: 10,
    marginTop: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontSize: 13,
  },
  keyBox: {
    backgroundColor: '#c00',
    color: '#fff',
    borderRadius: 6,
    padding: 10,
    marginVertical: 8,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});
