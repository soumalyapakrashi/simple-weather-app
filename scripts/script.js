import { callAPIService, getDayName  } from "./utils.js";
import { getLocationDataFromString, getFutureWeatherData } from "./services.js";

let weather_data = null;
let geocoding_data = null;
let temperature_metric = 'celsius';
const DEFAULT_LOCATION = 'Kolkata';

// Search form fetches the weather for the entered location.
// Location is matched with the closest name matching the input string.
const location_search_form = document.querySelector('#location-search');

location_search_form.addEventListener('submit', event => {
    event.preventDefault();
    getDataFromAPI(event?.target?.search?.value);
});

// Default data to show when page loads.
window.addEventListener('load', event => {
    getDataFromAPI(DEFAULT_LOCATION);
});

// If user chooses celsius as the temperature metric
document.querySelector('#celsius').addEventListener('change', event => {
    temperature_metric = 'celsius';
    updateUI();
});

document.querySelector('#fahrenheit').addEventListener('change', event => {
    temperature_metric = 'fahrenheit';
    updateUI();
});

function getDataFromAPI(location) {
    callAPIService(getLocationDataFromString, { query: location })
    .then(data => {
        geocoding_data = data;
        return callAPIService(getFutureWeatherData, {
            latitude: geocoding_data?.data[0]?.latitude,
            longitude: geocoding_data?.data[0]?.longitude,
            days: 8
        });
    })
    .then(data => {
        weather_data = data;
        updateUI();
    })
    .catch(error => {
        console.log(error);
    })

    updateUI();
}

function updateUI() {
    updateCurrentWeatherData();
    updateTodaysHighlights();
    updateForecastHighlights();
}

function updateCurrentWeatherData() {
    // Update the current weather image
    const current_weather_image = document.querySelector('#current-weather-image');
    current_weather_image.innerHTML = `<img src="${weather_data?.current?.condition?.icon}" alt="weather-image" class="current-weather-image-img">`;

    // Update the current temperature
    const current_temperature = document.querySelector('#current-temperature');
    if(temperature_metric === 'celsius') {
        current_temperature.innerHTML = `${weather_data?.current?.temp_c}°C`;
    }
    else if(temperature_metric === 'fahrenheit') {
        current_temperature.innerHTML = `${weather_data?.current?.temp_f}°F`;
    }

    // Update the weather condition text
    const weather_condition_text = document.querySelector('#weather-condition-text');
    weather_condition_text.innerHTML = `${weather_data?.current?.condition?.text}`;

    // Update the location data showing the location of the entered string
    const location_data = document.querySelector('#location-data');
    location_data.innerHTML = `${geocoding_data?.data[0]?.label}`;

    // Update the current date
    const current_date = document.querySelector('#current-date');
    current_date.innerHTML = `${getDayName(weather_data?.location?.localtime.split(' ')[0])}, ${weather_data?.location?.localtime.split(' ')[1]}`;

    // Update the feels like
    const feels_like = document.querySelector('#current-feels-like');
    if(temperature_metric === 'celsius') {
        feels_like.innerHTML = `<img src="../assets/svg/Feels Like.svg" alt="feels-like" id="feels-like-img">Feels Like: ${weather_data?.current?.feelslike_c}°C`;
    }
    else if(temperature_metric === 'fahrenheit') {
        feels_like.innerHTML = `<img src="../assets/svg/Feels Like.svg" alt="feels-like" id="feels-like-img">Feels Like: ${weather_data?.current?.feelslike_f}°F`;
    }
}

