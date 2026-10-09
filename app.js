const STORAGE_KEY = "weather-dashboard-city";
const THEME_KEY = "weather-dashboard-theme";
const DEFAULT_CITY = "New York";
const WEATHER_CODES = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Depositing rime fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Moderate drizzle", icon: "🌦️" },
  55: { label: "Dense drizzle", icon: "🌧️" },
  56: { label: "Light freezing drizzle", icon: "🌧️" },
  57: { label: "Dense freezing drizzle", icon: "🌧️" },
  61: { label: "Slight rain", icon: "🌦️" },
  63: { label: "Moderate rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  66: { label: "Light freezing rain", icon: "🌧️" },
  67: { label: "Heavy freezing rain", icon: "🌧️" },
  71: { label: "Slight snow", icon: "🌨️" },
  73: { label: "Moderate snow", icon: "❄️" },
  75: { label: "Heavy snow", icon: "❄️" },
  77: { label: "Snow grains", icon: "❄️" },
  80: { label: "Rain showers", icon: "🌦️" },
  81: { label: "Heavy rain showers", icon: "🌧️" },
  82: { label: "Violent rain showers", icon: "⛈️" },
  85: { label: "Snow showers", icon: "🌨️" },
  86: { label: "Heavy snow showers", icon: "🌨️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" },
  99: { label: "Severe thunderstorm", icon: "⛈️" }
};

const state = {
  unit: "celsius",
  lastCity: localStorage.getItem(STORAGE_KEY) || DEFAULT_CITY,
  theme: localStorage.getItem(THEME_KEY) || "dark"
};

const elements = {
  searchForm: document.querySelector("#searchForm"),
  cityInput: document.querySelector("#cityInput"),
  locationName: document.querySelector("#locationName"),
  currentDate: document.querySelector("#currentDate"),
  weatherIcon: document.querySelector("#weatherIcon"),
  temperature: document.querySelector("#temperature"),
  weatherDescription: document.querySelector("#weatherDescription"),
  feelsLike: document.querySelector("#feelsLike"),
  humidity: document.querySelector("#humidity"),
  windSpeed: document.querySelector("#windSpeed"),
  precipitation: document.querySelector("#precipitation"),
  sunrise: document.querySelector("#sunrise"),
  sunset: document.querySelector("#sunset"),
  highTemp: document.querySelector("#highTemp"),
  lowTemp: document.querySelector("#lowTemp"),
  hourlyForecast: document.querySelector("#hourlyForecast"),
  forecastList: document.querySelector("#forecastList"),
  statusMessage: document.querySelector("#statusMessage"),
  unitButtons: document.querySelectorAll(".unit-button"),
  themeToggle: document.querySelector("#themeToggle"),
  themeToggleIcon: document.querySelector(".toggle-icon")
};

function formatTemperature(value) {
  if (state.unit === "fahrenheit") {
    return `${Math.round((value * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(value)}°C`;
}

function formatTime(value) {
  if (!value) return "--:--";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatHour(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric"
  }).format(date);
}

