import React, { useState, useEffect } from 'react';

// 1. FAKEDATEN FÜR DIE MOOSBURG-ROUTE (Mit Suchbildern)
const STATIONS = [
  {
    id: 1,
    name: "Wärterbaracken (Mittelschule)",
    code: "baracke123",
    riddle: "Hier begann die Geschichte des Stalag VIIa. Suche die Infotafel. Welche Jahreszahl sticht ins Auge? Subtrahiere 1900, um den Hinweis für das Suchbild zu entschlüsseln.",
    imageHint: "Ein uriges Gebäude im Gries mit einem markanten Schild...",
    imageHintUrl: "/hint_griesserie.png", // Bild, das den Weg zu Station 2 zeigt
  },
  {
    id: 2,
    name: "Die Grieserie",
    code: "grieserie456",
    riddle: "Urig, Moosburg pur. Zähle die Sprossen des großen Fensters an der Front. Multipliziere mit 3. Das bringt dich zum belebtesten Platz der Stadt.",
    imageHint: "Eine goldene Dame, die in den Himmel ragt...",
    imageHintUrl: "/hint_mariensaeule.png", // Bild, das den Weg zu Station 3 zeigt
  },
  {
    id: 3,
    name: "Mariensäule (Plan)",
    code: "mariensaeule789",
    riddle: "Vier Plagen bedrohen die Stadt zu Füßen der Patronin. Welche Kreatur steht für die Pest? Ihr Name weist den Weg zum höchsten Turm.",
    imageHint: "Das spirituelle Herz der Stadt mit mächtigem Turm...",
    imageHintUrl: "/hint_cornerhouse.png", // Bild, das den Weg zum Finale zeigt
  },
  {
    id: 4,
    name: "The Cornerhouse (Ziel)",
    code: "cornerhouse999",
    riddle: "Geschafft! Der Heimathafen ist erreicht. Meldet euch beim Quizmaster für euer wohlverdientes Kaltgetränk!",
    imageHint: "Kein Bild mehr nötig, ihr seid da!",
    imageHintUrl: null,
  }
];

