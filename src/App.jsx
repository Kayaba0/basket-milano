import React, { useEffect, useMemo, useState } from 'react';
import { courts as baseCourts, getNextDays } from './data/courts';

const nextDays = getNextDays(7);
const STORAGE_KEYS = {
  theme: 'playground-theme',
  courts: 'playground-admin-courts',
  adminAuth: 'playground-admin-auth',
};
const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin' };

const getInitialTheme = () => {
  const saved = window.localStorage.getItem(STORAGE_KEYS.theme);
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const parseRoute = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    courtId: params.get('court') || null,
    admin: params.get('admin') === '1',
  };
};

const readStoredCourts = () => {
  const raw = window.localStorage.getItem(STORAGE_KEYS.courts);
  if (!raw) return baseCourts;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : baseCourts;
  } catch {
    return baseCourts;
  }
};

const saveCourts = (value) => {
  window.localStorage.setItem(STORAGE_KEYS.courts, JSON.stringify(value));
};

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const getGallery = (court) => {
  const fallback = [court.coverImage, '/assets/court-hero.jpg', '/assets/players-city.jpg', '/assets/night-play.jpg'];
  const images = (court.gallery || []).filter(Boolean);
  return [...images, ...fallback].slice(0, 4);
};

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const emptyCourtForm = {
  id: '',
  name: '',
  district: '',
  address: '',
  summary: '',
  latitude: '45.4642',
  longitude: '9.1900',
  pros: '',
  cons: '',
  gallery: '',
  coverImage: '/assets/court-hero.jpg',
};

const toFormState = (court) => ({
  id: court.id,
  name: court.name,
  district: court.district,
  address: court.address,
  summary: court.summary,
  latitude: String(court.latitude ?? 45.4642),
  longitude: String(court.longitude ?? 9.19),
  pros: court.pros.join('\n'),
  cons: court.cons.join('\n'),
  gallery: court.gallery.join('\n'),
  coverImage: court.coverImage,
});

const fromFormState = (form, existingCourt) => {
  const id = form.id?.trim() || slugify(form.name) || `court-${Date.now()}`;
  const gallery = form.gallery
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    ...(existingCourt || {}),
    id,
    name: form.name.trim(),
    district: form.district.trim(),
    address: form.address.trim(),
    summary: form.summary.trim(),
    latitude: Number.parseFloat(form.latitude) || 45.4642,
    longitude: Number.parseFloat(form.longitude) || 9.19,
    pros: form.pros
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    cons: form.cons
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    gallery: gallery.length ? gallery.slice(0, 4) : existingCourt?.gallery || ['/assets/court-hero.jpg'],
    coverImage: form.coverImage.trim() || gallery[0] || existingCourt?.coverImage || '/assets/court-hero.jpg',
    reports: existingCourt?.reports || [],
    wall: existingCourt?.wall || [],
    presence: existingCourt?.presence || Object.fromEntries(nextDays.map((day) => [day.key, []])),
  };
};


const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const normalizeDroppedFiles = async (fileList) => {
  const files = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'));
  const converted = await Promise.all(files.map(fileToDataUrl));
  return converted;
};

