import React, { useState, useEffect } from 'react';

// 1. STATIONSDATEN (Station 1 mit neuen Texten, der Rest als Dummys für den Ablauf)
const STATIONS = [
  {
    id: 1,
    name: "Wächter Baracken Mittelschule",
    code: "baracke123",
    question: "Hier trifft eine der größten Mittelschulen in Bayern auf die Überreste des größten Kriegsgefangenenlager innerhalb des Deutschen Reiches im zweiten Weltkrieg.",
    infoText: "<strong>Ehemalige Baracken der Wachmannschaften:</strong><br/>Die Kaserne der Wachmannschaft befand sich etwa 500 m vom Gefangenenlager entfernt. Die Gebäude dienten nach dem Krieg als Wohngebäude für sozial Bedürftige. Drei dieser Baracken sind noch erhalten und stehen unter Denkmalschutz. Die weitere Nutzung oder der Abriss stehen noch in Diskussion. Ein Teil ist für ein zukünftiges Info- und Dokumentationszentrum vorgesehen. Mehr Informationen unter <a href='https://stalag-moosburg.de/' target='_blank' rel='noopener noreferrer' style='color:#0070f3;'>https://stalag-moosburg.de/</a>"
  },
  {
    id: 2,
    name: "Station 2 (Platzhalter)",
    code: "grieserie456",
    question: "Hinweis-Frage für Ort 2...",
    infoText: "Infotext für Ort 2..."
  },
  {
    id: 3,
    name: "Station 3 (Platzhalter)",
    code: "mariensaeule789",
    question: "Hinweis-Frage für Ort 3...",
    infoText: "Infotext für Ort 3..."
  },
  {
    id: 4,
    name: "The Cornerhouse (Ziel)",
    code: "cornerhouse999",
    question: "Hinweis-Frage für das Ziel...",
    infoText: "Geschafft! Ihr seid am Ziel. Meldet euch an der Theke."
  }
];

