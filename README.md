# Milano Public Courts MVP

Prototype frontend built with React + Vite.

## Avvio locale

```bash
npm install
npm run dev
```

## Credenziali admin demo

Per aprire il pannello admin locale:

- username: `admin`
- password: `milano123`

Dal pannello admin puoi:
- aggiungere un nuovo campo
- modificare nome, zona, indirizzo e descrizione
- aggiornare coordinate per la mappa
- cambiare pro / minus
- aggiornare cover e galleria immagini

I dati vengono salvati in `localStorage`, quindi restano disponibili sul tuo browser locale anche dopo il refresh.

## Nota sulla mappa

La pagina campo usa un embed OpenStreetMap senza API key, così puoi testare tutto subito in locale.
