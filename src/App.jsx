import React, { useState, useEffect } from 'react';

// 1. STATIONSDATEN
const STATIONS = [
  {
    id: 1,
    name: "Wächter Baracken Mittelschule",
    code: "baracke123",
    question: "Hier trifft eine der größten Mittelschulen in Bayern auf die Überreste des größten Kriegsgefangenenlager innerhalb des Deutschen Reiches im zweiten Weltkrieg.",
    infoText: "<strong>Ehemalige Baracken der Wachmannschaften:</strong><br/>Die Kaserne der Wachmannschaft befindet sich etwa 500 m vom Gefangenenlager entfernt. Die Gebäude dienten nach dem Krieg als Wohngebäude für sozial Bedürftige. Drei dieser Baracken sind noch erhalten und stehen unter Denkmalschutz. Die weitere Nutzung oder der Abriss stehen noch in Diskussion. Ein Teil ist für ein zukünftiges Info- und Dokumentationszentrum vorgesehen. Mehr Informationen unter <a href='https://stalag-moosburg.de/' target='_blank' rel='noopener noreferrer' style='color:#0070f3;'>https://stalag-moosburg.de/</a>"
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
  const [participationChoice, setParticipationChoice] = useState(null); 
  
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [stationState, setStationState] = useState('SEEKING'); 
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [quereinsteigerCode, setQuereinsteigerCode] = useState(null);
  const [showQuereinsteigerIntro, setShowQuereinsteigerIntro] = useState(false);
  
  const [uploadedPhotos, setUploadedPhotos] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // ADMIN STATES
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminTeams, setAdminTeams] = useState([]);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // LOGIK: LADEN & RESET
  useEffect(() => {
    // Setzt den Titel im Browser-Tab dynamisch
    document.title = "Stadtrallye 2026";

    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('admin') === 'boss') {
      setIsAdminView(true);
      fetchAdminData();
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

    const scannedCode = urlParams.get('code');
    if (scannedCode) {
      if (!savedTeam) {
        setQuereinsteigerCode(scannedCode);
        setShowQuereinsteigerIntro(true);
      } else {
        handleScannedCode(scannedCode, currentIndex, savedState || 'SEEKING');
      }
    }
  }, []);

  const fetchAdminData = async () => {
    setIsLoadingAdmin(true);
    setErrorMessage('');
    try {
      const response = await fetch("https://moosburg-ralley-api.andreas-stetter73.workers.dev/api/admin/teams");
      if (response.ok) {
        const data = await response.json();
        data.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
        setAdminTeams(data);
      } else {
        setErrorMessage("Fehler beim Abrufen der Team-Daten vom Server.");
      }
    } catch (error) {
      setErrorMessage("Netzwerkfehler! Konnte die Admin-Daten nicht laden.");
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  const handleAdminAction = async (targetTeamName, action) => {
    if (action === 'delete') {
      if (!window.confirm(`Soll das Team "${targetTeamName}" wirklich unwiderruflich gelöscht werden?`)) return;
    } else if (action === 'reset') {
      if (!window.confirm(`Soll der Fortschritt von "${targetTeamName}" wieder auf 0 gesetzt werden?`)) return;
    }

    setIsLoadingAdmin(true);
    try {
      const response = await fetch("https://moosburg-ralley-api.andreas-stetter73.workers.dev/api/admin/teams/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: targetTeamName, action: action })
      });
      
      if (response.ok) {
        fetchAdminData();
        const localTeam = localStorage.getItem('quiz_team_name');
        if (localTeam && localTeam.trim().toLowerCase() === targetTeamName.trim().toLowerCase()) {
          if (action === 'delete') {
            localStorage.removeItem('quiz_team_name');
            localStorage.removeItem('quiz_participation_choice');
            localStorage.removeItem('quiz_team_progress');
            localStorage.removeItem('quiz_station_state');
          } else if (action === 'reset') {
            localStorage.setItem('quiz_team_progress', '0');
            localStorage.setItem('quiz_station_state', 'SEEKING');
          }
        }
      } else {
        setErrorMessage("Fehler bei der Server-Aktion.");
      }
    } catch (error) {
      setErrorMessage("Netzwerkfehler bei der Admin-Aktion.");
    } finally {
      setIsLoadingAdmin(false);
    }
  };

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

    setErrorMessage('');
    try {
      const response = await fetch("https://moosburg-ralley-api.andreas-stetter73.workers.dev/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          team: teamName.trim(), 
          choice: participationChoice 
        })
      });

      if (response.status === 409) {
        const data = await response.json();
        setErrorMessage(data.error || "Dieser Teamname ist leider schon vergeben!");
        return;
      }

      if (!response.ok) {
        setErrorMessage("Fehler bei der Kommunikation mit dem Server. Bitte versucht es nochmal.");
        return;
      }

      localStorage.setItem('quiz_team_name', teamName.trim());
      localStorage.setItem('quiz_participation_choice', participationChoice.toString());
      localStorage.setItem('quiz_team_progress', '0');
      localStorage.setItem('quiz_station_state', 'SEEKING');
      
      setIsRegistered(true);
      setShowQuereinsteigerIntro(false);

      if (quereinsteigerCode) {
        handleScannedCode(quereinsteigerCode, 0, 'SEEKING');
      }
    } catch (error) {
      setErrorMessage("Netzwerkfehler! Überprüft eure Internetverbindung.");
    }
  };

  const handleNextStation = async () => {
    const nextIndex = currentStationIndex + 1;
    
    try {
      await fetch("https://moosburg-ralley-api.andreas-stetter73.workers.dev/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          team: teamName, 
          station: STATIONS[currentStationIndex].id, 
          progress: nextIndex 
        })
      });
    } catch (error) {
      console.error("Fortschritt konnte nicht mit dem Server synchronisiert werden.", error);
    }

    setCurrentStationIndex(nextIndex);
    setStationState('SEEKING');
    localStorage.setItem('quiz_team_progress', nextIndex);
    localStorage.setItem('quiz_station_state', 'SEEKING');
  };

  const handlePhotoUpload = async (e, stationId) => {
    const file = e.target.files[0];
    if (!file) return;

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
        const response = await fetch("https://moosburg-ralley-api.andreas-stetter73.workers.dev/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            team: teamName, 
            station: stationId, 
            image: reader.result,
            progress: currentStationIndex + 1 
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage("Server-Fehler: " + (errorData.error || "Bild-Upload fehlgeschlagen."));
        }
      } catch (error) {
        setErrorMessage('Netzwerk-Fehler! Bild konnte nicht gesendet werden.');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- UI RENDERING ---

  if (isAdminView) {
    return (
      <div style={{...styles.container, maxWidth: '900px'}}>
        <h1 style={styles.title}>Moosburger Stadtrallye - Admin</h1>
        {errorMessage && <div style={styles.error}>{errorMessage}</div>}
        
        <div style={styles.card}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{marginTop: 0, marginBottom: 0}}>Registrierte Teams ({adminTeams.length})</h2>
            <button 
              onClick={fetchAdminData} 
              style={{padding: '8px 16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}
              disabled={isLoadingAdmin}
            >
              {isLoadingAdmin ? 'Lädt...' : '🔄 Aktualisieren'}
            </button>
          </div>

          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left'}}>
              <thead>
                <tr style={{backgroundColor: '#f0f0f0'}}>
                  <th style={styles.th}>Teamname</th>
                  <th style={styles.th}>Station</th>
                  <th style={styles.th} title="Upload Erlaubnis">UL</th>
                  <th style={styles.th} title="Social Media Erlaubnis">SM</th>
                  <th style={styles.th}>Registriert am</th>
                  <th style={styles.th}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {adminTeams.map((team, idx) => {
                  const canUpload = team.choice === 1 || team.choice === 2;
                  const canSocialMedia = team.choice === 1;

                  return (
                    <tr key={idx} style={{borderBottom: '1px solid #eee'}}>
                      <td style={styles.td}><strong>{team.originalName}</strong></td>
                      <td style={styles.td}>
                        <span style={{backgroundColor: '#eef6ff', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', color: '#0070f3'}}>
                          {team.progress} / {STATIONS.length}
                        </span>
                      </td>
                      <td style={styles.td}>{canUpload ? '✅' : '❌'}</td>
                      <td style={styles.td}>{canSocialMedia ? '✅' : '❌'}</td>
                      <td style={styles.td}>
                        {new Date(team.registeredAt).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
                      </td>
                      <td style={styles.td}>
                        <button 
                          onClick={() => handleAdminAction(team.originalName, 'reset')} 
                          style={styles.actionBtn} 
                          title="Fortschritt auf 0 setzen"
                        >🔄</button>
                        <button 
                          onClick={() => handleAdminAction(team.originalName, 'delete')} 
                          style={styles.actionBtn} 
                          title="Team löschen"
                        >🗑️</button>
                      </td>
                    </tr>
                  )
                })}
                {adminTeams.length === 0 && !isLoadingAdmin && (
                  <tr>
                    <td colSpan="6" style={{padding: '30px', textAlign: 'center', color: '#666'}}>Noch keine Teams registriert.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p style={{fontSize: '12px', color: '#666', marginTop: '15px'}}>
            <strong>Legende:</strong> UL = Foto-Upload erlaubt | SM = Social Media Verwendung erlaubt
          </p>
        </div>
      </div>
    );
  }

  if (showQuereinsteigerIntro) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Moosburger Stadtrallye 2026</h1>
        <div style={styles.card}>
          <h2 style={{marginTop: 0}}>Hallo und willkommen! 👋</h2>
          <p style={styles.text}>Du hast einen QR-Code der Stadtrallye gescannt. Bevor es losgeht, musst du schnell ein Team anlegen.</p>
          <button onClick={() => setShowQuereinsteigerIntro(false)} style={styles.button}>Weiter zur Anmeldung</button>
        </div>
        <div style={styles.partnerLogoWrapper}>
          <span style={styles.partnerLabel}>Powered by The Corner House</span>
          <img src="/logo_ch.png" alt="Partner" style={styles.partnerLogo} />
        </div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Moosburger Stadtrallye 2026</h1>
        
        {errorMessage && <div style={styles.error}>{errorMessage}</div>}

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

            <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px'}}>
              <label style={styles.radioLabel}>
                <input type="radio" name="participation" value="1" onChange={() => setParticipationChoice(1)} required />
                <span>Ich will an der Verlosung der Preise teilnehmen und stimme zu, dass meine hochgeladenen Bilder vom Veranstalter für Werbe- und Promotionszwecke im Zusammenhang mit der Stadtrallye veröffentlicht werden dürfen. Mehr in der <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>.</span>
              </label>

              <label style={styles.radioLabel}>
                <input type="radio" name="participation" value="2" onChange={() => setParticipationChoice(2)} />
                <span>Ich will an der Verlosung der Preise teilnehmen und stimme <strong>nicht</strong> zu, dass meine Bilder veröffentlicht werden. Sie dienen nur zur Dokumentation des Fortschritts. Mehr in der <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>.</span>
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

        <div style={styles.partnerLogoWrapper}>
          <span style={styles.partnerLabel}>Powered by The Corner House</span>
          <img src="/logo_ch.png" alt="Partner" style={styles.partnerLogo} />
        </div>
      </div>
    );
  }

  const isRalleyFinished = currentStationIndex >= STATIONS.length;
  const currentStation = STATIONS[currentStationIndex]; 

  if (isRalleyFinished) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Moosburger Stadtrallye 2026</h1>
        <div style={styles.card}>
          <h2 style={{textAlign: 'center', marginTop: '0'}}>🎉 FINALE! 🎉</h2>
          <p style={styles.text}>Ziel erreicht! Kommt zur Theke im Corner House.</p>
        </div>
        <div style={styles.partnerLogoWrapper}>
          <span style={styles.partnerLabel}>Powered by The Corner House</span>
          <img src="/logo_ch.png" alt="Partner" style={styles.partnerLogo} />
        </div>
      </div>
    );
  }

  const uploadRequired = (participationChoice === 1 || participationChoice === 2);
  const photoUploaded = uploadedPhotos[currentStation.id];
  const canProceed = !uploadRequired || photoUploaded;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Moosburger Stadtrallye 2026</h1>
      <div style={styles.header}>
        <span>Team: <strong>{teamName}</strong></span>
        <span>Station {currentStationIndex + 1} / {STATIONS.length}</span>
      </div>

      {errorMessage && <div style={styles.error}>{errorMessage}</div>}

      <div style={styles.card}>
        
        {stationState === 'SEEKING' && (
          <div>
            <h2 style={{marginTop: '0', color: '#0070f3'}}>🔍 Finde Station {currentStationIndex + 1}</h2>
            <p style={styles.text}><strong>Euer Hinweis:</strong></p>
            <p style={styles.text}>{currentStation.question}</p>
            
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

      <div style={styles.partnerLogoWrapper}>
        <span style={styles.partnerLabel}>Powered by The Corner House</span>
        <img src="/logo_ch.png" alt="Partner" style={styles.partnerLogo} />
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px 20px 140px 20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif', minHeight: '100vh', position: 'relative' },
  title: { textAlign: 'center', color: '#333', fontSize: '26px', marginTop: '0', marginBottom: '20px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' },
  text: { lineHeight: '1.6', color: '#444', fontSize: '15px' },
  dateBox: { backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '5px', marginBottom: '25px', fontSize: '15px', textAlign: 'center' },
  input: { width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' },
  radioLabel: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', lineHeight: '1.4', color: '#333', cursor: 'pointer' },
  button: { width: '100%', padding: '15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }, // HIER IST BLAU ZURÜCK!
  header: { display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#333', color: '#fff', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' },
  error: { backgroundColor: '#ffe0e0', color: '#cc0000', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '14px' },
  uploadSection: { marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' },
  previewImage: { width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '5px', marginTop: '10px' },
  hintImage: { width: '100%', borderRadius: '8px', marginTop: '15px', marginBottom: '15px', border: '1px solid #ccc' },
  infoBox: { backgroundColor: '#eef6ff', padding: '15px', borderRadius: '5px', fontSize: '13px', textAlign: 'center', color: '#0056b3' },
  partnerLogoWrapper: { position: 'fixed', bottom: '20px', right: '20px', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', padding: '10px 20px', borderRadius: '30px', boxShadow: '0 3px 10px rgba(0,0,0,0.15)', zIndex: 100 },
  partnerLabel: { fontSize: '16px', color: '#333', marginRight: '12px', fontWeight: 'bold' },
  partnerLogo: { maxHeight: '60px', maxWidth: '150px' },
  th: { padding: '12px', borderBottom: '2px solid #ddd', color: '#555' },
  td: { padding: '12px' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', margin: '0 5px' }
};
