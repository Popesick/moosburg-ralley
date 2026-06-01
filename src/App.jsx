import React, { useState, useEffect } from 'react';

// 1. STATIONSDATEN
const STATIONS = [
  {
    id: 1,
    name: "Wärterbaracken (Mittelschule)",
    code: "baracke123",
    description: "Hier trifft eine der größten Mittelschulen in Bayern auf die Überreste des größten Kriegsgefangenenlager innerhalb des Deutschen Reiches im zweiten Weltkrieg.",
    riddle: "Macht ein Gruppenfoto und ladet es als Nachweis, dass ihr den Ort erreicht habt auf den Server hoch",
    findImage: "/hint_waechterbaracke.png",
  },
  {
    id: 2,
    name: "Die Grieserie",
    code: "grieserie456",
    description: "Das älteste erhaltene Haus der Stadt, heute ein Treffpunkt als soziale Begegnungsstätte mit offenem Betrieb, 2025 mit dem Oberbayerischen Denkmalpreis ausgezeichnet.",
    riddle: "Macht ein Gruppenfoto und ladet es als Nachweis, dass ihr den Ort erreicht habt auf den Server hoch",
    findImage: "/hint_griesserie.png",
  },
  {
    id: 3,
    name: "Barbaras Bücherstube",
    code: "mariensaeule789",
    description: "Seit über 45 Jahren ein fester Bestandteil von Moosburg – ein Ort der Geschichten, Begegnungen und Inspiration. Hier findet Ihr nicht nur Bücher – hier findet Ihr einen Ort, der Menschen verbindet.",
    riddle: "Macht ein Gruppenfoto und ladet es als Nachweis, dass ihr den Ort erreicht habt auf den Server hoch",
    findImage: "/hint_mariensaeule.png",
  },
  {
    id: 4,
    name: "The Cornerhouse (Ziel)",
    code: "cornerhouse999",
    description: "Hier gibt es Burger, Guiness und irische Gemütlichkeit mitten im oberbayrischen Moosburg. Daneben gibt es dort das beste regelmäßig stattfindende Pub Quiz Moosburgs. Ideal um zum Ende der Rallye noch ein erfrischendes Kaltgetränk zu sich zu nehmen.",
    riddle: "Macht ein Gruppenfoto und ladet es als Nachweis, dass ihr den Ort erreicht habt auf den Server hoch",
    findImage: "/hint_cornerhouse.png",
  }
];