const MapEmbed = ({ court }) => {
  const lat = Number(court.latitude ?? 45.4642);
  const lng = Number(court.longitude ?? 9.19);
  const bbox = `${lng - 0.008}%2C${lat - 0.006}%2C${lng + 0.008}%2C${lat + 0.006}`;
  const marker = `${lat}%2C${lng}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <article className="field-bubble map-bubble">
      <div className="field-section-head split align-start">
        <div>
          <p className="eyebrow">posizione</p>
          <h4>Mappa del campo</h4>
        </div>
        <a className="ghost-pill compact" href={mapsUrl} target="_blank" rel="noreferrer">
          Apri su Maps
        </a>
      </div>
      <div className="map-frame-wrap">
        <iframe title={`Mappa ${court.name}`} src={mapSrc} loading="lazy" className="map-frame" />
      </div>
    </article>
  );
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [search, setSearch] = useState('');
  const [route, setRoute] = useState(parseRoute());
  const [selectedDateKey, setSelectedDateKey] = useState(nextDays[0].key);
  const [courts, setCourts] = useState(baseCourts);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminForm, setAdminForm] = useState({ username: '', password: '' });
  const [editingCourtId, setEditingCourtId] = useState(baseCourts[0]?.id || null);
  const [courtForm, setCourtForm] = useState(emptyCourtForm);
  const [isDraggingMedia, setIsDraggingMedia] = useState(false);
  const [showPresenceModal, setShowPresenceModal] = useState(false);
  const [presenceName, setPresenceName] = useState('');

  useEffect(() => {
    setTheme(getInitialTheme());
    setCourts(readStoredCourts());
    setAdminAuthenticated(window.localStorage.getItem(STORAGE_KEYS.adminAuth) === '1');
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute());
      setSelectedDateKey(nextDays[0].key);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const updateRoute = (nextParams) => {
    const params = new URLSearchParams();
    if (nextParams.courtId) params.set('court', nextParams.courtId);
    if (nextParams.admin) params.set('admin', '1');
    const query = params.toString();
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.pushState({}, '', nextUrl);
    setRoute({ courtId: nextParams.courtId || null, admin: Boolean(nextParams.admin) });
  };

  const filteredCourts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return courts;
    return courts.filter((court) => `${court.name} ${court.district} ${court.address}`.toLowerCase().includes(term));
  }, [courts, search]);

  const popularCourts = useMemo(
    () =>
      [...courts]
        .sort((a, b) => {
          const aCount = a.presence[nextDays[0].key]?.length ?? 0;
          const bCount = b.presence[nextDays[0].key]?.length ?? 0;
          return bCount - aCount;
        })
        .slice(0, 4),
    [courts],
  );

  const selectedCourt = courts.find((court) => court.id === route.courtId) || courts[0];
  const selectedPresence = selectedCourt?.presence[selectedDateKey] || [];

  const communityItems = useMemo(() => {
    if (!selectedCourt) return [];
    const reportItems = selectedCourt.reports.map((report) => ({
      id: `report-${report.id}`,
      text: report.title ? `${report.title} — ${report.note}` : report.note,
      author: report.author,
    }));

    const wallItems = selectedCourt.wall.map((note, index) => ({
      id: `wall-${index}`,
      text: note.text,
      author: note.author,
    }));

    return [...reportItems, ...wallItems];
  }, [selectedCourt]);

  useEffect(() => {
    const editingCourt = courts.find((court) => court.id === editingCourtId) || courts[0];
    if (editingCourt) setCourtForm(toFormState(editingCourt));
  }, [editingCourtId, courts]);

  const openCourt = (courtId) => {
    updateRoute({ courtId, admin: false });
    setSelectedDateKey(nextDays[0].key);
    setShowPresenceModal(false);
    setPresenceName('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    updateRoute({ courtId: null, admin: false });
    setSelectedDateKey(nextDays[0].key);
    setShowPresenceModal(false);
    setPresenceName('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdmin = () => {
    updateRoute({ courtId: null, admin: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = (event) => {
    event.preventDefault();
    const ok =
      adminForm.username.trim() === ADMIN_CREDENTIALS.username &&
      adminForm.password.trim() === ADMIN_CREDENTIALS.password;
    if (!ok) {
      window.alert('Credenziali demo non corrette. Usa admin / admin');
      return;
    }
    setAdminAuthenticated(true);
    window.localStorage.setItem(STORAGE_KEYS.adminAuth, '1');
  };

  const logoutAdmin = () => {
    setAdminAuthenticated(false);
    window.localStorage.removeItem(STORAGE_KEYS.adminAuth);
    setAdminForm({ username: '', password: '' });
  };

  const resetFormForNewCourt = () => {
    setEditingCourtId(null);
    setCourtForm(emptyCourtForm);
  };

  const handleSaveCourt = (event) => {
    event.preventDefault();
    const existingCourt = courts.find((court) => court.id === editingCourtId) || null;
    const nextCourt = fromFormState(courtForm, existingCourt);
    let nextCourts;

    if (existingCourt) {
      nextCourts = courts.map((court) => (court.id === existingCourt.id ? nextCourt : court));
    } else {
      nextCourts = [nextCourt, ...courts];
      setEditingCourtId(nextCourt.id);
    }

    setCourts(nextCourts);
    saveCourts(nextCourts);
    window.alert('Campo salvato in locale con successo.');
  };

  const loadCourtIntoEditor = (courtId) => {
    setEditingCourtId(courtId);
  };

  const deleteCourt = (courtId) => {
    const confirmed = window.confirm('Vuoi davvero eliminare questo campo dalla demo locale?');
    if (!confirmed) return;
    const nextCourts = courts.filter((court) => court.id !== courtId);
    setCourts(nextCourts);
    saveCourts(nextCourts);
    if (route.courtId === courtId) goHome();
    if (editingCourtId === courtId) {
      if (nextCourts[0]) {
        setEditingCourtId(nextCourts[0].id);
      } else {
        resetFormForNewCourt();
      }
    }
  };

  const galleryPreviewItems = useMemo(
    () =>
      courtForm.gallery
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 4),
    [courtForm.gallery],
  );

  const handlePickedFiles = async (fileList) => {
    const newImages = await normalizeDroppedFiles(fileList);
    if (!newImages.length) return;

    setCourtForm((current) => {
      const existing = current.gallery
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
      const merged = [...existing, ...newImages].slice(0, 4);
      return {
        ...current,
        gallery: merged.join('\n'),
        coverImage: current.coverImage || merged[0] || current.coverImage,
      };
    });
  };

  const handleMediaInputChange = async (event) => {
    await handlePickedFiles(event.target.files);
    event.target.value = '';
  };

  const handleDropMedia = async (event) => {
    event.preventDefault();
    setIsDraggingMedia(false);
    await handlePickedFiles(event.dataTransfer.files);
  };

  const removeGalleryImage = (indexToRemove) => {
    setCourtForm((current) => {
      const existing = current.gallery
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
        .filter((_, index) => index !== indexToRemove);
      const nextCover = current.coverImage === galleryPreviewItems[indexToRemove] ? existing[0] || '' : current.coverImage;
      return {
        ...current,
        gallery: existing.join('\n'),
        coverImage: nextCover,
      };
    });
  };

  const handleAddPresence = (event) => {
    event.preventDefault();
    const cleanName = presenceName.trim();
    if (!cleanName || !selectedCourt) return;

    const alreadyPresent = (selectedCourt.presence[selectedDateKey] || []).some(
      (person) => person.trim().toLowerCase() === cleanName.toLowerCase(),
    );

    if (alreadyPresent) {
      window.alert('Questo nome è già presente per il giorno selezionato.');
      return;
    }

    const nextCourts = courts.map((court) => {
      if (court.id !== selectedCourt.id) return court;
      return {
        ...court,
        presence: {
          ...court.presence,
          [selectedDateKey]: [...(court.presence[selectedDateKey] || []), cleanName],
        },
      };
    });

    setCourts(nextCourts);
    saveCourts(nextCourts);
    setPresenceName('');
    setShowPresenceModal(false);
  };

  const renderHome = () => (
    <>
      <section className="home-hero card surface-hero">
        <div className="hero-copy cleaner">
          <p className="eyebrow accent">campi • presenza • community</p>
          <h2>
            Trova il tuo <span>playground</span> a Milano.
          </h2>
          <p className="hero-text wide">
            Cerca un campo, guarda quelli più attivi e apri la pagina dedicata per vedere presenze, stato del campo e
            aggiornamenti della community.
          </p>
        </div>

        <div className="hero-search-panel">
          <div className="panel-head compact-head">
            <div>
              <h3>Apri un campo</h3>
            </div>
                      </div>

          <label className="search-box home-search-box search-box-prominent search-bar-pill">
            <div className="search-input-shell search-pill-shell">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cerca per nome, zona o indirizzo"
                aria-label="Cerca per nome, zona o indirizzo"
              />
              <span className="search-pill-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
            </div>
          </label>

          <div className="home-court-list">
            {filteredCourts.map((court) => {
              const countToday = court.presence[nextDays[0].key]?.length ?? 0;
              return (
                <button key={court.id} className="home-court-row" type="button" onClick={() => openCourt(court.id)}>
                  <div className="home-court-copy">
                    <strong>{court.name}</strong>
                    <p>
                      {court.district} • {court.address}
                    </p>
                  </div>
                  <span className="participants-badge">
                    <span className="participants-number">{countToday}</span>
                    <span className="participants-label">oggi</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="popular-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow accent">selezione rapida</p>
            <h3>I campi più attivi oggi</h3>
          </div>
        </div>

        <div className="popular-grid">
          {popularCourts.map((court) => {
            const peopleToday = court.presence[nextDays[0].key] || [];
            return (
              <article key={court.id} className="popular-card card bubble-card">
                <img src={court.coverImage} alt={court.name} className="popular-image" />
                <div className="popular-content">
                  <div className="popular-top">
                    <div>
                      <p className="eyebrow">{court.district}</p>
                      <h4>{court.name}</h4>
                    </div>
                    <span className="presence-badge strong">{peopleToday.length} oggi</span>
                  </div>
                  <p className="card-text">{court.summary}</p>
                  <button type="button" className="primary-btn" onClick={() => openCourt(court.id)}>
                    Apri il campo
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );

  const renderField = () => (
    <section className="field-page card">
      <div className="detail-top cleaner-top">
        <div>
          <p className="eyebrow accent">pagina campo</p>
          <h3>{selectedCourt.name}</h3>
          <p className="detail-summary">{selectedCourt.summary}</p>
        </div>
      </div>

      <div className="field-stack">
        <article className="field-bubble field-overview-horizontal">
          <div className="field-image-wrap">
            <img src={selectedCourt.coverImage} alt={selectedCourt.name} className="detail-cover" />
          </div>

          <div className="field-info-wrap">
            <div className="bubble-card info-bubble">
              <span className="eyebrow">indirizzo</span>
              <strong>{selectedCourt.address}</strong>
              <p className="card-text">Pagina dedicata, accesso immediato da QR e overview chiara del playground.</p>
            </div>

            <div className="bubble-card info-bubble">
              <span className="eyebrow">panoramica</span>
              <p className="card-text">
                Campo pensato per aggiornamenti veloci: chi c’è oggi, condizioni reali e segnalazioni utili lasciate dalla
                community sul posto.
              </p>
            </div>

            <div className="bubble-card info-bubble">
              <span className="eyebrow">galleria</span>
              <div className="mini-gallery-grid compact-gallery-grid">
                {getGallery(selectedCourt).map((image, index) => (
                  <img
                    key={`${selectedCourt.id}-gallery-${index}`}
                    src={image}
                    alt={`${selectedCourt.name} galleria ${index + 1}`}
                    className="mini-gallery-image compact-gallery-image"
                  />
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="field-bubble">
          <div className="field-section-head split align-start">
            <div>
              <p className="eyebrow">calendario</p>
              <h4>Presenze per giorno</h4>
            </div>
            <button className="presence-cta-btn" type="button" onClick={() => setShowPresenceModal(true)}>
              <span>Segna presenza</span>
              <strong>+</strong>
            </button>
          </div>

          <div className="calendar-strip">
            {nextDays.map((day) => {
              const count = selectedCourt.presence[day.key]?.length ?? 0;
              return (
                <button
                  key={day.key}
                  className={`day-chip ${selectedDateKey === day.key ? 'active' : ''}`}
                  onClick={() => setSelectedDateKey(day.key)}
                  type="button"
                >
                  <span>{day.label}</span>
                  <strong>{day.dayNumber}</strong>
                  <small>{day.month}</small>
                  <em>{count} presenti</em>
                </button>
              );
            })}
          </div>

          <div className="presence-section">
            <div className="presence-summary-row">
              <div>
                <span className="eyebrow">giorno selezionato</span>
                <strong>
                  {new Date(selectedDateKey).toLocaleDateString('it-IT', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </strong>
              </div>
              <span className="presence-badge strong">{selectedPresence.length} persone</span>
            </div>

            <div className="avatar-row">
              {selectedPresence.length > 0 ? (
                selectedPresence.map((person) => (
                  <div className="avatar-pill" key={person}>
                    <span>{initials(person)}</span>
                    <strong>{person}</strong>
                  </div>
                ))
              ) : (
                <p className="empty-state">Ancora nessuna presenza segnata per questo giorno.</p>
              )}
            </div>
          </div>
        </article>

        <MapEmbed court={selectedCourt} />

        <article className="field-bubble">
          <div className="field-section-head split align-start">
            <div>
              <p className="eyebrow">stato del campo</p>
              <h4>Pro e minus</h4>
            </div>
            <button className="ghost-pill compact" type="button">Aggiungi segnalazione</button>
          </div>

          <div className="status-two-columns pros-cons-grid">
            <div className="bubble-card inner-bubble pros-card">
              <span className="section-label positive">Pro</span>
              <div className="signal-list">
                {selectedCourt.pros.map((item) => (
                  <div className="signal-item positive" key={item}>
                    <span className="signal-dot" />
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="bubble-card inner-bubble cons-card">
              <span className="section-label negative">Minus</span>
              <div className="signal-list">
                {selectedCourt.cons.map((item) => (
                  <div className="signal-item negative" key={item}>
                    <span className="signal-dot" />
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="field-bubble">
          <div className="field-section-head split align-start">
            <div>
              <p className="eyebrow">community board</p>
              <h4>Segnalazioni community e messaggi del campo</h4>
            </div>
            <button className="secondary-btn compact" type="button">Scrivi nota</button>
          </div>

          <div className="community-bubbles">
            {communityItems.map((item) => (
              <article className="community-bubble bubble-card" key={item.id}>
                <p>{item.text}</p>
                <div className="community-meta single-author">
                  <strong>{item.author}</strong>
                </div>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );


  const renderPresenceModal = () => {
    if (!showPresenceModal || !selectedCourt) return null;

    const selectedDateLabel = new Date(selectedDateKey).toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    return (
      <div className="modal-overlay" role="presentation" onClick={() => setShowPresenceModal(false)}>
        <div
          className="presence-modal card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="presence-modal-title"
          onClick={(event) => event.stopPropagation()}
        >
          <button className="modal-close-btn" type="button" aria-label="Chiudi popup" onClick={() => setShowPresenceModal(false)}>
            ×
          </button>
          <p className="eyebrow accent">segnala presenza</p>
          <h3 id="presence-modal-title">Chi ci sarà al {selectedCourt.name}?</h3>
          <p className="modal-helper">Inserisci il tuo nome per comparire tra i presenti del giorno selezionato.</p>
          <div className="modal-date-pill">{selectedDateLabel}</div>
          <form className="presence-form modal-presence-form" onSubmit={handleAddPresence}>
            <label className="presence-input-wrap">
              <span className="eyebrow accent">nome</span>
              <input
                autoFocus
                value={presenceName}
                onChange={(event) => setPresenceName(event.target.value)}
                placeholder="Scrivi il tuo nome"
                maxLength={24}
              />
            </label>
            <div className="modal-actions">
              <button className="secondary-btn compact" type="button" onClick={() => setShowPresenceModal(false)}>
                Annulla
              </button>
              <button className="primary-btn compact-presence-btn" type="submit">
                Conferma presenza
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderAdmin = () => {
    if (!adminAuthenticated) {
      return (
        <section className="admin-shell card">
          <div className="detail-top cleaner-top">
            <div>
              <p className="eyebrow accent">admin area</p>
              <h3>Accesso amministratore</h3>
              <p className="detail-summary">Login demo locale per aggiungere nuovi campi, modificare dati, coordinate e contenuti della pagina.</p>
            </div>
          </div>

          <form className="admin-login-form" onSubmit={handleAdminLogin}>
            <label className="admin-field">
              <span>Username</span>
              <input
                value={adminForm.username}
                onChange={(event) => setAdminForm((current) => ({ ...current, username: event.target.value }))}
                placeholder="username"
              />
            </label>
            <label className="admin-field">
              <span>Password</span>
              <input
                type="password"
                value={adminForm.password}
                onChange={(event) => setAdminForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="password"
              />
            </label>
            <div className="admin-login-actions">
              <button type="submit" className="primary-btn">Entra</button>
              <p className="admin-hint">Demo locale: <strong>admin</strong> / <strong>admin</strong></p>
            </div>
          </form>
        </section>
      );
    }

    return (
      <section className="admin-shell card">
        <div className="field-section-head split align-start admin-head">
          <div>
            <p className="eyebrow accent">admin area</p>
            <h3>Gestione campi</h3>
            <p className="detail-summary">Aggiungi nuovi campi, aggiorna coordinate, descrizione, galleria e pro/malus. I dati vengono salvati in locale.</p>
          </div>
          <div className="admin-top-actions">
            <button type="button" className="secondary-btn compact" onClick={resetFormForNewCourt}>Nuovo campo</button>
            <button type="button" className="ghost-pill compact" onClick={logoutAdmin}>Logout</button>
          </div>
        </div>

        <div className="admin-grid">
          <aside className="admin-list bubble-card">
            <div className="admin-list-head">
              <h4>Campi presenti</h4>
              <span className="pill subtle">{courts.length}</span>
            </div>
            <div className="admin-list-items">
              {courts.map((court) => (
                <div key={court.id} className={`admin-list-row ${editingCourtId === court.id ? 'active' : ''}`}>
                  <button type="button" className="admin-list-button" onClick={() => loadCourtIntoEditor(court.id)}>
                    <strong>{court.name}</strong>
                    <span>{court.district}</span>
                  </button>
                  <button type="button" className="admin-delete" onClick={() => deleteCourt(court.id)}>×</button>
                </div>
              ))}
            </div>
          </aside>

          <form className="admin-editor bubble-card" onSubmit={handleSaveCourt}>
            <div className="admin-editor-grid">
              <label className="admin-field">
                <span>Nome campo</span>
                <input value={courtForm.name} onChange={(e) => setCourtForm((c) => ({ ...c, name: e.target.value }))} required />
              </label>
              <label className="admin-field">
                <span>Zona / quartiere</span>
                <input value={courtForm.district} onChange={(e) => setCourtForm((c) => ({ ...c, district: e.target.value }))} required />
              </label>
              <label className="admin-field admin-field-full">
                <span>Indirizzo</span>
                <input value={courtForm.address} onChange={(e) => setCourtForm((c) => ({ ...c, address: e.target.value }))} required />
              </label>
              <label className="admin-field admin-field-full">
                <span>Descrizione breve</span>
                <textarea rows="4" value={courtForm.summary} onChange={(e) => setCourtForm((c) => ({ ...c, summary: e.target.value }))} required />
              </label>
              <label className="admin-field">
                <span>Latitudine</span>
                <input value={courtForm.latitude} onChange={(e) => setCourtForm((c) => ({ ...c, latitude: e.target.value }))} />
              </label>
              <label className="admin-field">
                <span>Longitudine</span>
                <input value={courtForm.longitude} onChange={(e) => setCourtForm((c) => ({ ...c, longitude: e.target.value }))} />
              </label>
              <label className="admin-field admin-field-full">
                <span>Immagine cover</span>
                <input value={courtForm.coverImage} onChange={(e) => setCourtForm((c) => ({ ...c, coverImage: e.target.value }))} />
              </label>
              <label className="admin-field admin-field-full">
                <span>Pro (uno per riga)</span>
                <textarea rows="4" value={courtForm.pros} onChange={(e) => setCourtForm((c) => ({ ...c, pros: e.target.value }))} />
              </label>
              <label className="admin-field admin-field-full">
                <span>Minus (uno per riga)</span>
                <textarea rows="4" value={courtForm.cons} onChange={(e) => setCourtForm((c) => ({ ...c, cons: e.target.value }))} />
              </label>
              <div className="admin-field admin-field-full">
                <span>Galleria immagini</span>
                <label
                  className={`media-dropzone ${isDraggingMedia ? 'dragging' : ''}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDraggingMedia(true);
                  }}
                  onDragLeave={() => setIsDraggingMedia(false)}
                  onDrop={handleDropMedia}
                >
                  <input type="file" accept="image/*" multiple onChange={handleMediaInputChange} />
                  <div className="media-dropzone-copy">
                    <strong>Trascina qui le foto</strong>
                    <p>Oppure clicca per selezionarle. Max 4 immagini.</p>
                  </div>
                </label>

                {galleryPreviewItems.length ? (
                  <div className="admin-media-grid">
                    {galleryPreviewItems.map((image, index) => (
                      <div className="admin-media-card" key={`${image}-${index}`}>
                        <button type="button" className="admin-media-remove" onClick={() => removeGalleryImage(index)}>
                          ×
                        </button>
                        <img src={image} alt={`Preview ${index + 1}`} className="admin-media-image" />
                        <button
                          type="button"
                          className={`admin-media-cover ${courtForm.coverImage === image ? 'active' : ''}`}
                          onClick={() => setCourtForm((current) => ({ ...current, coverImage: image }))}
                        >
                          {courtForm.coverImage === image ? 'Cover attiva' : 'Usa come cover'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                <textarea
                  rows="5"
                  value={courtForm.gallery}
                  onChange={(e) => setCourtForm((c) => ({ ...c, gallery: e.target.value }))}
                  placeholder="Puoi anche incollare URL immagini, una per riga"
                />
              </div>
            </div>
            <div className="admin-save-row">
              <button type="submit" className="primary-btn">Salva campo</button>
              <button type="button" className="secondary-btn" onClick={() => courtForm.id && openCourt(courtForm.id)}>
                Apri anteprima
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button type="button" className="brand-lockup brand-button" aria-label="Torna alla home" onClick={goHome}>
          <img src="/logo-mark.svg" alt="Playground Milano logo" className="brand-logo" />
          <div className="brand-inline-copy">
            <span className="brand-title-kicker">Basket courts community</span>
            <span className="brand-title-main">Milano Public Courts</span>
          </div>
        </button>

        <div className="topbar-actions">
          {route.courtId ? (
            <button type="button" className="ghost-pill" onClick={goHome}>
              Home
            </button>
          ) : null}
          <button type="button" className="ghost-pill" onClick={openAdmin}>
            Admin
          </button>
          <button
            className="theme-toggle"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            aria-label="Cambia tema"
            type="button"
          >
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </header>

      <main>{route.admin ? renderAdmin() : route.courtId ? renderField() : renderHome()}</main>
      {renderPresenceModal()}
    </div>
  );
}

export default App;