function formatDay(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

function getWeatherMeta(code) {
  const meta = WEATHER_CODES[code] || { label: "Weather", icon: "🌤️" };
  return meta;
}

function updateUnitButtons() {
  elements.unitButtons.forEach((button) => {
    const isActive = button.dataset.unit === state.unit;
    button.classList.toggle("active", isActive);
  });
}

function applyTheme() {
  document.body.dataset.theme = state.theme;
  localStorage.setItem(THEME_KEY, state.theme);
  elements.themeToggleIcon.textContent = state.theme === "light" ? "☀️" : "🌙";
}

function renderHourlyForecast(times, tempList, codeList) {
  elements.hourlyForecast.innerHTML = "";

  const slice = times.slice(0, 6);

  slice.forEach((time, index) => {
    const meta = getWeatherMeta(codeList[index]);
    const item = document.createElement("article");
    item.className = "hourly-item";

    const label = document.createElement("span");
    label.className = "hour";
    label.textContent = formatHour(time);

    const icon = document.createElement("span");
    icon.className = "hour-icon";
    icon.textContent = meta.icon;

    const temp = document.createElement("span");
    temp.className = "hour-temp";
    temp.textContent = formatTemperature(tempList[index]);

    item.append(label, icon, temp);
    elements.hourlyForecast.appendChild(item);
  });
}

function renderForecast(days, codeList, minList, maxList) {
  elements.forecastList.innerHTML = "";

  days.forEach((day, index) => {
    const meta = getWeatherMeta(codeList[index]);
    const forecastCard = document.createElement("article");
    forecastCard.className = "forecast-day";

    const dayName = document.createElement("span");
    dayName.className = "day";
    dayName.textContent = formatDay(day);

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = meta.icon;

    const highLow = document.createElement("div");
    highLow.className = "high-low";
    highLow.innerHTML = `
      <span>${formatTemperature(maxList[index])}</span>
      <span>${formatTemperature(minList[index])}</span>
    `;

    forecastCard.append(dayName, icon, highLow);
    elements.forecastList.appendChild(forecastCard);
  });
}

function renderWeather(data, location) {
  const { current, daily, hourly } = data;
  const weatherMeta = getWeatherMeta(current.weather_code);

  elements.locationName.textContent = `${location.name}, ${location.country || ""}`.trim();
  elements.currentDate.textContent = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date());

  elements.weatherIcon.textContent = weatherMeta.icon;
  elements.temperature.textContent = formatTemperature(current.temperature_2m);
  elements.weatherDescription.textContent = weatherMeta.label;
  elements.feelsLike.textContent = formatTemperature(current.apparent_temperature);
  elements.humidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;
  elements.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  elements.precipitation.textContent = `${current.precipitation ?? 0} mm`;

  elements.sunrise.textContent = formatTime(daily.sunrise[0]);
  elements.sunset.textContent = formatTime(daily.sunset[0]);
  elements.highTemp.textContent = formatTemperature(daily.temperature_2m_max[0]);
  elements.lowTemp.textContent = formatTemperature(daily.temperature_2m_min[0]);

  renderHourlyForecast(
    hourly.time.slice(0, 6),
    hourly.temperature_2m.slice(0, 6),
    hourly.weather_code.slice(0, 6)
  );

  renderForecast(
    daily.time.slice(0, 5),
    daily.weather_code.slice(0, 5),
    daily.temperature_2m_min.slice(0, 5),
    daily.temperature_2m_max.slice(0, 5)
  );
}

async function fetchWeather(city) {
  elements.statusMessage.textContent = "Looking up weather...";
  elements.statusMessage.classList.add("loading");

  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );

    if (!geoResponse.ok) {
      throw new Error("Unable to find that location.");
    }

    const geoData = await geoResponse.json();
    const location = geoData.results?.[0];

    if (!location) {
      throw new Error("No matching city was found.");
    }

    localStorage.setItem(STORAGE_KEY, city);
    state.lastCity = city;

    const forecastResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
    );

    if (!forecastResponse.ok) {
      throw new Error("Unable to fetch weather data.");
    }

    const weatherData = await forecastResponse.json();
    renderWeather(weatherData, location);
    elements.statusMessage.textContent = `Showing weather for ${location.name}.`;
  } catch (error) {
    elements.statusMessage.textContent = error.message || "Something went wrong.";
  } finally {
    elements.statusMessage.classList.remove("loading");
  }
}

function initialize() {
  updateUnitButtons();
  applyTheme();
  elements.cityInput.value = state.lastCity;
  fetchWeather(state.lastCity);
}

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = elements.cityInput.value.trim();

  if (!city) {
    elements.statusMessage.textContent = "Please enter a city name.";
    return;
  }

  fetchWeather(city);
});

elements.unitButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.unit = button.dataset.unit;
    updateUnitButtons();
    const city = elements.cityInput.value.trim() || state.lastCity;
    if (city) {
      fetchWeather(city);
    }
  });
});

elements.themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme();
});

initialize();
