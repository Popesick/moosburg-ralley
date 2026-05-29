import React, { useState, useEffect } from 'react';

// 1. NEUE STRUKTUR: Jede Station enthält den Hinweis (Text + Bild), wie man SIE findet!
const STATIONS = [
  {
    id: 1,
    name: "Wärterbaracken (Mittelschule)",
    code: "baracke123",
    description: "Hier trifft eine der größten Mittelschulen in Bayern auf die Überreste des größten Kriegsgefangenenlager innerhalb des Deutschen Reiches im zweiten Weltkrieg.",
    riddle: "Sucht den ersten Code bei den Überresten der Geschichte.",
    findText: "Hier begann die Geschichte des Stalag VIIa. Suche die Infotafel. Welche Jahreszahl sticht ins Auge? Subtrahiere 1900, um den Hinweis für das Suchbild zu entschlüsseln.",
    findImage: "/hint_waechterbaracke.png", // Bild für den Start
  },
  {
    id: 2,
    name: "Die Grieserie",
    code: "grieserie456",
    description: "Das älteste erhaltene Haus der Stadt, heute ein Treffpunkt als soziale Begegnungsstätte mit offenem Betrieb, 2025 mit dem Oberbayerischen Denkmalpreis ausgezeichnet.",
    riddle: "Zählt die Sprossen am großen Fenster für den nächsten Hinweis.",
    findText: "Ein uriges Gebäude im Gries mit einem markanten Schild...",
    findImage: "/hint_griesserie.png",
  },
  {
    id: 3,
    name: "Barbaras Bücherstube",
    code: "mariensaeule789",
    description: "Seit über 45 Jahren ein fester Bestandteil von Moosburg – ein Ort der Geschichten, Begegnungen und Inspiration. Hier findet Ihr nicht nur Bücher – hier findet Ihr einen Ort, der Menschen verbindet.",
    riddle: "Taucht ein in die Welt der Bücher und findet den nächsten Code.",
    findText: "Eine goldene Dame, die in den Himmel ragt...",
    findImage: "/hint_mariensaeule.png",
  },
  {
    id: 4,
    name: "The Cornerhouse (Ziel)",
    code: "cornerhouse999",
    description: "Hier gibt es Burger, Guiness und irische Gemütlichkeit mitten im oberbayrischen Moosburg. Daneben gibt es dort das beste regelmäßig stattfindende Pub Quiz Moosburgs. Ideal um zum Ende der Rallye noch ein erfrischendes Kaltgetränk zu sich zu nehmen.",
    riddle: "Geschafft! Meldet euch an der Theke für euer wohlverdientes Kaltgetränk.",
    findText: "Das spirituelle Herz der Stadt mit mächtigem Turm...",
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

  // 2. LOGIK: LADEN & GEHEIMER RESET (?reset=boss)
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
    if (savedProgress) {
      setCurrentStationIndex(parseInt(savedProgress, 10));
    }

    const scannedCode = urlParams.get('code');
    if (scannedCode && savedTeam) {
      handleScannedCode(scannedCode, parseInt(savedProgress, 10) || 0);
    }
  }, []);

  const handleScannedCode = (code, currentIndex) => {
    const expectedStation = STATIONS[currentIndex];
    if (expectedStation && code === expectedStation.code) {
      const nextIndex = currentIndex + 1;
      if (nextIndex <= STATIONS.length) {
        setCurrentStationIndex(nextIndex);
        localStorage.setItem('quiz_team_progress', nextIndex);
        setErrorMessage('');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
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
    
    const urlParams = new URLSearchParams(window.location.search);
    const scannedCode = urlParams.get('code');
    if (scannedCode) handleScannedCode(scannedCode, 0);
  };

  const handlePhotoUpload = async (e, stationId) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const updatedPhotos = { ...uploadedPhotos, [stationId]: reader.result };
      setUploadedPhotos(updatedPhotos);

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

  // SCREEN A: REGISTRIERUNG
  if (!isRegistered) {
    return (
      <div style={styles.container}>
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
           <img src="/logo.png" alt="Powered by" style={{maxHeight: '80px', maxWidth: '100%'}} />
        </div>
        <h1 style={styles.title}>Moosburger Stadtrallye</h1>
        <div style={styles.card}>
          <p style={styles.text}>
            Willkommen bei der ersten Moosburger Stadtrallye. Um mitzumachen registriert euch mit eurem Teamnamen (keine E-Mail-Adresse und kein Login erforderlich) und legt los. 
            Entschlüsselt die Hinweise, findet die versteckten QR-Codes oder NFC-Tags und erreicht das Ziel. 
            Um eueren Fortschritt zu dokumentieren, ladet an jedem Ort ein Gruppenbild von euch hoch.
          </p>
          
          <form onSubmit={handleRegister}>
            <input 
              type="text" 
              placeholder="Euer Teamname" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              style={styles.input}
              required
            />

            <div style={{display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'flex-start'}}>
              <input 
                type="checkbox" 
                id="consent" 
                checked={isConsentChecked}
                onChange={(e) => setIsConsentChecked(e.target.checked)}
                style={{marginTop: '5px'}}
                required
              />
              <label htmlFor="consent" style={{fontSize: '12px', color: '#666', lineHeight: '1.4'}}>
                Ich stimme zu, dass meine hochgeladenen Bilder vom Veranstalter und dessen Partnern für Werbe- und Promotionszwecke im Zusammenhang mit der Stadtrallye verwendet und veröffentlicht werden dürfen. Weitere Informationen finden sich in der <a href="/privacy.html" target="_blank" rel="noopener noreferrer" style={{color: '#0070f3', textDecoration: 'underline'}}>Datenschutzerklärung</a>.
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
      </div>
    );
  }

  const isRalleyFinished = currentStationIndex >= STATIONS.length;
  const nextStationToFind = STATIONS[currentStationIndex]; // Die Station, die aktuell GESUCHT wird
  const lastFoundStation = STATIONS[currentStationIndex - 1]; // Die Station, an der man GERADE STEHT

  // SCREEN B: FINALE ERREICHT (Am Cornerhouse gescannt)
  if (isRalleyFinished) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Moosburger Stadtrallye</h1>
        <div style={styles.card}>
          <h2 style={{textAlign: 'center', marginTop: '0'}}>🎉 FINALE! 🎉</h2>
          <p style={styles.text}>{STATIONS[3].description}</p>
          <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '20px 0'}} />
          <p style={{...styles.text, textAlign: 'center', fontWeight: 'bold', fontSize: '16px', color: '#0070f3'}}>
            Bravo, Team <strong>{teamName}</strong>!<br />Ihr habt alle Stationen gemeistert und das Ziel erreicht.
          </p>
        </div>
      </div>
    );
  }

  // SCREEN C: DAS RUNTERLAUFENDE SPIEL
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Moosburger Stadtrallye</h1>
      <div style={styles.header}>
        <span>Team: <strong>{teamName}</strong></span>
        <span>Station {currentStationIndex} / {STATIONS.length}</span>
      </div>

      {errorMessage && <div style={styles.error}>{errorMessage}</div>}

      <div style={styles.card}>
        <h2 style={{marginTop: '0'}}>📍 Eure aktuelle Mission</h2>
        
        {currentStationIndex === 0 ? (
          /* ZUSTAND 1: Frisch registriert, sucht Station 1 */
          <div>
            <div style={{backgroundColor: '#eef6ff', padding: '15px', borderRadius: '5px'}}>
              <h4 style={{marginTop: '0', color: '#0070f3'}}>🔍 Wegbeschreibung zum Startpunkt:</h4>
              <p style={styles.text}>{nextStationToFind.findText}</p>
              {nextStationToFind.findImage && <img src={nextStationToFind.findImage} alt="Wegweiser" style={styles.hintImage} />}
              <p style={{fontSize: '12px', color: '#555', fontStyle: 'italic', marginBottom: '0', marginTop: '10px'}}>Sucht dort nach dem ersten Code, um das Spiel zu aktivieren!</p>
            </div>
          </div>
        ) : (
          /* ZUSTAND 2: Hat mindestens eine Station gescannt */
          <div>
            <p style={{fontSize: '16px', color: '#222', marginBottom: '5px'}}><strong>Aktueller Standort:</strong> {lastFoundStation.name}</p>
            <p style={styles.text}>{lastFoundStation.description}</p>
            
            <div style={styles.riddleBox}>
              <h4 style={{marginTop: '0'}}>🧩 Eure Aufgabe vor Ort:</h4>
              <p style={{marginBottom: '0', fontSize: '14px'}}>{lastFoundStation.riddle}</p>
            </div>

            {/* Fotobeweis für den aktuellen Ort */}
            <div style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px'}}>
              <h4 style={{marginTop: '0'}}>📸 Fotobeweis hochladen</h4>
              <p style={{fontSize: '12px', color: '#666', marginTop: '-10px'}}>Macht ein Foto von eurem Team vor Ort, um die Station zu verifizieren.</p>
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload(e, lastFoundStation.id)} disabled={isUploading} />
              {isUploading && <p style={{color: '#0070f3', fontSize: '14px', fontWeight: 'bold'}}>Bild wird hochgeladen... ⏳</p>}
              {uploadedPhotos[lastFoundStation.id] && !isUploading && <img src={uploadedPhotos[lastFoundStation.id]} alt="Beweis" style={styles.previewImage} />}
            </div>

            {/* Der Hinweis auf die NÄCHSTE Station (liegt logischerweise in den find-Daten der gesuchten Station) */}
            <div style={{marginTop: '25px', backgroundColor: '#eef6ff', padding: '15px', borderRadius: '5px', borderTop: '3px solid #0070f3'}}>
              <h4 style={{marginTop: '0', color: '#0070f3'}}>🔍 Wegbeschreibung zur NÄCHSTEN Station:</h4>
              <p style={styles.text}>{nextStationToFind.findText}</p>
              {nextStationToFind.findImage && <img src={nextStationToFind.findImage} alt="Hinweis nächster Ort" style={styles.hintImage} />}
              <p style={{fontSize: '12px', color: '#555', fontStyle: 'italic', marginBottom: '0', marginTop: '10px'}}>Sucht dort nach dem nächsten Sticker!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' },
  title: { textAlign: 'center', color: '#333', fontSize: '26px', marginTop: '0', marginBottom: '20px', lineHeight: '1.2' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#333', color: '#fff', borderRadius: '5px', marginBottom: '20px', fontSize: '14px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' },
  text: { lineHeight: '1.5', color: '#444', fontSize: '14px' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  error: { backgroundColor: '#ffe0e0', color: '#cc0000', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' },
  riddleBox: { backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '5px', marginTop: '15px' },
  previewImage: { width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px', marginTop: '10px' },
  hintImage: { width: '100%', borderRadius: '8px', marginTop: '10px', marginBottom: '5px', border: '1px solid #ccc' } 
};
