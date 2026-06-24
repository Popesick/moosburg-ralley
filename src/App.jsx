import React, { useState, useEffect } from 'react';

// 1. STARTDATUM DER RALLYE
const START_DATE = new Date('2026-07-06T00:00:00');

// 2. ALLE 17 FINALEN STATIONSDATEN (MIT BÜCHERSTUBE)
const STATIONS = [
  {
    id: 1,
    name: "1. Wächterbaracken",
    code: "baracke123",
    question: "Willkommen zur (wahrscheinlich) ersten Moosburger Stadtrallye!\n\nIn den nächsten Tagen werdet ihr bekannte Orte neu entdecken und Geschichten finden, die oft direkt vor unserer Nase liegen.\n\nEure erste Station führt euch an einen Ort, an dem Vergangenheit und Gegenwart Tür an Tür wohnen.\nWo einst die Bewacher wohnten, lernen heute die Jugendlichen. Doch drei Zeugen der Vergangenheit stehen noch immer daneben.\n\nAn diesem Ort wartet der erste QR-Code auf euch.\nSucht und scant den QR-Code mit euerem Smartphone um die nächste Station freizuschalten!\n\nDas untenstehende Bild wurde in dem Gebäude aufgenommen, an dem der QR-Code zu finden ist. ",
    infoText: "Die drei erhaltenen Wächterbaracken gehören zu den letzten sichtbaren Überresten des ehemaligen Kriegsgefangenenlagers Stalag VII A. Während des Zweiten Weltkriegs waren hier Angehörige der Wachmannschaften untergebracht.<br/><br/>Das Stalag VII A war zeitweise das größte Kriegsgefangenenlager auf deutschem Boden. Nach Kriegsende wurden die Baracken als Wohnraum genutzt. Heute stehen sie unter Denkmalschutz und sollen teilweise zu einem Informations- und Dokumentationszentrum weiterentwickelt werden.<br/><br/>Das abgebildete Zimmer befindet sich in einer der erhaltenen Wächterbaracken. Als der letzte Bewohner 2016 auszog, schien die Zeit stehen geblieben zu sein. Möbel, Tapeten und persönliche Gegenstände waren noch vorhanden und geben bis heute einen eindrucksvollen Einblick in die Geschichte der Gebäude und ihrer späteren Nutzung als Wohnraum."
  },
  {
    id: 2,
    name: "2. Stalag-Gedenkplatz",
    code: "gedenkplatz789",
    question: "Eure Reise führt euch nun zu einem Ort des Erinnerns.\nManchmal erzählen Steine Geschichten.\nDieser hier erzählt von Rhône, Loire, Garonne und Seine.",
    infoText: "Der Stalag-Gedenkplatz ist der zentrale Erinnerungsort an das ehemalige Kriegsgefangenenlager Stalag VII A.<br/><br/>Im Mittelpunkt steht der sogenannte Franzosenbrunnen. Er wurde vom französischen Bildhauer Antoniucci Volti während seiner Gefangenschaft geschaffen. Das Relief zeigt die vier großen Flüsse Frankreichs: Rhône, Loire, Garonne und Seine.<br/><br/>Heute erinnern Informationstafeln an die Geschichte der über eine Million Menschen, die das Lager während seines Bestehens durchliefen."
  },
  {
    id: 3,
    name: "3. Haus der Heimat",
    code: "heimat456",
    question: "Die nächste Station erinnert daran, dass Heimat manchmal mehr ist als ein Ort auf der Landkarte.\nManche Menschen mussten ihre Heimat verlassen. An diesem Ort werden ihre Geschichten, Erinnerungen und Traditionen bis heute bewahrt.",
    infoText: "Das Haus der Heimat wurde 2005 als Vereinsheim, Museum und Begegnungsstätte errichtet.<br/><br/>Hier engagieren sich verschiedene Landsmannschaften und Heimatvereine, deren Mitglieder nach dem Zweiten Weltkrieg ihre Heimat in Ost- und Südosteuropa verlassen mussten.<br/><br/>Das Haus erinnert daran, dass die Geschichte Moosburgs nicht nur von den Menschen geprägt wurde, die hier immer gelebt haben, sondern auch von denen, die nach dem Krieg hier eine neue Heimat gefunden haben."
  },
  {
    id: 4,
    name: "4. DAV Kletterhalle",
    code: "kletterhalle444",
    question: "Die nächste Station führt euch an einen Ort, an dem manche Menschen freiwillig die Wand hochgehen.\nFrüher wurde hier eingekehrt, heute wird geklettert. Gesucht wird ein Ort, an dem Höhenmeter mitten in Moosburg gesammelt werden.",
    infoText: "Die DAV-Sektion Moosburg bietet Kletterbegeisterten mitten in der Stadt die Möglichkeit, ihrem Sport nachzugehen. Hier trainieren Anfänger ebenso wie erfahrene Kletterer und Bergsteiger für ihre nächsten Abenteuer am Fels oder in den Alpen.<br/><br/>Das Vereinsheim steht auf geschichtsträchtigem Boden. Bis in die 1950er Jahre befand sich hier eine Gastwirtschaft, die im Volksmund als „Staunznwirt“ bekannt war. Der Name leitet sich vom bairischen Wort „Staunzn“ für Mücken ab. Woher dieser Name kommt, habt ihr auf dem Weg hierher möglicherweise selbst am eigenen Leib erfahren.<br/><br/>Als später das Vereinsheim errichtet werden sollte, sorgten die Pläne in Moosburg für reichlich Diskussionen. Zeitzeugen berichten noch heute von Unterschriftensammlungen und hitzigen Debatten, die man rückblickend fast als kleinen Volksaufstand bezeichnen könnte.<br/><br/>Heute geht es deutlich friedlicher zu. Statt über Baupläne wird hier über Kletterrouten diskutiert, und statt Maßkrügen stehen Seile, Karabiner und Kletterschuhe im Mittelpunkt.<br/><br/>Wenn ihr diese Station am 11. Juli besucht, fragt ihr euch vielleicht, warum hier plötzlich so viele Menschen unterwegs sind. Die Antwort ist einfach: Auf dem Gelände findet an diesem Tag das Sommerfest der DAV-Sektion mit Biergartenbetrieb statt.<br/><br/>Solltet ihr also plötzlich den Duft von Grillgut wahrnehmen oder Menschen mit Getränken in der Hand entdecken, gehört das ausnahmsweise nicht zur Rallye, sondern zum Programm des DAV."
  },
  {
    id: 5,
    name: "5. Zehentstadel",
    code: "zehentstadel111", 
    question: "Für die nächste Station müsst ihr einige Jahrhunderte zurückreisen.\nFrüher brachte man hier den zehnten Teil seiner Ernte vorbei. Heute kommen die Menschen freiwillig.",
    infoText: "Der Zehentstadel erinnert an eine Zeit, in der Bauern einen Teil ihrer Ernte als Abgabe an Kirche oder Grundherrn leisten mussten.<br/><br/>Heute werden hier keine Naturalien mehr gesammelt, sondern Kultur, Kunst und Begegnungen. Der Zehentstadel zählt zu den bedeutenden historischen Gebäuden Moosburgs und wird regelmäßig für Veranstaltungen genutzt."
  },
  {
    id: 6,
    name: "6. Heimatmuseum",
    code: "museum222",
    question: "Wer die Zukunft verstehen will, sollte manchmal zuerst einen Blick in die Vergangenheit werfen.\nWer wissen möchte, wie Moosburg geworden ist, was es heute ist, findet die Antworten zwischen Urzeit und Neuzeit.",
    infoText: "Das Heimatmuseum erzählt die Geschichte der Region von der Urgeschichte bis in die Gegenwart.<br/><br/>Seit 1975 befindet sich die Sammlung in der ehemaligen Klosterschule am Kastulusplatz. Die Ausstellungen reichen von archäologischen Funden über Stadtgeschichte bis hin zu Alltagsgegenständen vergangener Generationen."
  },
  {
    id: 7,
    name: "7. Kastulusmünster & Johanneskirche",
    code: "muenster333",
    question: "Die nächste Station verbindet zwei Glaubenszeugen, die sich nie begegnet sind.\nDer eine lebte im alten Rom, der andere am Jordan. Heute stehen sie in Moosburg Seite an Seite.",
    infoText: "Das Kastulusmünster ist das Wahrzeichen Moosburgs und prägt die Silhouette der Stadt seit Jahrhunderten.<br/><br/>Benannt ist es nach dem heiligen Kastulus, einem römischen Märtyrer des 3. Jahrhunderts. Direkt daneben steht die Johanneskirche, die Johannes dem Täufer gewidmet ist.<br/><br/>Im Inneren des Münsters befindet sich mit dem Hochaltar von Hans Leinberger eines der bedeutendsten Kunstwerke der Spätgotik in Altbayern."
  },
  {
    id: 8,
    name: "8. Grieserie",
    code: "grieserie456",
    question: "Die Zeit hinterlässt Spuren. Manche Häuser erzählen davon besonders eindrucksvoll.\nDas älteste erhaltene Haus der Stadt hat schon viele Jahrhunderte erlebt. Heute trifft man hier auf Menschen statt auf Geschichte hinter Glas.",
    infoText: "Die Grieserie gilt als das älteste erhaltene Haus Moosburgs.<br/><br/>Heute dient sie als soziale Begegnungsstätte. Hier stehen Austausch, Gemeinschaft und Begegnung im Mittelpunkt.<br/><br/>2025 wurde die Grieserie mit dem Oberbayerischen Denkmalpreis ausgezeichnet."
  },
  {
    id: 9,
    name: "9. Stadtmarketing Moosburg",
    code: "marketing555",
    question: "Nicht jede wichtige Institution erkennt man auf den ersten Blick.\nWer dafür sorgt, dass andere sichtbar werden, bleibt oft selbst im Hintergrund.",
    infoText: "Das Stadtmarketing Moosburg setzt sich dafür ein, die Innenstadt attraktiv und lebendig zu halten.<br/><br/>Zu den Aufgaben gehören die Unterstützung von Veranstaltungen, die Förderung des Einzelhandels sowie die Vermarktung Moosburgs als Einkaufs-, Kultur- und Erlebnisstandort."
  },
  {
    id: 10,
    name: "10. Modehaus Heilingbrunner",
    code: "heilingbrunner666",
    question: "Die nächste Station beweist, dass manche Erfolgsgeschichten mehrere Jahrhunderte dauern können.\nSeit über 200 Jahren kleidet dieses Haus die Menschen der Region ein. Für Mode sind zwei Jahrhunderte eine ziemlich lange Saison.",
    infoText: "Das Modehaus Heilingbrunner gehört seit mehr als 200 Jahren zu Moosburg.<br/><br/>Nur wenige Geschäfte können auf eine derart lange Geschichte zurückblicken und sind gleichzeitig bis heute fest im Stadtleben verankert."
  },
  {
    id: 11,
    name: "11. Badehimmel",
    code: "badehimmel777",
    question: "Für die nächste Station braucht ihr weder Schwimmflügel noch Badekappe.\nHier dreht sich alles ums Baden, aber niemand wird nass.",
    infoText: "Der Moosburger Badehimmel ist ein Paradies für alle, die sich selbst oder anderen etwas Gutes tun möchten.<br/><br/>Im Sortiment finden sich Naturkosmetik, Badezusätze, Badekugeln, Naturcremes, handgemachte Seifen und viele weitere Wellness- und Pflegeprodukte. Ergänzt wird das Angebot durch Geschenkartikel, Dekorationen und besondere Fundstücke.<br/><br/>Wer auf der Suche nach einem Geschenk ist oder sich selbst eine kleine Auszeit gönnen möchte, wird hier meist fündig."
  },
  {
    id: 12,
    name: "12. Wasserturm",
    code: "lenigoth888", 
    question: "Die nächste Station erinnert an eine Zeit, in der fließendes Wasser alles andere als selbstverständlich war.\nHeute ist er stillgelegt. Früher sorgte er dafür, dass in Moosburg die Leitungen nicht trocken blieben.",
    infoText: "Der Wasserturm wurde Anfang des 20. Jahrhunderts errichtet und war über viele Jahrzehnte ein wichtiger Bestandteil der Moosburger Wasserversorgung.<br/><br/>Seine Aufgabe bestand darin, Wasser zu speichern und durch den Höhenunterschied den notwendigen Druck im Leitungsnetz aufrechtzuerhalten. Damit gehörte der Turm zu den Bauwerken, die den Alltag der Menschen oft unbemerkt, aber entscheidend beeinflussten.<br/><br/>Heute wird der Turm nicht mehr für die Wasserversorgung genutzt, prägt aber weiterhin das Stadtbild und erinnert an die technische Entwicklung Moosburgs.<br/><br/>Der Turm befindet sich heute im Besitz des Deutschen Alpenvereins (DAV). Während der Wasserturm selbst derzeit nicht genutzt wird, betreibt der DAV in Moosburg eine moderne Kletterhalle und engagiert sich aktiv im Vereins- und Breitensport.<br/><br/>Werft auch einen Blick auf die historischen Baupläne dieser Station. Sie zeigen eindrucksvoll, wie dieses technische Bauwerk ursprünglich geplant wurde und geben einen spannenden Einblick in die Ingenieurskunst seiner Zeit."
  },
  {
    id: 13,
    name: "13. Gerlspeck",
    code: "gerlspeck999",
    question: "Manche Namen gehören so selbstverständlich zur Stadt, dass man kaum noch über sie nachdenkt.\nSchuhe, Taschen und Lederwaren haben hier Tradition. Manche Moosburger kennen den Namen schon ihr ganzes Leben.",
    infoText: "Das Schuhhaus und Lederwarengeschäft Gerlspeck gehört seit Jahrzehnten zum Stadtplatz.<br/><br/>Als Familienunternehmen begleitet es Generationen von Moosburgern vom ersten Kinderschuh bis zur Reisetasche für den Urlaub."
  },
  {
    id: 14,
    name: "14. Barbaras Bücherstube",
    code: "buecherstube888",
    question: "Für die nächste Station braucht ihr keinen Reisepass, obwohl euch dort seit mehr als 45 Jahren tausende Welten erwarten.\nIhr müsst dafür nicht einmal Moosburg verlassen.",
    infoText: "Seit mehr als 45 Jahren gehört Barbaras Bücherstube zum Moosburger Stadtbild.<br/><br/>Die Buchhandlung ist weit mehr als ein Geschäft. Sie ist Treffpunkt für Leserinnen und Leser, Ort für Entdeckungen und Ansprechpartner für alle, die gerne in Geschichten eintauchen.<br/><br/>Zwischen den Regalen warten tausende Abenteuer, spannende Begegnungen und neue Perspektiven. Ganz ohne Kofferpacken."
  },
  {
    id: 15,
    name: "15. Zum Hirschn", 
    code: "hirschn123",
    question: "Die nächste Station hat ihren Namen nicht von einem Musikinstrument, obwohl dort regelmäßig Musik erklingt.\nJazz, Sandwiches und kalte Getränke. Der Name dieses Hauses hat vier Beine und ein Geweih.",
    infoText: "Das Zum Hirschn ist seit vielen Jahren ein beliebter Treffpunkt für Menschen jeden Alters.<br/><br/>Besonders bekannt ist die Verbindung zum Jazz Club Hirsch, der das kulturelle Leben Moosburgs mit Konzerten und Veranstaltungen bereichert."
  },
  {
    id: 16,
    name: "16. Moosi",
    code: "moosi456",
    question: "Für die nächste Station geht es ein paar Stufen nach unten.\nWer hier landen will, muss erst ein paar Stufen überwinden. Danach wird es meistens geselliger.",
    infoText: "Das Moosi gehört zu den jüngsten Lokalen Moosburgs und hat erst 2026 seine Türen geöffnet.<br/><br/>Alteingesessene Moosburger erinnern sich vielleicht noch daran, dass sich hier früher das „Sowieso“ befand. Wer also beim Lesen von „Irgendwie und Sowieso“ ein kleines Déjà-vu hat, liegt vermutlich gar nicht so falsch.<br/><br/>Heute ist das Moosi ein Treffpunkt für alle, die in entspannter Atmosphäre zusammensitzen, etwas trinken und den Abend genießen möchten."
  },
  {
    id: 17,
    name: "17. Corner House",
    code: "cornerhouse999",
    question: "Die nächste Station liegt geografisch in Moosburg, kulturell aber ein gutes Stück weiter westlich.\nIrland liegt nicht in Oberbayern. Zumindest eigentlich nicht.",
    infoText: "Das Corner House bringt ein Stück irische Pub-Kultur nach Moosburg.<br/><br/>Neben Burgern, Guinness und Live-Sport finden hier regelmäßig Konzerte, Veranstaltungen und das beste Pub Quiz der Welt (in Moosburg) statt. Zumindest sind sich darüber alle einig, die das Quiz veranstalten.<br/><br/>Das Pub Quiz lockt seit Jahren Ratefüchse, Besserwisser, Halbwissende und Menschen an, die eigentlich nur auf ein Feierabendbier vorbeischauen wollten.<br/><br/>Und ganz nebenbei entstand hier auch die Idee zur ersten Moosburger Stadtrallye. Was ursprünglich als kleine Sommerbeschäftigung für die Quiz-Teams gedacht war, entwickelte sich Schritt für Schritt zu diesem Projekt."
  }
];