export default function App() {
  const [teamName, setTeamName] = useState('');
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // LOGIK: LADEN & RESET
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === 'boss') {
      localStorage.removeItem('quiz_team_name');
      localStorage.removeItem('quiz_team_progress');
      window.location.href = window.location.pathname;
      return;
    }

    const savedTeam = localStorage.getItem('quiz_team_name');
    const savedProgress = localStorage.getItem('quiz_team_progress');
    
    if (savedTeam) {
      setTeamName(savedTeam);
      setIsRegistered(true);
    }
    
    let currentIndex = 0;
    if (savedProgress) {
      currentIndex = parseInt(savedProgress, 10);
      setCurrentStationIndex(currentIndex);
    }

    const scannedCode = urlParams.get('code');
    if (scannedCode && savedTeam) {
      handleScannedCode(scannedCode, currentIndex);
    }
  }, []);

  const handleScannedCode = (code, currentIndex) => {
    if (currentIndex >= STATIONS.length) return;
    const expectedStation = STATIONS[currentIndex];
    
    if (expectedStation && code === expectedStation.code) {
      const nextIndex = currentIndex + 1;
      setCurrentStationIndex(nextIndex);
      localStorage.setItem('quiz_team_progress', nextIndex);
      setErrorMessage('');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setErrorMessage('Falscher Code oder falsche Reihenfolge! Schummelt nicht! 😉');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!teamName.trim() || !isConsentChecked) return;
    localStorage.setItem('quiz_team_name', teamName.trim());
    localStorage.setItem('quiz_team_progress', '0');
    setIsRegistered(true);
  };

  const handlePhotoUpload = async (e, stationId) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      setUploadedPhotos({ ...uploadedPhotos, [stationId]: reader.result });
      setIsUploading(true);
      try {
        await fetch("https://moosburg-ralley-api.andreas-stetter73.workers.dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ team: teamName, station: stationId, image: reader.result })
        });
      } catch (error) {
        setErrorMessage('Upload-Fehler! Prüfe deine Verbindung.');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- UI RENDERING ---

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Moosburger Stadtrallye 2026</h1>

      {!isRegistered ? (
        /* STARTSEITE */
        <div style={styles.card}>
          <p style={styles.text}>
            Willkommen bei der ersten Moosburger Stadtrallye. Um mitzumachen registriert euch mit eurem Teamnamen (keine E-Mail-Adresse und kein Login erforderlich) und legt los. 
            Entschlüsselt die Hinweise, findet die versteckten QR-Codes oder NFC-Tags und erreicht das Ziel. 
            Um eueren Fortschritt zu dokumentieren, ladet an jedem Ort ein Gruppenbild von euch hoch.
          </p>
          
          <div style={styles.dateBox}>
            <p style={{margin: '8px 0'}}><strong>Start:</strong> xx.xx.xxxx</p>
            <p style={{margin: '8px 0'}}><strong>Ende:</strong> xx.xx.xxxx</p>
            <p style={{margin: '8px 0', color: '#0070f3'}}><strong>Siegerehrung:</strong> 21.07.2026</p>
          </div>

          <form onSubmit={handleRegister}>
            <input 
              type="text" 
              placeholder="Euer Teamname" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              style={styles.input}
              required
            />
            <div style={styles.consentWrapper}>
              <input 
                type="checkbox" 
                id="consent" 
                checked={isConsentChecked}
                onChange={(e) => setIsConsentChecked(e.target.checked)}
                required
              />
              <label htmlFor="consent" style={styles.consentLabel}>
                Ich stimme zu, dass meine hochgeladenen Bilder vom Veranstalter für Werbe- und Promotionszwecke im Zusammenhang mit der Stadtrallye veröffentlicht werden dürfen. Mehr in der <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>.
              </label>
            </div>
            <button 
              type="submit" 
              style={{...styles.button, opacity: isConsentChecked ? 1 : 0.5}}
              disabled={!isConsentChecked}
            >
              Ralley starten
            </button>
          </form>
        </div>
      ) : currentStationIndex >= STATIONS.length ? (
        /* FINALE */
        <div style={styles.card}>
          <h2 style={{textAlign: 'center', marginTop: '0'}}>🎉 FINALE! 🎉</h2>
          <p style={styles.text}>{STATIONS[3].description}</p>
          <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '20px 0'}} />
          <p style={{...styles.text, textAlign: 'center', fontWeight: 'bold', fontSize: '18px', color: '#0070f3'}}>
            Bravo, Team <strong>{teamName}</strong>!<br />Ziel erreicht.
          </p>
        </div>
      ) : (
        /* LAUFENDE RALLYE */
        <>
          <div style={styles.header}>
            <span>Team: <strong>{teamName}</strong></span>
            <span>Station {currentStationIndex} / {STATIONS.length}</span>
          </div>
          {errorMessage && <div style={styles.error}>{errorMessage}</div>}
          <div style={styles.card}>
            <h2 style={{marginTop: '0'}}>📍 Eure Mission</h2>
            {currentStationIndex === 0 ? (
              <div style={styles.nextStepBox}>
                <h4 style={{marginTop: '0', color: '#0070f3'}}>🔍 Wegbeschreibung zum Startpunkt:</h4>
                <p style={styles.text}>{STATIONS[0].description}</p>
                <img src="/hint_waechterbaracke.png" alt="Start" style={styles.hintImage} />
              </div>
            ) : (
              <div>
                <p style={styles.text}><strong>Standort:</strong> {STATIONS[currentStationIndex-1].name}</p>
                <p style={styles.text}>{STATIONS[currentStationIndex-1].description}</p>
                <div style={styles.riddleBox}>
                  <h4 style={{marginTop: '0'}}>🧩 Eure Aufgabe:</h4>
                  <p style={{fontSize: '14px', margin: 0}}>{STATIONS[currentStationIndex-1].riddle}</p>
                </div>
                <div style={styles.uploadSection}>
                  <h4 style={{marginTop: '0'}}>📸 Fotobeweis</h4>
                  <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, STATIONS[currentStationIndex-1].id)} disabled={isUploading} />
                  {uploadedPhotos[STATIONS[currentStationIndex-1].id] && <img src={uploadedPhotos[STATIONS[currentStationIndex-1].id]} alt="Beweis" style={styles.previewImage} />}
                </div>
                <div style={styles.nextStepBox}>
                  <h4 style={{marginTop: '0', color: '#0070f3'}}>🔍 Nächste Station:</h4>
                  <p style={styles.text}>{STATIONS[currentStationIndex].description}</p>
                  <img src={STATIONS[currentStationIndex].findImage} alt="Hinweis" style={styles.hintImage} />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* VERGRÖSSERTES PARTNER LOGO UNTEN RECHTS */}
      <div style={styles.partnerLogoWrapper}>
        <span style={styles.partnerLabel}>powered by Cornerhouse</span>
        <img src="/logo_ch.png" alt="Partner" style={styles.partnerLogo} />
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px 20px 140px 20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', position: 'relative' },
  title: { textAlign: 'center', color: '#333', fontSize: '28px', marginTop: '0', marginBottom: '25px', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' },
  text: { lineHeight: '1.6', color: '#444', fontSize: '15px' },
  dateBox: { backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '5px', marginBottom: '25px', fontSize: '15px', textAlign: 'center' },
  input: { width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' },
  consentWrapper: { display: 'flex', gap: '12px', marginBottom: '25px', alignItems: 'flex-start' },
  consentLabel: { fontSize: '12px', color: '#666', lineHeight: '1.4' },
  button: { width: '100%', padding: '15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#333', color: '#fff', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' },
  error: { backgroundColor: '#ffe0e0', color: '#cc0000', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '14px' },
  riddleBox: { backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '5px', marginTop: '10px' },
  uploadSection: { marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' },
  previewImage: { width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '5px', marginTop: '10px' },
  nextStepBox: { marginTop: '25px', backgroundColor: '#eef6ff', padding: '15px', borderRadius: '5px', borderTop: '3px solid #0070f3' },
  hintImage: { width: '100%', borderRadius: '8px', marginTop: '10px', border: '1px solid #ccc' },
  partnerLogoWrapper: { position: 'fixed', bottom: '20px', right: '20px', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', padding: '10px 20px', borderRadius: '30px', boxShadow: '0 3px 10px rgba(0,0,0,0.15)', zIndex: 100 },
  partnerLabel: { fontSize: '16px', color: '#333', marginRight: '12px', fontWeight: 'bold' },
  partnerLogo: { maxHeight: '60px', maxWidth: '150px' }
};