export default function App() {
  const [teamName, setTeamName] = useState('');
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // 2. SCAN-LOGIK BEIM LADEN DER APP
  useEffect(() => {
    const savedTeam = localStorage.getItem('quiz_team_name');
    const savedProgress = localStorage.getItem('quiz_team_progress');
    
    if (savedTeam) {
      setTeamName(savedTeam);
      setIsRegistered(true);
    }
    if (savedProgress) {
      setCurrentStationIndex(parseInt(savedProgress, 10));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const scannedCode = urlParams.get('code');

    if (scannedCode && savedTeam) {
      handleScannedCode(scannedCode, parseInt(savedProgress, 10) || 0);
    }
  }, []);

  // 3. CODE VALIDIEREN
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

  // 4. TEAM REGISTRIEREN
  const handleRegister = (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    localStorage.setItem('quiz_team_name', teamName.trim());
    localStorage.setItem('quiz_team_progress', '0');
    setIsRegistered(true);
    
    const urlParams = new URLSearchParams(window.location.search);
    const scannedCode = urlParams.get('code');
    if (scannedCode) handleScannedCode(scannedCode, 0);
  };

  // 5. FOTO HOCHLADEN AN LIVE-CLOUDFLARE-WORKER
  const handlePhotoUpload = async (e, stationId) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const updatedPhotos = { ...uploadedPhotos, [stationId]: reader.result };
      setUploadedPhotos(updatedPhotos);

      setIsUploading(true);
      try {
        const response = await fetch("https://moosburg-ralley-api.andreas-stetter73.workers.dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            team: teamName,
            station: stationId,
            image: reader.result
          })
        });
        
        if (!response.ok) {
          setErrorMessage('Upload-Fehler! Bild konnte nicht im R2-Speicher gesichert werden.');
        } else {
          console.log("Foto erfolgreich in R2 gespeichert!");
        }
      } catch (error) {
        setErrorMessage('Netzwerkfehler! Überprüfe deine Internetverbindung.');
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
        <h1 style={styles.title}>Moosburg Pub-Quiz Ralley 🧭</h1>
        <div style={styles.card}>
          <h3 style={{marginTop: '0'}}>Registrierung</h3>
          <p style={styles.text}>Gebt euren offiziellen Teamnamen ein, um die Ralley zu starten. Der Name kann danach nicht mehr geändert werden!</p>
          <form onSubmit={handleRegister}>
            <input 
              type="text" 
              placeholder="z.B. Die Besserwisser" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>Ralley starten</button>
          </form>
        </div>
      </div>
    );
  }

  const isRalleyFinished = currentStationIndex >= STATIONS.length;
  const currentStation = STATIONS[currentStationIndex];
  const previousStation = STATIONS[currentStationIndex - 1];

  // SCREEN B: FINALE ERREICHT
  if (isRalleyFinished) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Moosburg Pub-Quiz Ralley 🧭</h1>
        <div style={styles.card}>
          <h2 style={{textAlign: 'center', marginTop: '0'}}>🎉 FINALE! 🎉</h2>
          <p style={styles.text}>Bravo, Team <strong>{teamName}</strong>! Ihr habt alle Stationen in Moosburg gefunden und die Rätsel gelöst.</p>
          <p style={styles.text}>Meldet euch jetzt an der Theke im <strong>Cornerhouse</strong> für eure Auswertung.</p>
        </div>
      </div>
    );
  }

  // SCREEN C: DAS LAUFENDE SPIEL (STATIONEN)
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Moosburg Pub-Quiz Ralley 🧭</h1>
      
      <div style={styles.header}>
        <span>Team: <strong>{teamName}</strong></span>
        <span>Fortschritt: {currentStationIndex} / {STATIONS.length}</span>
      </div>

      {errorMessage && <div style={styles.error}>{errorMessage}</div>}

      <div style={styles.card}>
        <h2 style={{marginTop: '0'}}>📍 Eure aktuelle Mission</h2>
        
        {currentStationIndex === 0 ? (
          <div>
            <p style={styles.text}>Sucht den ersten Aufkleber, um das Spiel zu aktivieren! Er befindet sich am Startpunkt.</p>
            <p style={styles.hint}><strong>Hinweis auf Startpunkt:</strong> {currentStation.riddle}</p>
          </div>
        ) : (
          <div>
            <p style={styles.text}>Ihr habt den Code gescannt und steht erfolgreich bei: <strong>{previousStation.name}</strong></p>
            
            <div style={styles.riddleBox}>
              <h4 style={{marginTop: '0'}}>Das Rätsel vor Ort:</h4>
              <p style={{marginBottom: '0'}}>{previousStation.riddle}</p>
            </div>

            {/* Fotobeweis */}
            <div style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px'}}>
              <h4 style={{marginTop: '0'}}>📸 Fotobeweis hochladen</h4>
              <p style={{fontSize: '12px', color: '#666', marginTop: '-10px'}}>Macht ein Foto von eurem Team vor Ort, um die Station zu verifizieren.</p>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={(e) => handlePhotoUpload(e, previousStation.id)}
                style={{marginBottom: '10px'}}
                disabled={isUploading}
              />
              {isUploading && <p style={{color: '#0070f3', fontSize: '14px', fontWeight: 'bold'}}>Bild wird hochgeladen... ⏳</p>}
              {uploadedPhotos[previousStation.id] && !isUploading && (
                <img src={uploadedPhotos[previousStation.id]} alt="Beweis" style={styles.previewImage} />
              )}
            </div>

            {/* Hinweis auf den NÄCHSTEN Ort inkl. Suchbild */}
            <div style={{marginTop: '20px', backgroundColor: '#eef6ff', padding: '15px', borderRadius: '5px'}}>
              <h4 style={{marginTop: '0'}}>🔍 Hinweis auf die NÄCHSTE Station:</h4>
              <p>{previousStation.imageHint}</p>
              
              {/* Hier wird das Suchbild für den nächsten Ort gerendert */}
              {previousStation.imageHintUrl && (
                <img 
                  src={previousStation.imageHintUrl} 
                  alt="Suchbild Hinweis" 
                  style={styles.hintImage} 
                />
              )}

              <p style={{fontSize: '12px', color: '#555', fontStyle: 'italic', marginBottom: '0'}}>Sucht dort nach dem nächsten NFC/QR-Code Sticker!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Styling (Titel-Formatierung gefixt & Suchbild-Style hinzugefügt)
const styles = {
  container: { padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' },
  title: { textAlign: 'center', color: '#333', fontSize: '26px', marginTop: '0', marginBottom: '20px', lineHeight: '1.2' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#333', color: '#fff', borderRadius: '5px', marginBottom: '20px', fontSize: '14px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' },
  text: { lineHeight: '1.5', color: '#444' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  error: { backgroundColor: '#ffe0e0', color: '#cc0000', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' },
  riddleBox: { backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '5px', marginTop: '15px' },
  hint: { color: '#0070f3', fontWeight: 'bold' },
  previewImage: { width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px', marginTop: '10px' },
  hintImage: { width: '100%', borderRadius: '8px', marginTop: '10px', marginBottom: '10px', border: '1px solid #ccc' } // Styling für das neue Suchbild
};