function updateTodaysHighlights() {
    const highlights_grid = document.querySelector('#highlights-grid');
    let highlights_cards = '';

    const highlights_points = [
        {
            title: 'UV Index',
            value: weather_data?.current?.uv,
            unit: '',
            text: (value, unit) => {
                if(value >= 1 && value <= 2) return 'Low'
                else if(value > 2 && value <= 5) return 'Moderate'
                else if(value > 5 && value <= 7) return 'High'
                else if(value > 7 && value <= 10) return 'Very High'
                else if(value > 10) return 'Extreme'
            },
            img: '../assets/svg/UV Index.svg'
        },
        {
            title: 'Humidity',
            value: weather_data?.current?.humidity,
            unit: '%',
            text: (value, unit) => {
                if(value < 50) return 'Low';
                else if(value >= 50 && value <= 80) return 'High';
                else if(value > 80) return 'Very High';
            },
            img: '../assets/svg/Humidity 2.svg'
        },
        {
            title: 'Wind Speed',
            value: `${weather_data?.current?.wind_kph}`,
            unit: 'km/h',
            text: (value, unit) => {
                if(unit === 'km/h') {
                    if(value < 1) return 'Calm'
                    else if(value >= 1 && value <= 5) return 'Light Air'
                    else if(value > 5 && value <= 11) return 'Light Breeze'
                    else if(value > 11 && value <= 19) return 'Gentle Breeze'
                    else if(value > 19 && value <= 28) return 'Moderate Breeze'
                    else if(value > 28 && value <= 38) return 'Fresh Breeze'
                    else if(value > 38 && value <= 49) return 'Strong Breeze'
                    else if(value > 49 && value <= 61) return 'Near Gale'
                    else if(value > 61 && value <= 74) return 'Gale'
                    else if(value > 74 && value <= 88) return 'Strong Gale'
                    else if(value > 88 && value <= 102) return 'Storm'
                    else if(value > 102 && value <= 117) return 'Violent Storm'
                    else if(value > 117) return 'Hurricane'
                }
            },
            img: '../assets/svg/Wind Speed Updated.svg'
        },
        {
            title: 'Wind Direction',
            value: `${weather_data?.current?.wind_degree}°`,
            unit: `${weather_data?.current?.wind_dir}`,
            text: (value, unit) => { return '' },
            img: '../assets/svg/Wind Direction.svg'
        },
        {
            title: 'Visibility',
            value: `${weather_data?.current?.vis_km}`,
            unit: 'km',
            text: (value, unit) => { return '' },
            img: '../assets/svg/Visibility.svg'
        },
        {
            title: 'Precipitation',
            value: `${weather_data?.current?.precip_mm}`,
            unit: 'mm',
            text: (value, unit) => { return '' },
            img: '../assets/svg/Precipitation.svg'
        },
        {
            title: 'Pressure',
            value: `${weather_data?.current?.pressure_in}`,
            unit: 'in',
            text: (value, unit) => { return '' },
            img: '../assets/svg/Pressure.svg'
        },
        {
            title: 'Cloud Cover',
            value: weather_data?.current?.cloud,
            unit: '',
            text: (value, unit) => {
                if(value >= 0 && value < 2) return 'Clear Sky';
                else if(value >= 2 && value < 4) return 'Light Clouds';
                else if(value >= 4 && value < 6) return 'Partial Clouds';
                else if(value >= 6 && value < 7) return 'Heavy Clouds';
                else if(value >= 7) return 'Overcast';
            },
            img: '../assets/svg/Cloud.svg'
        }
    ]

    highlights_points.forEach(point => {
        highlights_cards = `${highlights_cards}
        <div class="card">
            <div class="row g-0">
                <div class="col-md-8">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-body-secondary">${point.title}</h6>
                        <h3 class="card-title">${point.value}<span class="card-unit">${point.unit}</span></h3>
                        <p class="card-text"><small class="text-body-secondary">${point.text(point.value, point.unit)}</small></p>
                    </div>
                </div>
                <div class="col-md-4 card-image-container">
                    <img src="${point.img}" alt="highlights-image" class="img-fluid rounded-start card-image">
                </div>
            </div>
        </div>
        `
    });

    highlights_grid.innerHTML = highlights_cards;
}

function updateForecastHighlights() {
    const forecast_grid = document.querySelector('#forecast-highlights');
    let highlights_cards = '';

    weather_data?.forecast?.forecastday.forEach(day => {
        const condition_image = day?.day?.condition?.icon;
        const date = day?.date;
        const max_temp = temperature_metric === 'celsius' ? day?.day?.maxtemp_c : day?.day?.maxtemp_f;
        const min_temp = temperature_metric === 'celsius' ? day?.day?.mintemp_c : day?.day?.mintemp_f;

        highlights_cards = `${highlights_cards}
        <div class="card forecast-card">
            <h6 class="card-subtitle">${getDayName(date).substring(0, 3)}</h6>
            <img src="${condition_image}" class="card-img-top forecast-image" alt="weather-image">
            <div class="card-body p-0">
                <p class="card-text">
                    <span class="forecast-max-temp">${Math.round(max_temp)}°</span>
                    <span class="forecast-min-temp">${Math.round(min_temp)}°</span>
                </p>
            </div>
        </div>
        `
    });

    forecast_grid.innerHTML = highlights_cards;
}