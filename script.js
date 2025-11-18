const API_KEY = 'ae5f6c93aeedbcc3324ad636b06e772d'; // <- replace this
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const errorEl = document.getElementById('error');


function showError(msg){ errorEl.textContent = msg; card.classList.remove('hidden'); }
function clearError(){ errorEl.textContent = ''; }
function showCard(){ card.classList.remove('hidden'); }


function formatTime(dt, tzOffsetSeconds){
const local = new Date((dt + tzOffsetSeconds) * 1000);
return local.toLocaleString([], { weekday:'short', hour:'2-digit', minute:'2-digit' });
}


function setWeather(data){
clearError();
showCard();
const name = `${data.name}${data.sys && data.sys.country ? ', ' + data.sys.country : ''}`;
locationEl.textContent = name;
timeEl.textContent = formatTime(data.dt, data.timezone);


const c = Math.round(data.main.temp);
tempEl.textContent = `${c}°C`;
descEl.textContent = data.weather && data.weather[0] ? data.weather[0].description : '';


feelsEl.textContent = `${Math.round(data.main.feels_like)}°C`;
humidityEl.textContent = `${data.main.humidity}%`;
windEl.textContent = `${data.wind.speed} m/s`;


if(data.weather && data.weather[0]){
const code = data.weather[0].icon;
iconEl.src = `https://openweathermap.org/img/wn/${code}@2x.png`;
iconEl.alt = data.weather[0].description || 'weather icon';
} else { iconEl.src = ''; iconEl.alt = ''; }


try{ localStorage.setItem('lastCity', data.name); } catch(e){}
}


async function fetchWeatherByCity(city){
if(!API_KEY || API_KEY === 'API_KEY'){ showError('Please add an API key in script.js'); return; }
clearError(); showCard(); locationEl.textContent = 'Loading...'; tempEl.textContent = '—°C';
const url = `${BASE}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
try{
const res = await fetch(url);
if(!res.ok){ if(res.status === 404) throw new Error('City not found'); throw new Error('Failed to fetch weather'); }
const data = await res.json(); setWeather(data);
} catch(err){ showError(err.message); }
}


async function fetchWeatherByCoords(lat, lon){
if(!API_KEY || API_KEY === 'API_KEY'){ showError('Please add an API key in script.js'); return; }
clearError(); showCard(); locationEl.textContent = 'Loading...'; tempEl.textContent = '—°C';
const url = `${BASE}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
try{ const res = await fetch(url); if(!res.ok) throw new Error('Failed to fetch weather'); const data = await res.json(); setWeather(data); } catch(err){ showError(err.message); }
}


// Events
form.addEventListener('submit', e =>{ e.preventDefault(); const city = cityInput.value.trim(); if(!city) return; fetchWeatherByCity(city); });
locBtn.addEventListener('click', () =>{
if(!navigator.geolocation){ showError('Geolocation not supported by browser'); return; }
navigator.geolocation.getCurrentPosition(pos =>{ const {latitude, longitude} = pos.coords; fetchWeatherByCoords(latitude, longitude); }, err =>{ showError('Unable to access location'); }, {timeout:10000});
});


// load last city into input (no auto-fetch)
window.addEventListener('load', () =>{ try{ const last = localStorage.getItem('lastCity'); if(last){ cityInput.value = last; } } catch(e){} });