export default function App() {
  // --- DEMO MODUS LOGIK ---
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('demo') === '1') localStorage.setItem('demo_mode', '1');
  if (urlParams.get('demo') === '0') localStorage.removeItem('demo_mode');
  const isDemoMode = localStorage.getItem('demo_mode') === '1';

  const [teamName, setTeamName] = useState('');
  const [participationChoice, setParticipationChoice] = useState(null); 
  const [teamPin, setTeamPin] = useState(''); 
  
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [stationState, setStationState] = useState('SEEKING'); 
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [quereinsteigerCode, setQuereinsteigerCode] = useState(null);
  const [showQuereinsteigerIntro, setShowQuereinsteigerIntro] = useState(false);
  
  const [uploadedPhotos, setUploadedPhotos] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // LOGIK FÜR CO-RECOVERY (NOTFALL-PIN)
  const [teamToRestore, setTeamToRestore] = useState(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  
  // LIVE COUNTDOWN STATES
  const [isRallyActive, setIsRallyActive] = useState(isDemoMode || new Date() >= START_DATE);
  const [countdownText, setCountdownText] = useState('');

  // PWA / INSTALL STATES
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  // ADMIN STATES
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminTeams, setAdminTeams] = useState([]);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // LOGIK: LADEN, RESET, COUNTDOWN & PWA
  useEffect(() => {
    document.title = "Stadtrallye 2026";

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsStandalone(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setIsIOS(true);
    }

    const currentUrlParams = new URLSearchParams(window.location.search);
    
    if (currentUrlParams.get('admin') === 'boss') {
      setIsAdminView(true);
      fetchAdminData();
      return;
    }

    if (currentUrlParams.get('reset') === 'boss') {
      localStorage.clear();
      window.location.href = window.location.pathname;
      return;
    }

    const savedTeam = localStorage.getItem('quiz_team_name');
    const savedChoice = localStorage.getItem('quiz_participation_choice');
    const savedProgress = localStorage.getItem('quiz_team_progress');
    const savedState = localStorage.getItem('quiz_station_state');
    const savedPin = localStorage.getItem('quiz_team_pin');
    
    if (savedTeam && savedChoice) {
      setTeamName(savedTeam);
      setParticipationChoice(parseInt(savedChoice, 10));
      setTeamPin(savedPin || '----');
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

    const scannedCode = currentUrlParams.get('code');
    if (scannedCode) {
      if (!savedTeam) {
        setQuereinsteigerCode(scannedCode);
        setShowQuereinsteigerIntro(true);
      } else {
        handleScannedCode(scannedCode, currentIndex, savedState || 'SEEKING');
      }
    }

    const timer = setInterval(() => {
      if (isDemoMode) {
        clearInterval(timer);
        return;
      }

      const now = new Date();
      if (now >= START_DATE) {
        setIsRallyActive(true);
        clearInterval(timer);
      } else {
        const diff = START_DATE - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setCountdownText(`${days}t ${hours}std ${minutes}min ${seconds}sek`);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isDemoMode]);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSHint(!showIOSHint); 
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

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
            localStorage.clear();
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
    setTeamToRestore(null);
    setPinError(false);

    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();

    try {
      const response = await fetch("https://moosburg-ralley-api.andreas-stetter73.workers.dev/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          team: teamName.trim(), 
          choice: participationChoice,
          pin: generatedPin 
        })
      });

      if (response.status === 409) {
        try {
          const adminRes = await fetch("https://moosburg-ralley-api.andreas-stetter73.workers.dev/api/admin/teams");
          if (adminRes.ok) {
            const teams = await adminRes.json();
            const existingTeam = teams.find(t => t.originalName.toLowerCase() === teamName.trim().toLowerCase());
            if (existingTeam) {
              setTeamToRestore(existingTeam);
              return; 
            }
          }
        } catch (fError) {
          console.error(fError);
        }
        setErrorMessage("Dieser Teamname ist bereits vergeben!");
        return;
      }

      if (!response.ok) {
        setErrorMessage("Fehler bei der Kommunikation mit Server.");
        return;
      }

      localStorage.setItem('quiz_team_name', teamName.trim());
      localStorage.setItem('quiz_participation_choice', participationChoice.toString());
      localStorage.setItem('quiz_team_progress', '0');
      localStorage.setItem('quiz_station_state', 'SEEKING');
      localStorage.setItem('quiz_team_pin', generatedPin);
      
      setTeamPin(generatedPin);
      setIsRegistered(true);
      setShowQuereinsteigerIntro(false);

      if (quereinsteigerCode) {
        handleScannedCode(quereinsteigerCode, 0, 'SEEKING');
      }
    } catch (error) {
      setErrorMessage("Netzwerkfehler! Überprüft eure Internetverbindung.");
    }
  };

  const handleRestoreTeam = () => {
    if (!teamToRestore) return;

    if (enteredPin.trim() !== teamToRestore.pin) {
      setPinError(true);
      return;
    }

    localStorage.setItem('quiz_team_name', teamToRestore.originalName);
    localStorage.setItem('quiz_participation_choice', teamToRestore.choice.toString());
    localStorage.setItem('quiz_team_progress', teamToRestore.progress.toString());
    localStorage.setItem('quiz_station_state', 'SEEKING'); 
    localStorage.setItem('quiz_team_pin', teamToRestore.pin);

    setTeamName(teamToRestore.originalName);
    setParticipationChoice(teamToRestore.choice);
    setCurrentStationIndex(teamToRestore.progress);
    setTeamPin(teamToRestore.pin);
    setStationState('SEEKING');

    setIsRegistered(true);
    setShowQuereinsteigerIntro(false);
    setTeamToRestore(null);
    setEnteredPin('');
    setPinError(false);
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
      console.error("Fortschritt konnte nicht mit Server synchronisiert werden.", error);
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

  const InstallBanner = () => {
    if (isStandalone) return null; 
    const isWebView = /Instagram|FBAV|FBAN|SamsungBrowser/i.test(navigator.userAgent);
    
    if (isWebView) {
      return (
        <div style={{...styles.installBanner, borderLeft: '4px solid #cc0000'}}>
          <p style={{fontSize: '13px', color: '#333'}}>
            Du benutzt einen Browser (z. B. Samsung Internet oder Instagram), der App-Installationen aktuell fehlerhaft verarbeitet. Bitte öffne diese Seite in <strong>Google Chrome</strong> oder <strong>Safari</strong>, um die Stadtrallye sicher zu installieren.
          </p>
        </div>
      );
    }

    if (!isIOS && !deferredPrompt) return null; 

    return (
      <div style={styles.installBanner}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div>
            <strong style={{display: 'block', color: '#0B2846'}}>App installieren</strong>
            <span style={{fontSize: '12px', color: '#666'}}>Füge die Stadtrallye zum Startbildschirm hinzu!</span>
          </div>
          <button onClick={handleInstallClick} style={styles.installBtn}>Installieren</button>
        </div>
        {showIOSHint && (
          <div style={styles.iosHintBox}>
            Tippe in Safari unten auf das <strong>Teilen-Symbol</strong> (Viereck mit Pfeil nach oben) und wähle dann <strong>"Zum Home-Bildschirm"</strong> aus.
          </div>
        )}
      </div>
    );
  };

  // --- UI RENDERING ---

  if (isAdminView) {
    return (
      <div style={{...styles.container, maxWidth: '900px'}}>
        <h1 style={styles.title}>Moosburger Stadtrallye - Admin</h1>
        {errorMessage && <div style={styles.error}>{errorMessage}</div>}
        
        <div style={styles.card}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{marginTop: 0, marginBottom: 0, color: '#0B2846'}}>Registrierte Teams ({adminTeams.length})</h2>
            <button onClick={fetchAdminData} style={{padding: '8px 16px', backgroundColor: '#66B014', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}} disabled={isLoadingAdmin}>
              {isLoadingAdmin ? 'Lädt...' : '🔄 Aktualisieren'}
            </button>
          </div>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left'}}>
              <thead>
                <tr style={{backgroundColor: '#eef2f5'}}>
                  <th style={styles.th}>Teamname</th>
                  <th style={styles.th}>PIN</th>
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
                    <tr key={idx} style={{borderBottom: '1px dashed #ccc'}}>
                      <td style={styles.td}><strong>{team.originalName}</strong></td>
                      <td style={styles.td}><code style={{backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold'}}>{team.pin || team.PIN || '----'}</code></td>
                      <td style={styles.td}>
                        <span style={{backgroundColor: '#0B2846', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', color: '#fff'}}>
                          {team.progress} / {STATIONS.length}
                        </span>
                      </td>
                      <td style={styles.td}>{canUpload ? '✅' : '❌'}</td>
                      <td style={styles.td}>{canSocialMedia ? '✅' : '❌'}</td>
                      <td style={styles.td}>{new Date(team.registeredAt).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</td>
                      <td style={styles.td}>
                        <button onClick={() => handleAdminAction(team.originalName, 'reset')} style={styles.actionBtn} title="Fortschritt auf 0 setzen">🔄</button>
                        <button onClick={() => handleAdminAction(team.originalName, 'delete')} style={styles.actionBtn} title="Team löschen">🗑️</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div style={styles.footer}>
          <a href="https://www.instagram.com/moosburgrallye/" target="_blank" rel="noopener noreferrer" style={{...styles.footerLink, color: '#E1306C'}}>Instagram</a> | 
          <a href="/impressum.html" style={styles.footerLink}>Impressum</a> | 
          <a href="/privacy.html" style={styles.footerLink}>Datenschutz</a>
        </div>
        <div style={styles.partnerLogoWrapper}>
          <span style={styles.partnerLabel}>Powered by The Corner House</span>
          <img src="/logo_ch.png" alt="Partner" style={styles.partnerLogo} />
        </div>
      </div>
    );
  }

  if (showQuereinsteigerIntro) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Moosburger Stadtrallye</h1>
        <div style={styles.card}>
          <h2 style={{marginTop: 0, color: '#0B2846'}}>Hallo und willkommen! 👋</h2>
          <div style={styles.dashedLine}></div>
          <p style={styles.text}>Du hast einen QR-Code der Stadtrallye gescannt. Bevor es losgeht, musst du schnell ein Team anlegen.</p>
          <button onClick={() => setShowQuereinsteigerIntro(false)} style={styles.button}>Weiter zur Anmeldung</button>
        </div>
        <div style={styles.footer}>
          <a href="https://www.instagram.com/moosburgrallye/" target="_blank" rel="noopener noreferrer" style={{...styles.footerLink, color: '#E1306C'}}>Instagram</a> | 
          <a href="/impressum.html" style={styles.footerLink}>Impressum</a> | 
          <a href="/privacy.html" style={styles.footerLink}>Datenschutz</a>
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
        <h1 style={styles.title}>Moosburger<br/><span style={{color: '#66B014'}}>Stadtrallye</span></h1>
        
        <InstallBanner />
        
        {errorMessage && <div style={styles.error}>{errorMessage}</div>}
        
        <div style={styles.card}>
          <h2 style={{marginTop: 0, color: '#0B2846', textAlign: 'center'}}>Rätseln. Entdecken. Gewinnen.</h2>
          <div style={styles.dashedLine}></div>
          <p style={styles.text}>
            Willkommen bei der ersten Moosburger Stadtrallye! Um mitzumachen, registriert euch mit eurem Teamnamen (keine E-Mail-Adresse und kein Login erforderlich) und legt los.
          </p>
          <p style={styles.text}>
            Entschlüsselt die Hinweise, findet die versteckten QR-Codes an den Stationen und erreicht das Ziel. Um euren Fortschritt zu dokumentieren, ladet ihr an jedem Ort ein lustiges Gruppenbild von euch hoch.
          </p>
          
          <div style={styles.dateBox}>
            <p style={{margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#fff'}}>📅 6. - 12. JULI 2026</p>
            <p style={{margin: '0', fontSize: '14px', color: '#fff', textTransform: 'uppercase'}}>Eine Woche. Deine Stadt. Dein Abenteuer.</p>
          </div>
          
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Euer Teamname" value={teamName} onChange={(e) => setTeamName(e.target.value)} style={styles.input} required disabled={!!teamToRestore} />
            
            {!teamToRestore && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px', backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #eee'}}>
                <label style={styles.radioLabel}>
                  <input type="radio" name="participation" value="1" onChange={() => setParticipationChoice(1)} required />
                  <span>Wir wollen an der <strong>Verlosung der Preise</strong> teilnehmen und stimmen der Bildveröffentlichung zu. (<a href="/privacy.html" target="_blank" rel="noopener noreferrer" style={{color: '#0B2846'}}>Datenschutz</a>)</span>
                </label>
                <label style={styles.radioLabel}>
                  <input type="radio" name="participation" value="2" onChange={() => setParticipationChoice(2)} />
                  <span>Wir wollen an der Verlosung teilnehmen, stimmen der Bildveröffentlichung aber <strong>nicht</strong> zu. (Bilder dienen nur als Beweis).</span>
                </label>
                <label style={styles.radioLabel}>
                  <input type="radio" name="participation" value="3" onChange={() => setParticipationChoice(3)} />
                  <span>Wir wollen keine Bilder hochladen und <strong>nicht</strong> an der Verlosung teilnehmen. (Just for fun!)</span>
                </label>
              </div>
            )}
            
            {teamToRestore ? (
              <div style={{...styles.infoBox, backgroundColor: '#fff3cd', border: '2px solid #ffc107', padding: '20px', borderRadius: '8px', textAlign: 'left'}}>
                <p style={{margin: '0 0 12px 0', color: '#856404', fontWeight: 'bold'}}>Dieser Teamname existiert bereits!</p>
                <p style={{margin: '0 0 15px 0', fontSize: '13px', color: '#666', lineHeight: '1.4'}}>
                  Um den bestehenden Spielstand (Station {Math.min(teamToRestore.progress + 1, STATIONS.length)}) auf diesem Gerät fortzusetzen, gebt bitte eure 4-stellige Notfall-PIN ein:
                </p>
                <input type="number" placeholder="4-stellige PIN" value={enteredPin} onChange={(e) => setEnteredPin(e.target.value)} style={{...styles.input, marginBottom: '10px', textAlign: 'center', letterSpacing: '5px', fontSize: '20px'}} />
                
                {pinError && <p style={{color: '#cc0000', fontSize: '13px', margin: '0 0 10px 0', fontWeight: 'bold'}}>Falsche PIN! Bitte versucht es erneut.</p>}
                
                <button type="button" onClick={handleRestoreTeam} style={{...styles.button, backgroundColor: '#0B2846', color: '#fff', fontSize: '15px', padding: '12px'}}>
                  Spielstand laden 🔄
                </button>
                
                <p style={{fontSize: '11px', color: '#777', marginTop: '15px', lineHeight: '1.3', fontStyle: 'italic'}}>
                  Die PIN kann bei Verlust beim Veranstalter neu angefordert werden. Kontaktdaten siehe Impressum.
                </p>
                
                <button type="button" onClick={() => { setTeamToRestore(null); setEnteredPin(''); setPinError(false); }} style={{background: 'none', border: 'none', color: '#666', marginTop: '15px', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px', display: 'block', width: '100%', textAlign: 'center'}}>
                  Abbrechen / Anderen Namen wählen
                </button>
              </div>
            ) : (
              <button type="submit" style={{...styles.button, opacity: participationChoice ? 1 : 0.5}} disabled={!participationChoice}>
                {isRallyActive ? 'Rallye jetzt starten!' : 'Team vorab registrieren'}
              </button>
            )}
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={{marginTop: 0, color: '#0B2846', textAlign: 'center'}}>FAQ - Häufige Fragen</h2>
          <div style={styles.dashedLine}></div>
          <details style={styles.faqItem}><summary style={styles.faqSummary}>Was kostet die Teilnahme?</summary><div style={styles.faqContent}>Die Teilnahme an der Moosburger Stadtrallye ist völlig kostenlos!</div></details>
          <details style={styles.faqItem}><summary style={styles.faqSummary}>Müssen wir alles an einem Tag schaffen?</summary><div style={styles.faqContent}>Nein. Ihr habt vom 6. bis zum 12. Juli Zeit. Euer Fortschritt wird auf eurem Gerät gespeichert. Ihr könnt jederzeit pausieren und an einem anderen Tag weitermachen.</div></details>
          <details style={styles.faqItem}><summary style={styles.faqSummary}>Was brauche ich zum Mitmachen?</summary><div style={styles.faqContent}>Nur ein Smartphone mit Internetverbindung, eine funktionierende Kamera für die Beweisfotos und gute Laune!</div></details>
          <details style={styles.faqItem}><summary style={styles.faqSummary}>Was gibt es zu gewinnen?</summary><div style={styles.faqContent}>Dank unserer fantastischen Sponsoren (The Corner House, Modehaus Heilingbrunner, Barbaras Bücherstube, Josef Gerlspeck, DAV Kletterhalle) warten großartige Gutscheine und Sachpreise auf die Gewinnerteams!</div></details>
        </div>

        <div style={styles.footer}>
          <a href="https://www.instagram.com/moosburgrallye/" target="_blank" rel="noopener noreferrer" style={{...styles.footerLink, color: '#E1306C'}}>Instagram</a> | 
          <a href="/impressum.html" style={styles.footerLink}>Impressum</a> | 
          <a href="/privacy.html" style={styles.footerLink}>Datenschutz</a>
        </div>

        <div style={styles.partnerLogoWrapper}>
          <span style={styles.partnerLabel}>Powered by The Corner House</span>
          <img src="/logo_ch.png" alt="Partner" style={styles.partnerLogo} />
        </div>
      </div>
    );
  }

  if (isRegistered && !isRallyActive) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Moosburger<br/><span style={{color: '#66B014'}}>Stadtrallye</span></h1>
        
        <InstallBanner />

        <div style={styles.card}>
          <h2 style={{textAlign: 'center', color: '#0B2846', marginTop: 0}}>Anmeldung erfolgreich! 🎉</h2>
          <div style={styles.dashedLine}></div>
          <p style={styles.text}>Euer Team <strong>{teamName}</strong> ist im System registriert und startklar.</p>
          
          <div style={{backgroundColor: '#fff7cd', border: '1px solid #ffc107', padding: '15px', borderRadius: '8px', textAlign: 'center', margin: '20px 0'}}>
            <span style={{fontSize: '12px', textTransform: 'uppercase', color: '#856404', fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>🔒 Eure persönliche Notfall-PIN:</span>
            <span style={{fontSize: '28px', fontWeight: '900', letterSpacing: '4px', color: '#0B2846'}}>{teamPin}</span>
            <p style={{fontSize: '11px', color: '#666', margin: '8px 0 0 0', lineHeight: '1.4'}}>
              Macht jetzt einen <strong>Screenshot</strong>! Diese PIN braucht ihr, falls euer Akku leer geht oder ihr das Gerät wechseln müsst.
            </p>
          </div>

          <p style={styles.text}>Aktuell befindet sich die Rallye noch in der Vorbereitungsphase. Pünktlich am <strong>06. Juli um 00:00 Uhr</strong> wird genau auf dieser Seite euer allererster Hinweis freigeschaltet!</p>
          
          <div style={styles.countdownBox}>
            <div style={{fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#0B2846', marginBottom: '5px'}}>Startet in:</div>
            <div style={{fontSize: '22px', fontWeight: 'bold', color: '#66B014'}}>{countdownText || 'Lädt...'}</div>
          </div>
          
          <div style={{backgroundColor: '#ffe8f0', border: '1px solid #ffb3c6', padding: '15px', borderRadius: '8px', textAlign: 'center', marginTop: '20px'}}>
            <span style={{fontSize: '15px', display: 'block', marginBottom: '5px', color: '#E1306C', fontWeight: 'bold'}}>📷 Folgt uns auf Instagram!</span>
            <p style={{fontSize: '13px', color: '#666', margin: '0 0 12px 0', lineHeight: '1.4'}}>Verpasst keine Updates und schaut euch an, was die anderen Teams zur Vorbereitung treiben.</p>
            <a href="https://www.instagram.com/moosburgrallye/" target="_blank" rel="noopener noreferrer" style={{...styles.button, backgroundColor: '#E1306C', padding: '10px 15px', fontSize: '14px', display: 'inline-block', textDecoration: 'none', width: 'auto'}}>@moosburgrallye besuchen</a>
          </div>

          <p style={{fontSize: '13px', color: '#666', textAlign: 'center', fontStyle: 'italic', marginTop: '20px'}}>Speichert euch diese Seite als Lesezeichen oder ladet sie als App herunter.</p>
        </div>

        <div style={styles.footer}>
          <a href="https://www.instagram.com/moosburgrallye/" target="_blank" rel="noopener noreferrer" style={{...styles.footerLink, color: '#E1306C'}}>Instagram</a> | 
          <a href="/impressum.html" style={styles.footerLink}>Impressum</a> | 
          <a href="/privacy.html" style={styles.footerLink}>Datenschutz</a>
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
        <h1 style={styles.title}>Moosburger<br/><span style={{color: '#66B014'}}>Stadtrallye</span></h1>
        <div style={styles.card}>
          <h2 style={{textAlign: 'center', color: '#0B2846', marginTop: '0'}}>🎉 ZIEL ERREICHT! 🎉</h2>
          <div style={styles.dashedLine}></div>
          <p style={{...styles.text, textAlign: 'center', fontSize: '18px', fontWeight: 'bold'}}>Herzlichen Glückwunsch, Team {teamName}!</p>
          <p style={{...styles.text, textAlign: 'center'}}>Ihr habt alle Rätsel gelöst und Moosburg neu entdeckt. Kommt zur Theke im Corner House und feiert euren Erfolg!</p>
          
          <div style={{backgroundColor: '#ffe8f0', border: '1px solid #ffb3c6', padding: '20px', borderRadius: '8px', textAlign: 'center', margin: '25px 0'}}>
            <p style={{margin: '0 0 10px 0', color: '#E1306C', fontWeight: 'bold', fontSize: '18px'}}>📸 Teilt euren Erfolg!</p>
            <p style={{fontSize: '14px', color: '#666', margin: '0 0 15px 0'}}>Postet eure besten Bilder der Rallye, markiert uns und feiert euren Sieg mit der ganzen Stadt.</p>
            <a href="https://www.instagram.com/moosburgrallye/" target="_blank" rel="noopener noreferrer" style={{...styles.button, backgroundColor: '#E1306C', padding: '12px', fontSize: '15px', display: 'block', textDecoration: 'none', textAlign: 'center'}}>Zu Instagram ➔</a>
          </div>

        </div>
        <div style={styles.footer}>
          <a href="https://www.instagram.com/moosburgrallye/" target="_blank" rel="noopener noreferrer" style={{...styles.footerLink, color: '#E1306C'}}>Instagram</a> | 
          <a href="/impressum.html" style={styles.footerLink}>Impressum</a> | 
          <a href="/privacy.html" style={styles.footerLink}>Datenschutz</a>
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
      <h1 style={styles.title}>Moosburger<br/><span style={{color: '#66B014', fontSize: '22px'}}>Stadtrallye</span></h1>
      <div style={styles.header}>
        <span>Team: <strong>{teamName}</strong> (PIN: {teamPin})</span>
        <span>Station {currentStationIndex + 1} / {STATIONS.length}</span>
      </div>

      {errorMessage && <div style={styles.error}>{errorMessage}</div>}

      <div style={styles.card}>
        {stationState === 'SEEKING' && (
          <div>
            {currentStationIndex === 0 && (
              <div style={{backgroundColor: '#fff7cd', border: '1px solid #ffc107', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px'}}>
                <span style={{fontSize: '12px', textTransform: 'uppercase', color: '#856404', fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>🔒 Eure persönliche Notfall-PIN:</span>
                <span style={{fontSize: '28px', fontWeight: '900', letterSpacing: '4px', color: '#0B2846'}}>{teamPin}</span>
                <p style={{fontSize: '11px', color: '#666', margin: '8px 0 0 0', lineHeight: '1.4'}}>
                  Macht jetzt einen <strong>Screenshot</strong>! Diese PIN braucht ihr, falls euer Akku leer geht oder ihr das Gerät wechseln müsst.
                </p>
              </div>
            )}

            <h2 style={{marginTop: '0', color: '#0B2846', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{fontSize: '24px'}}>📍</span> Finde Station {currentStationIndex + 1}
            </h2>
            <div style={styles.dashedLine}></div>
            <p style={styles.text}><strong>Euer Hinweis:</strong></p>
            <p style={{...styles.text, fontSize: '16px', backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #66B014', whiteSpace: 'pre-line'}}>{currentStation.question}</p>
            <img src={`/Hint_Station_${currentStation.id}.png`} alt={`Hinweis`} style={styles.hintImage} onError={(e) => e.target.style.display = 'none'} />
            <div style={styles.infoBox}>Sucht an diesem Ort nach dem QR-Code und scannt ihn!</div>
          </div>
        )}

        {stationState === 'FOUND' && (
          <div>
            <h2 style={{marginTop: '0', color: '#66B014', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{fontSize: '24px'}}>✅</span> Station gefunden!
            </h2>
            <div style={styles.dashedLine}></div>
            <h3 style={{marginTop: 0, color: '#0B2846'}}>{currentStation.name}</h3>
            <div style={{...styles.text, backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #eeefixed'}} dangerouslySetInnerHTML={{ __html: currentStation.infoText }} />
            
            <img src={`/Info_Station_${currentStation.id}.png`} alt={`Zusatzgrafik`} style={styles.hintImage} onError={(e) => e.target.style.display = 'none'} />
            
            {uploadRequired ? (
              <div style={styles.uploadSection}>
                <h4 style={{marginTop: '0', color: '#0B2846'}}>📸 Fotobeweis hochladen</h4>
                <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, currentStation.id)} disabled={isUploading} style={{marginBottom: '10px'}} />
                {isUploading && <p style={{color: '#66B014', fontSize: '14px', fontWeight: 'bold'}}>Bild wird hochgeladen... ⏳</p>}
                {photoUploaded && !isUploading && <img src={photoUploaded} alt="Beweis" style={styles.previewImage} />}
              </div>
            ) : (
              <p style={{fontSize: '13px', color: '#666', fontStyle: 'italic', textAlign: 'center', backgroundColor: '#eee', padding: '10px', borderRadius: '5px'}}>Kein Bild-Upload erforderlich.</p>
            )}
            <button onClick={handleNextStation} style={{...styles.button, marginTop: '20px', backgroundColor: canProceed ? '#66B014' : '#ccc', color: canProceed ? '#fff' : '#666'}} disabled={!canProceed}>
              Weiter zur nächsten Station
            </button>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <a href="https://www.instagram.com/moosburgrallye/" target="_blank" rel="noopener noreferrer" style={{...styles.footerLink, color: '#E1306C'}}>Instagram</a> | 
        <a href="/impressum.html" style={styles.footerLink}>Impressum</a> | 
        <a href="/privacy.html" style={styles.footerLink}>Datenschutz</a>
      </div>

      <div style={styles.partnerLogoWrapper}>
        <span style={styles.partnerLabel}>Powered by The Corner House</span>
        <img src="/logo_ch.png" alt="Partner" style={styles.partnerLogo} />
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px 20px 140px 20px', maxWidth: '500px', margin: '0 auto', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', minHeight: '100vh', position: 'relative', backgroundColor: '#F5F3EB' },
  title: { textAlign: 'center', color: '#0B2846', fontSize: '32px', marginTop: '10px', marginBottom: '20px', textTransform: 'uppercase', lineHeight: '1.1', fontWeight: '900', letterSpacing: '1px' },
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(11, 40, 70, 0.08)', marginBottom: '20px', border: '1px solid rgba(11, 40, 70, 0.05)' },
  dashedLine: { height: '0', borderBottom: '2px dashed #0B2846', opacity: '0.2', margin: '15px 0' },
  text: { lineHeight: '1.6', color: '#333', fontSize: '15px', margin: '0 0 15px 0' },
  dateBox: { backgroundColor: '#0B2846', color: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.1)' },
  countdownBox: { backgroundColor: '#fff', border: '2px solid #66B014', padding: '20px', borderRadius: '8px', textAlign: 'center', margin: '25px 0' },
  input: { width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '2px solid #eee', fontSize: '16px', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s' },
  radioLabel: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', lineHeight: '1.4', color: '#444', cursor: 'pointer' },
  button: { width: '100%', padding: '16px', backgroundColor: '#66B014', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 0 #4f8c0e', transition: 'transform 0.1s, box-shadow 0.1s' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '12px 15px', backgroundColor: '#0B2846', color: '#fff', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: 'bold' },
  error: { backgroundColor: '#ffe0e0', color: '#cc0000', padding: '12px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' },
  uploadSection: { marginTop: '20px', borderTop: '2px dashed #eee', paddingTop: '20px' },
  previewImage: { width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px', border: '2px solid #eee' },
  hintImage: { width: '100%', borderRadius: '8px', marginTop: '15px', marginBottom: '15px', border: '2px solid #eee' },
  infoBox: { backgroundColor: '#eef2f5', padding: '15px', borderRadius: '8px', fontSize: '14px', textAlign: 'center', color: '#0B2846', fontWeight: 'bold' },
  installBanner: { backgroundColor: '#eef2f5', borderLeft: '4px solid #66B014', padding: '15px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  installBtn: { backgroundColor: '#0B2846', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' },
  iosHintBox: { marginTop: '12px', fontSize: '13px', color: '#333', backgroundColor: '#fff', padding: '10px', borderRadius: '5px', border: '1px dashed #ccc' },
  faqItem: { borderBottom: '1px solid #eee', padding: '10px 0' },
  faqSummary: { fontWeight: 'bold', color: '#0B2846', cursor: 'pointer', outline: 'none', fontSize: '15px', padding: '5px 0' },
  faqContent: { padding: '10px 0 5px 0', fontSize: '14px', color: '#444', lineHeight: '1.5' },
  th: { padding: '12px', borderBottom: '2px solid #0B2846', color: '#0B2846' },
  td: { padding: '12px', color: '#333' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', margin: '0 5px' },
  footer: { textAlign: 'center', marginTop: '30px', paddingBottom: '20px', fontSize: '13px', color: '#888' },
  footerLink: { color: '#0B2846', textDecoration: 'none', fontWeight: 'bold', margin: '0 10px' },
  partnerLogoWrapper: { position: 'fixed', bottom: '20px', right: '20px', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', padding: '10px 20px', borderRadius: '30px', boxShadow: '0 3px 10px rgba(0,0,0,0.15)', zIndex: 100 },
  partnerLabel: { fontSize: '16px', color: '#333', marginRight: '12px', fontWeight: 'bold' },
  partnerLogo: { maxHeight: '60px', maxWidth: '150px' }
};
