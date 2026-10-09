# Weather Dashboard

A simple weather dashboard that fetches live data from the Open-Meteo public API.

## Features
- Search for a city and view current weather
- See daily highs and lows for the next 5 days
- Toggle between Celsius and Fahrenheit
- Remembers the last searched city using localStorage

## Run locally
1. Clone the repo.
2. Open `index.html` directly in a browser, or use a local static server such as:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## API used
- Open-Meteo Geocoding API
- Open-Meteo Forecast API

No API key is required.
