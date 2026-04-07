const today = new Date();

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const addDays = (base, days) => {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
};

const dayKey = (offset) => formatDateKey(addDays(today, offset));

export const courts = [
  {
    id: 'parco-sempione',
    name: 'Parco Sempione Court',
    district: 'Centro',
    address: 'Viale Emilio Alemagna, Milano',
    latitude: 45.4723,
    longitude: 9.1728,
    coverImage: '/assets/court-hero.jpg',
    summary:
      'Uno dei playground più immediati da raggiungere. Ideale per pickup game spontanei, ritrovi rapidi e aggiornamenti live sullo stato del campo.',
    gallery: ['/assets/court-hero.jpg', '/assets/players-city.jpg', '/assets/players-outdoor.jpg', '/assets/night-play.jpg'],
    pros: ['Fontanella presente', 'Panchine vicine', 'Accesso comodo dal parco', 'Buona energia nel tardo pomeriggio'],
    cons: ['Retina lato alberi quasi assente', 'Fondo più scivoloso dopo la pioggia', 'Spesso molto frequentato'],
    reports: [
      { id: 1, title: 'Aggiornamento campo', note: 'Retina del canestro lato alberi quasi del tutto assente. Si gioca comunque bene.', author: 'Luca M.' },
      { id: 2, title: 'Servizi', note: 'Fontanella funzionante all’ingresso del parco. Panchine libere verso le 18.', author: 'Ari' },
      { id: 3, title: 'Afflusso', note: 'Verso le 20 arriva sempre più gente del solito.', author: 'Vale' },
    ],
    wall: [
      { author: 'Teo', text: 'Noi siamo già in 3, passate pure.' },
      { author: 'Nico', text: 'Campo ancora asciutto, si gioca bene.' },
      { author: 'Vale', text: 'Stasera sembra una giornata buona per fare partita.' },
    ],
    presence: {
      [dayKey(0)]: ['Teo', 'Ari', 'Fede', 'Luca', 'Nico', 'Vale'],
      [dayKey(1)]: ['Ari', 'Nico', 'Sam'],
      [dayKey(2)]: ['Fede', 'Miki', 'Nico', 'Ari'],
      [dayKey(3)]: ['Teo', 'Vale'],
      [dayKey(4)]: ['Luca', 'Nico', 'Ari', 'Fede', 'Vale'],
      [dayKey(5)]: ['Teo', 'Miki', 'Dani'],
      [dayKey(6)]: ['Nico', 'Ari', 'Vale', 'Luca'],
    },
  },
  {
    id: 'citylife-hoops',
    name: 'CityLife Hoops',
    district: 'Tre Torri',
    address: 'Piazza Tre Torri, Milano',
    latitude: 45.4781,
    longitude: 9.1550,
    coverImage: '/assets/players-city.jpg',
    summary:
      'Campo urbano con grande visibilità e ottima energia nelle ore tardo pomeridiane. Perfetto per una community molto attiva e aggiornamenti rapidi.',
    gallery: ['/assets/players-city.jpg', '/assets/court-hero.jpg', '/assets/night-play.jpg', '/assets/players-outdoor.jpg'],
    pros: ['Campo molto riconoscibile', 'Buon passaggio serale', 'Zona semplice da raggiungere', 'Linee del campo ben visibili'],
    cons: ['Affollato nel weekend', 'Poco spazio a bordo campo', 'Luci serali non perfette'],
    reports: [
      { id: 1, title: 'Condizione', note: 'Campo in ordine e linee visibili. Atmosfera top nel tardo pomeriggio.', author: 'Marco R.' },
      { id: 2, title: 'Luci', note: 'Dopo il tramonto si vede ancora decentemente ma non è il migliore per giocare tardi.', author: 'Ale' },
      { id: 3, title: 'Presenze', note: 'Nel fine settimana si riempie molto in fretta.', author: 'Fra' },
    ],
    wall: [
      { author: 'Gio', text: 'Chi passa oggi verso le 19?' },
      { author: 'Fra', text: 'Noi siamo in due, restiamo fino a tardi.' },
      { author: 'Beppe', text: 'Oggi si gioca bene, c’è già movimento.' },
    ],
    presence: {
      [dayKey(0)]: ['Gio', 'Fra', 'Beppe'],
      [dayKey(1)]: ['Fra', 'Dado', 'Lory', 'Pietro'],
      [dayKey(2)]: ['Gio', 'Lory'],
      [dayKey(3)]: ['Beppe', 'Dado', 'Fra'],
      [dayKey(4)]: ['Pietro', 'Lory', 'Gio', 'Fra', 'Marta'],
      [dayKey(5)]: ['Lory', 'Marta'],
      [dayKey(6)]: ['Gio', 'Fra', 'Dado', 'Pietro'],
    },
  },
  {
    id: 'lambrate-playground',
    name: 'Lambrate Playground',
    district: 'Lambrate',
    address: 'Via Conte Rosso, Milano',
    latitude: 45.4845,
    longitude: 9.2270,
    coverImage: '/assets/night-play.jpg',
    summary:
      'Campo dal mood più raw, ottimo per chi cerca aggiornamenti molto pratici su stato, fondo, illuminazione e presenze distribuite nella settimana.',
    gallery: ['/assets/night-play.jpg', '/assets/players-outdoor.jpg', '/assets/court-hero.jpg', '/assets/players-city.jpg'],
    pros: ['Illuminazione presente', 'Panchine vicine', 'Buon ritmo la sera'],
    cons: ['Nessuna fontanella', 'Fondo irregolare in un angolo', 'Retina usurata'],
    reports: [
      { id: 1, title: 'Criticità', note: 'Angolo lato ingresso un po’ rovinato, meglio evitare tagli secchi lì.', author: 'Simo' },
      { id: 2, title: 'Stato generale', note: 'Di sera molto bello, luci ok. Retina da sistemare ma si gioca.', author: 'Mati' },
      { id: 3, title: 'Servizi', note: 'Portate acqua, qui non c’è fontana.', author: 'Rick' },
    ],
    wall: [
      { author: 'Simo', text: 'Io ci sono dalle 21.' },
      { author: 'Mati', text: 'Campo libero fino alle 19.30.' },
      { author: 'Rick', text: 'Se passate tardi si riempie abbastanza.' },
    ],
    presence: {
      [dayKey(0)]: ['Simo', 'Mati'],
      [dayKey(1)]: ['Rick', 'Mati', 'Simo'],
      [dayKey(2)]: ['Simo', 'Raf', 'Mati', 'Rick'],
      [dayKey(3)]: ['Rick'],
      [dayKey(4)]: ['Mati', 'Raf', 'Simo'],
      [dayKey(5)]: ['Rick', 'Raf'],
      [dayKey(6)]: ['Simo', 'Mati', 'Rick', 'Raf'],
    },
  },
  {
    id: 'navigli-basket-spot',
    name: 'Navigli Basket Spot',
    district: 'Navigli',
    address: 'Alzaia Naviglio Grande, Milano',
    latitude: 45.4520,
    longitude: 9.1705,
    coverImage: '/assets/players-outdoor.jpg',
    summary:
      'Playground comodo per ritrovi informali e presenza diffusa nel tardo pomeriggio. Atmosfera rilassata e community locale molto pratica.',
    gallery: ['/assets/players-outdoor.jpg', '/assets/court-hero.jpg', '/assets/players-city.jpg', '/assets/night-play.jpg'],
    pros: ['Zona viva e facile da trovare', 'Buon passaggio nel tardo pomeriggio', 'Campo intuitivo per incontri veloci'],
    cons: ['Più rumoroso nelle ore di punta', 'Poche sedute attorno', 'Spazio laterale ridotto'],
    reports: [
      { id: 1, title: 'Contesto', note: 'Campo facile da trovare, ma in fascia aperitivo c’è più movimento attorno.', author: 'Dani' },
      { id: 2, title: 'Gioco', note: 'Si gioca bene soprattutto dalle 18 in poi.', author: 'Sara' },
      { id: 3, title: 'Bordo campo', note: 'Poco spazio laterale, meglio tenere zaini compatti.', author: 'Miki' },
    ],
    wall: [
      { author: 'Dani', text: 'Noi passiamo dopo lavoro, verso le 18.30.' },
      { author: 'Sara', text: 'Oggi sembra perfetto per fare due partite.' },
      { author: 'Miki', text: 'Campo già vivo, ma si entra bene.' },
    ],
    presence: {
      [dayKey(0)]: ['Dani', 'Sara', 'Miki', 'Ledo'],
      [dayKey(1)]: ['Dani', 'Sara'],
      [dayKey(2)]: ['Sara', 'Ledo', 'Miki'],
      [dayKey(3)]: ['Miki', 'Dani', 'Sara'],
      [dayKey(4)]: ['Ledo', 'Sara', 'Miki', 'Dani'],
      [dayKey(5)]: ['Sara', 'Miki'],
      [dayKey(6)]: ['Dani', 'Sara', 'Miki'],
    },
  },
];

export const getNextDays = (count = 7) =>
  Array.from({ length: count }, (_, index) => {
    const date = addDays(today, index);
    return {
      key: formatDateKey(date),
      label: date.toLocaleDateString('it-IT', { weekday: 'short' }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString('it-IT', { month: 'short' }),
    };
  });