export default function App() {
  const [teamName, setTeamName] = useState('');
  const [participationChoice, setParticipationChoice] = useState(null); // 1, 2 oder 3
  
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [stationState, setStationState] = useState('SEEKING'); // 'SEEKING' oder 'FOUND'
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [quereinsteigerCode, setQuereinsteigerCode] = useState(null);
  const [showQuereinsteigerIntro, setShowQuereinsteigerIntro] = useState(false);
  
  const [uploadedPhotos, setUploadedPhotos] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  // LOGIK: LADEN & RESET
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Geheimer Admin-Modus
    if (urlParams.get('admin') === 'boss') {
      setIsAdminView(true);
      return;
    }

    if (urlParams.get('reset') === 'boss') {
      localStorage.clear();
      window.location.href = window.location.pathname;
      return;
    }

    const savedTeam = localStorage.getItem('quiz_team_name');
    const savedChoice = localStorage.getItem('quiz_participation_choice');
    const savedProgress = localStorage.getItem('quiz_team_progress');
    const savedState = localStorage.getItem('quiz_station_state');
    
    if (savedTeam && savedChoice) {
      setTeamName(savedTeam);
      setParticipationChoice(parseInt(savedChoice, 10));
      setIsRegistered(true);
    }
    
    let currentIndex = 0;
    if (savedProgress) {
      currentIndex = parseInt(savedProgress, 10);
      setCurrentStationIndex(currentIndex);
    }
    
    if (savedState) {
      setStationState(savedState);
    }

    // QR-Code Check
    const scannedCode = urlParams.get('code');
    if (scannedCode) {
      if (!savedTeam) {
        // Unregistrierter Quereinsteiger
        setQuereinsteigerCode(scannedCode);
        setShowQuereinsteigerIntro(true);
      } else {
        // Registriertes Team scannt Code
        handleScannedCode(scannedCode, currentIndex, savedState || 'SEEKING');
      }
    }
  }, []);

  const handleScannedCode = (code, currentIndex, currentState) => {
    if (currentIndex >= STATIONS.length) return;
    const expectedStation = STATIONS[currentIndex];
    
    if (expectedStation && code === expectedStation.code) {
      if (currentState === 'SEEKING') {
        setStationState('FOUND');
        localStorage.setItem('quiz_station_state', 'FOUND');
        setErrorMessage('');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else {
      setErrorMessage('Falscher Code oder falsche Reihenfolge!');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!teamName.trim() || !participationChoice) return;

    // TODO für Iteration 2: Hier den Fetch an den Worker einbauen, um Duplicate Names abzufangen
    // Beispiel: const res = await fetch('/api/check-name', ...); if(res.status === 409) setErrorMessage('Name vergeben!');

    localStorage.setItem('quiz_team_name', teamName.trim());
    localStorage.setItem('quiz_participation_choice', participationChoice.toString());
    localStorage.setItem('quiz_team_progress', '0');
    localStorage.setItem('quiz_station_state', 'SEEKING');
    
    setIsRegistered(true);
    setShowQuereinsteigerIntro(false);

    // Wenn ein Code beim Einstieg gescannt wurde, diesen jetzt anwenden
    if (quereinsteigerCode) {
      handleScannedCode(quereinsteigerCode, 0, 'SEEKING');
    }
  };

  const handleNextStation = () => {
    const nextIndex = currentStationIndex + 1;
    setCurrentStationIndex(nextIndex);
    setStationState('SEEKING');
    localStorage.setItem('quiz_team_progress', nextIndex);
    localStorage.setItem('quiz_station_state', 'SEEKING');
  };

  const handlePhotoUpload = async (e, stationId) => {
    const file = e.target.files[0];
    if (!file) return;

    // 10 MB Limit Check
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Das Bild ist zu groß! Maximal erlaubt sind 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      setUploadedPhotos({ ...uploadedPhotos, [stationId]: reader.result });
      setIsUploading(true);
      setErrorMessage('');
      try {
        await fetch("https://moosburg-ralley-api.andreas-stetter73.workers.dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ team: teamName, station: stationId, image: reader.result })
        });
      } catch (error) {
        setErrorMessage('Upload-Fehler! Bild konnte lokal gespeichert, aber nicht an den Server gesendet werden.');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };


  // --- UI RENDERING ---

  // ADMIN VIEW
  if (isAdminView) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <div style={styles.card}>
          <p>Hier siehst du in Kürze alle registrierten Teams und ihren Fortschritt. (Benötigt Datenbank-Update im Backend).</p>
        </div>
      </div>
    );
  }

  // QUEREINSTEIGER VIEW
  if (showQuereinsteigerIntro) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Moosburger Stadtrallye</h1>
        <div style={styles.card}>
          <h2 style={{marginTop: 0}}>Hallo und willkommen! 👋</h2>
          <p style={styles.text}>Du hast einen QR-Code der Stadtrallye gescannt. Bevor es losgeht, musst du schnell ein Team anlegen.</p>
          <button onClick={() => setShowQuereinsteigerIntro(false)} style={styles.button}>Weiter zur Anmeldung</button>
        </div>
      </div>
    );
  }

  // REGISTRIERUNG
  if (!isRegistered) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Moosburger Stadtrallye</h1>
        <div style={styles.card}>
          <p style={styles.text}>Registriert euch mit eurem Teamnamen (keine E-Mail-Adresse und kein Login erforderlich) und legt los.</p>
          
          <form onSubmit={handleRegister}>
            <input 
              type="text" 
              placeholder="Euer Teamname" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              style={styles.input}
              required
            />

            <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px'}}>
              <label style={styles.radioLabel}>
                <input type="radio" name="participation" value="1" onChange={() => setParticipationChoice(1)} required />
                <span>Ich will an der Verlosung der Preise teilnehmen und stimme zu, dass meine hochgeladenen Bilder vom Veranstalter für Werbe- und Promotionszwecke im Zusammenhang mit der Stadtrallye veröffentlicht werden dürfen. Mehr in der <a href="/privacy.html" target="_blank">Datenschutzerklärung</a>.</span>
              </label>

              <label style={styles.radioLabel}>
                <input type="radio" name="participation" value="2" onChange={() => setParticipationChoice(2)} />
                <span>Ich will an der Verlosung der Preise teilnehmen und stimme <strong>nicht</strong> zu, dass meine Bilder veröffentlicht werden. Sie dienen nur zur Dokumentation des Fortschritts. Mehr in der <a href="/privacy.html" target="_blank">Datenschutzerklärung</a>.</span>
              </label>

              <label style={styles.radioLabel}>
                <input type="radio" name="participation" value="3" onChange={() => setParticipationChoice(3)} />
                <span>Ich will keine Bilder hochladen und <strong>nicht</strong> an der Verlosung der Preise teilnehmen.</span>
              </label>
            </div>

            <button type="submit" style={{...styles.button, opacity: participationChoice ? 1 : 0.5}} disabled={!participationChoice}>
              Rallye starten
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isRalleyFinished = currentStationIndex >= STATIONS.length;
  const currentStation = STATIONS[currentStationIndex]; 

  // FINALE
  if (isRalleyFinished) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Moosburger Stadtrallye</h1>
        <div style={styles.card}>
          <h2 style={{textAlign: 'center', marginTop: '0'}}>🎉 FINALE! 🎉</h2>
          <p style={styles.text}>Ziel erreicht! Kommt zur Theke.</p>
        </div>
      </div>
    );
  }

  const uploadRequired = (participationChoice === 1 || participationChoice === 2);
  const photoUploaded = uploadedPhotos[currentStation.id];
  const canProceed = !uploadRequired || photoUploaded;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Moosburger Stadtrallye</h1>
      <div style={styles.header}>
        <span>Team: <strong>{teamName}</strong></span>
        <span>Station {currentStationIndex + 1} / {STATIONS.length}</span>
      </div>

      {errorMessage && <div style={styles.error}>{errorMessage}</div>}

      <div style={styles.card}>
        
        {/* PHASE A: ORT WIRD GESUCHT */}
        {stationState === 'SEEKING' && (
          <div>
            <h2 style={{marginTop: '0', color: '#0070f3'}}>🔍 Finde Station {currentStationIndex + 1}</h2>
            <p style={styles.text}><strong>Euer Hinweis:</strong></p>
            <p style={styles.text}>{currentStation.question}</p>
            
            {/* Dynamisches Bild: Wird nur angezeigt, wenn die Datei existiert */}
            <img 
              src={`/Hint_Station_${currentStation.id}.png`} 
              alt={`Hinweis für Station ${currentStation.id}`} 
              style={styles.hintImage} 
              onError={(e) => e.target.style.display = 'none'} 
            />

            <div style={styles.infoBox}>
              Sucht dort nach dem QR-Code und scannt ihn, um die Station freizuschalten!
            </div>
          </div>
        )}

        {/* PHASE B: ORT WURDE GEFUNDEN (QR gescannt) */}
        {stationState === 'FOUND' && (
          <div>
            <h2 style={{marginTop: '0', color: '#28a745'}}>✅ Station gefunden!</h2>
            <h3 style={{marginTop: 0}}>{currentStation.name}</h3>
            
            <div 
              style={{...styles.text, backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', marginBottom: '20px'}}
              dangerouslySetInnerHTML={{ __html: currentStation.infoText }}
            />

            {uploadRequired ? (
              <div style={styles.uploadSection}>
                <h4 style={{marginTop: '0'}}>📸 Fotobeweis hochladen</h4>
                <p style={{fontSize: '12px', color: '#666', marginTop: '-10px'}}>Macht ein Gruppenfoto vor Ort (Max. 10 MB).</p>
                <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, currentStation.id)} disabled={isUploading} />
                {isUploading && <p style={{color: '#0070f3', fontSize: '14px', fontWeight: 'bold'}}>Bild wird hochgeladen... ⏳</p>}
                {photoUploaded && !isUploading && <img src={photoUploaded} alt="Beweis" style={styles.previewImage} />}
              </div>
            ) : (
              <p style={{fontSize: '13px', color: '#666', fontStyle: 'italic'}}>Da ihr Option 3 gewählt habt, ist kein Bild-Upload erforderlich.</p>
            )}

            <button 
              onClick={handleNextStation} 
              style={{...styles.button, marginTop: '20px', backgroundColor: canProceed ? '#0070f3' : '#ccc'}}
              disabled={!canProceed}
            >
              Weiter zur nächsten Station
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif', minHeight: '100vh' },
  title: { textAlign: 'center', color: '#333', fontSize: '26px', marginTop: '0', marginBottom: '20px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' },
  text: { lineHeight: '1.6', color: '#444', fontSize: '15px' },
  input: { width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' },
  radioLabel: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', lineHeight: '1.4', color: '#333', cursor: 'pointer' },
  button: { width: '100%', padding: '15px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#333', color: '#fff', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' },
  error: { backgroundColor: '#ffe0e0', color: '#cc0000', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '14px' },
  uploadSection: { marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' },
  previewImage: { width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '5px', marginTop: '10px' },
  hintImage: { width: '100%', borderRadius: '8px', marginTop: '15px', marginBottom: '15px', border: '1px solid #ccc' },
  infoBox: { backgroundColor: '#eef6ff', padding: '15px', borderRadius: '5px', fontSize: '13px', textAlign: 'center', color: '#0056b3' }
};
