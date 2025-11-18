const API_KEY = 'ae5f6c93aeedbcc3324ad636b06e772d'; // <- replace with your key


async function fetchWeatherByCoords(lat, lon){
if(!API_KEY || API_KEY === 'API_KEY'){
showError('Please add an API key in script.js');
return;
}
clearError();
showCard();
locationEl.textContent = 'Loading...';
tempEl.textContent = '—°C';


const url = `${BASE}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
try{
const res = await fetch(url);
if(!res.ok) throw new Error('Failed to fetch weather');
const data = await res.json();
setWeather(data);
} catch(err){
showError(err.message);
}
}


// Events
form.addEventListener('submit', e =>{
e.preventDefault();
const city = cityInput.value.trim();
if(!city) return;
fetchWeatherByCity(city);
});


locBtn.addEventListener('click', () =>{
if(!navigator.geolocation){
showError('Geolocation not supported by browser');
return;
}
navigator.geolocation.getCurrentPosition(pos =>{
const {latitude, longitude} = pos.coords;
fetchWeatherByCoords(latitude, longitude);
}, err =>{
showError('Unable to access location');
}, {timeout:10000});
});


// load last city
window.addEventListener('load', () =>{
try{
const last = localStorage.getItem('lastCity');
if(last){
cityInput.value = last;
fetchWeatherByCity(last);
}
} catch(e){}
});
