import { callAPIService, getDayName, getDateString  } from "./utils.js";
import { getLocationDataFromString, getFutureWeatherData } from "./services.js";

// Global variable stores the weather data fetched from API.
let weather_data = null;
// Global variable stores the geocoding data fetched from API.
let geocoding_data = null;
// Global variable which acts as a flag to denote whether temperature is shown in celsius or fahrenheit.
let temperature_metric = 'celsius';
// Default location to show weather data for when page is loaded.
const DEFAULT_LOCATION = 'Kolkata';
// Stores the details of each weather metric (humidity, uv index, etc.)
let highlights_points = null;

// Perform default data fetch and attach event handlers on page load.
window.addEventListener('load', _ => {
    // Search form fetches the weather for the entered location.
    // Location is matched with the closest name matching the input string.
    const location_search_form = document.querySelector('#location-search');

    location_search_form.addEventListener('submit', event => {
        // Prevent the form from submitting and reloading the page.
        event.preventDefault();
        // Call the API service with the data entered in the search field.
        getDataFromAPI(event?.target?.search?.value);
    });

    // By default, call API service with the default location during page load.
    getDataFromAPI(DEFAULT_LOCATION);

    /* 
        If user chooses celsius as the temperature metric, update the global variable and 
        re-render the UI. This will update all temperature values to Celsius scale.
    */
    document.querySelector('#celsius').addEventListener('change', _ => {
        temperature_metric = 'celsius';
        updateUI();
    });

    /* 
        If user chooses fahrenheit as the temperature metric, update the global variable and 
        re-render the UI. This will update all temperature values to Fahrenheit scale.
    */
    document.querySelector('#fahrenheit').addEventListener('change', _ => {
        temperature_metric = 'fahrenheit';
        updateUI();
    });
});

/*
    This function fetches data from API. It also shows a loader while data is being fetched
    and hides the loader when data is ready to be displayed. Finally, it renders the entire UI
    when data fetch is complete.

    Function Inputs:
    1. location: Location string for which weather data needs to be displayed.

    Function Returns: None
*/
function getDataFromAPI(location) {
    /*
        Get references to weather data elements and loader elements which will be used to
        hide and un-hide data.
    */
    const weather_data_elements = document.querySelectorAll('.weather-data');
    const loader_data_elements = document.querySelector('.loader-data');

    // Before starting data fetch, hide the weather data and show the loader.
    weather_data_elements.forEach(element => {
        element.classList.remove('show-data');
        element.classList.add('no-show-data');
    });
    loader_data_elements.classList.remove('no-show-data');
    loader_data_elements.classList.add('show-loader');

    // Get location data from Geocoding API using search string (or default location) as parameter.
    callAPIService(getLocationDataFromString, { query: location })
    .then(data => {
        geocoding_data = data;

        /*
            Get weather data from Weather API using latitude and longitude obtained from above,
            and number of days for forecast as parameter.
        */
        return callAPIService(getFutureWeatherData, {
            latitude: geocoding_data[0]?.lat,
            longitude: geocoding_data[0]?.lon,
            days: 8
        });
    })
    .then(data => {
        weather_data = data;

        /*
            highlights_points stores the details regarding data such as humidity, precipitation, etc.
            This is fetched from the API and stored in this object for easier accessibility and
            update from code. Initially, this variable is set to null as there is no data. When
            data is first fetched from API, this variable is populated here.
        */
        if(highlights_points === null) setHighlightsPoints();

        // After all data is fetched, render the entire UI.
        updateUI();

        // By here, data has been loaded. Hide the loader and display the weather data.
        loader_data_elements.classList.remove('show-loader');
        loader_data_elements.classList.add('no-show-data');
        weather_data_elements.forEach(element => {
            element.classList.remove('no-show-data');
            element.classList.add('show-data');
        });
    })
    .catch(error => {
        // On error, trigger the toast showing the error message.
        document.querySelector('.toast-body').innerHTML = error;
        const toast = document.querySelector('#live-toast');
        const toast_bootstrap = bootstrap.Toast.getOrCreateInstance(toast);
        toast_bootstrap.show();

        // Hide the loader and show the last fetched data.
        loader_data_elements.classList.remove('show-loader');
        loader_data_elements.classList.add('no-show-data');
        weather_data_elements.forEach(element => {
            element.classList.remove('no-show-data');
            element.classList.add('show-data');
        });
    })
}

/*
    This function initiates render of entire UI.

    Function Inputs: None
    Function Returns: None
*/
function updateUI() {
    updateCurrentWeatherData();
    updateTodaysHighlights();
    updateForecastHighlights();
}

/*
    This function renders the current weather, time, and location data.

    Function Inputs: None
    Function Returns: None
*/
function updateCurrentWeatherData() {
    // Update the current weather image.
    const current_weather_image = document.querySelector('#current-weather-image');
    current_weather_image.innerHTML = `<img src="${weather_data?.current?.condition?.icon}" alt="weather-image" class="current-weather-image-img">`;

    // Update the current temperature.
    const current_temperature = document.querySelector('#current-temperature');
    if(temperature_metric === 'celsius') {
        current_temperature.innerHTML = `${weather_data?.current?.temp_c}°C`;
    }
    else if(temperature_metric === 'fahrenheit') {
        current_temperature.innerHTML = `${weather_data?.current?.temp_f}°F`;
    }

    // Update the curent weather condition text.
    const weather_condition_text = document.querySelector('#weather-condition-text');
    weather_condition_text.innerHTML = `${weather_data?.current?.condition?.text}`;

    // Update the location data showing the location of the entered string.
    const location_data = document.querySelector('#location-data');
    location_data.innerHTML = `<img src="assets/svg/Location.svg" alt="location" class="current-data-img">${geocoding_data[0]?.display_name}`;

    // Update the current day of week and time.
    const current_date = document.querySelector('#current-date');
    const date_from_api = weather_data?.location?.localtime.split(' ')[0];
    const time_from_api = weather_data?.location?.localtime.split(' ')[1];
    current_date.innerHTML = `${getDayName(date_from_api)}, ${getDateString(date_from_api)}, ${time_from_api}`;

    // Update the feels like temperature.
    const feels_like = document.querySelector('#current-feels-like');
    if(temperature_metric === 'celsius') {
        feels_like.innerHTML = `<img src="assets/svg/Feels Like.svg" alt="feels-like" class="current-data-img">Feels Like: ${weather_data?.current?.feelslike_c}°C`;
    }
    else if(temperature_metric === 'fahrenheit') {
        feels_like.innerHTML = `<img src="assets/svg/Feels Like.svg" alt="feels-like" class="current-data-img">Feels Like: ${weather_data?.current?.feelslike_f}°F`;
    }
}

/*
    This function populates the 'highlights_points' list with metrics such as humidity, precipitation,
    etc. This data is obtained from the Weather API. Setting these data in the global variable in the
    below format helps in easier rendering and updation of further fetched data and UI.

    Each item in the list is of the following format:
    {
        title (string): String stores the name of the weather metric (ex, humidity, uv index, etc.),
        value (function): Inputs the unit and returns the value for the corresponding unit,
        unit (string): Unit in which value needs to be displayed. Empty if not applicable,
        text (function): Inputs the value and unit and returns a description of the metric condition
            according to standards (references of the standards are mentioned in README.md),
        img (string): Link to an image asset which needs to be displayed per metric,
        multiple_units (boolean): Indicates whether the corresponding metric can be displayed in more
            than 1 unit. Acceptable values are 'true' and 'false',
        multiple_values (list): A list containing the different metric units that are supported
            for the corresponding metric.
    }

    Function Inputs: None
    Function Returns: None
*/
function setHighlightsPoints() {
    highlights_points = [
        {
            title: 'UV Index',
            value: unit => weather_data?.current?.uv,
            unit: '',
            text: (value, unit) => {
                if(value >= 1 && value <= 2) return 'Low'
                else if(value > 2 && value <= 5) return 'Moderate'
                else if(value > 5 && value <= 7) return 'High'
                else if(value > 7 && value <= 10) return 'Very High'
                else if(value > 10) return 'Extreme'
            },
            img: 'assets/svg/UV Index.svg'
        },
        {
            title: 'Humidity',
            value: unit => weather_data?.current?.humidity,
            unit: '%',
            text: (value, unit) => {
                if(value < 50) return 'Low';
                else if(value >= 50 && value <= 80) return 'High';
                else if(value > 80) return 'Very High';
            },
            img: 'assets/svg/Humidity 2.svg'
        },
        {
            title: 'Wind Speed',
            value: unit => {
                if(unit === 'kmph') return weather_data?.current?.wind_kph;
                else if(unit === 'mph') return weather_data?.current?.wind_mph;
            },
            unit: 'kmph',
            text: (value, unit) => {
                if(unit === 'kmph') {
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
                else if(unit === 'mph') {
                    if(value < 1) return 'Calm'
                    else if(value >= 1 && value <= 3) return 'Light Air'
                    else if(value > 3 && value <= 7) return 'Light Breeze'
                    else if(value > 7 && value <= 12) return 'Gentle Breeze'
                    else if(value > 12 && value <= 18) return 'Moderate Breeze'
                    else if(value > 18 && value <= 24) return 'Fresh Breeze'
                    else if(value > 24 && value <= 31) return 'Strong Breeze'
                    else if(value > 31 && value <= 38) return 'Near Gale'
                    else if(value > 38 && value <= 46) return 'Gale'
                    else if(value > 46 && value <= 54) return 'Strong Gale'
                    else if(value > 54 && value <= 63) return 'Storm'
                    else if(value > 63 && value <= 72) return 'Violent Storm'
                    else if(value > 72) return 'Hurricane'
                }
            },
            img: 'assets/svg/Wind Speed Updated.svg',
            multiple_units: true,
            multiple_values: [ 'kmph', 'mph' ]
        },
        {
            title: 'Wind Direction',
            value: unit => `${weather_data?.current?.wind_degree}°`,
            unit: `${weather_data?.current?.wind_dir}`,
            text: (value, unit) => { return '' },
            img: 'assets/svg/Wind Direction.svg'
        },
        {
            title: 'Visibility',
            value: unit => {
                if(unit === 'km') return weather_data?.current?.vis_km;
                else if(unit === 'mi') return weather_data?.current?.vis_miles;
            },
            unit: 'km',
            text: (value, unit) => { return '' },
            img: 'assets/svg/Visibility.svg',
            multiple_units: true,
            multiple_values: [ 'km', 'mi' ]
        },
        {
            title: 'Precipitation',
            value: unit => {
                if(unit === 'mm') return weather_data?.current?.precip_mm;
                else if(unit === 'in') return weather_data?.current?.precip_in;
            },
            unit: 'mm',
            text: (value, unit) => { return '' },
            img: 'assets/svg/Precipitation.svg',
            multiple_units: true,
            multiple_values: [ 'mm', 'in' ]
        },
        {
            title: 'Pressure',
            value: unit => {
                if(unit === 'in') return weather_data?.current?.pressure_in;
                else if(unit === 'mb') return weather_data?.current?.pressure_mb;
            },
            unit: 'in',
            text: (value, unit) => { return '' },
            img: 'assets/svg/Pressure.svg',
            multiple_units: true,
            multiple_values: [ 'in', 'mb' ]
        },
        {
            title: 'Cloud Cover',
            value: unit => weather_data?.current?.cloud,
            unit: '',
            text: (value, unit) => {
                if(value >= 0 && value < 2) return 'Clear Sky';
                else if(value >= 2 && value < 4) return 'Light Clouds';
                else if(value >= 4 && value < 6) return 'Partial Clouds';
                else if(value >= 6 && value < 7) return 'Heavy Clouds';
                else if(value >= 7) return 'Overcast';
            },
            img: 'assets/svg/Cloud.svg'
        }
    ];
}

/*
    Function renders details including humidity, precipitation, wind, etc.

    Function Inputs: None
    Function Returns: None
*/
function updateTodaysHighlights() {
    // Set the header for the section.
    document.querySelector('#highlights-header').innerHTML = "Today's Highlights";

    const highlights_grid = document.querySelector('#highlights-grid .row');
    let highlights_cards = '';

    /*
        Function renders a single card which does not have multiple metric values.

        Function Inputs:
        1. point: This contains details of weather metric. This is equivalent to each element
            in the highlights_points list.
        
        Function Returns: Rendered HTML of the card containing the metric.
    */
    const HighlightsCardSingleUnit = point => {
        return `
        <div class="card h-100">
            <div class="row g-0 h-100">
                <div class="col-md-8">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-body-secondary">${point.title}</h6>
                        <h3 class="card-title">${point.value(point.unit)}<span class="card-unit">${point.unit}</span></h3>
                        <p class="card-text"><small class="text-body-secondary">${point.text(point.value(point.unit), point.unit)}</small></p>
                    </div>
                </div>
                <div class="col-md-4 card-image-container">
                    <img src="${point.img}" alt="highlights-image" class="img-fluid rounded-start card-image">
                </div>
            </div>
        </div>
        `;
    };
    
    /*
        Function renders a single card which has multiple metric values.

        Function Inputs:
        1. point: This contains details of weather metric. This is equivalent to each element
            in the highlights_points list.
        
        Function Returns: Rendered HTML of the card containing the metric.
    */
    const HighlightsCardMultiUnit = point => {
        // Create a dropdown from which users can select in which unit to display the metric.
        const dropdownListGenerator = each_point => {
            let dropdown_string = '';
            each_point.multiple_values.forEach(value => {
                dropdown_string = `${dropdown_string}
                <option value="${value}" ${value === point.unit ? "selected" : ""}>${value}</option>
                `;
            });
            return dropdown_string;
        }
    
        return `
        <div class="card h-100">
            <div class="row g-0 h-100">
                <div class="col-md-8">
                    <div class="card-body card-body-no-right-padding">
                        <h6 class="card-subtitle mb-2 text-body-secondary">${point.title}</h6>
                        <h3 class="card-title">
                            ${Math.round(point.value(point.unit) * 10) / 10}
                            <span class="card-unit no-margin">
                                <select 
                                    class="selectpicker span3"
                                    name="${point.title}"
                                >
                                    ${dropdownListGenerator(point)}
                                </select>
                            </span>
                        </h3>
                        <p class="card-text"><small class="text-body-secondary">${point.text(point.value(point.unit), point.unit)}</small></p>
                    </div>
                </div>
                <div class="col-md-4 card-image-container">
                    <img src="${point.img}" alt="highlights-image" class="img-fluid rounded-start card-image">
                </div>
            </div>
        </div>
        `;
    };

    /*
        Layout all the cards in a grid. For each card, based on if multiple metric values need
        to be displayed, call the respective functions which generates the corresponding cards.
    */
    highlights_points.forEach(point => {
        highlights_cards = `${highlights_cards}
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
            ${point.multiple_units ? HighlightsCardMultiUnit(point) : HighlightsCardSingleUnit(point)}
        </div>
        `
    });

    highlights_grid.innerHTML = highlights_cards;

    /*
        Handler function to change the metric value in the card. It just updates the 'highlights_points'
        list with the new unit for corresponding element and the remaining value update is handled
        through the function defined in the list itself. After that, it renders only the highlights
        section.

        Function Inputs:
        1. title: The title of the metric for which unit is changed.
        2. value: The new value of the unit after the change.

        Function Returns: None
    */
    const handleUnitChange = (title, value) => {
        // Find the index of the object with the matching title
        const index = highlights_points.findIndex(point => point.title === title);
        
        // Update the unit property of the object at that index
        highlights_points[index].unit = value;

        // Update the UI
        updateTodaysHighlights();
    };

    // Add event listeners to each select picker added to the UI.
    const selects = document.querySelectorAll('.selectpicker');
    selects.forEach(select => {
        select.addEventListener('change', event => handleUnitChange(event.target.name, event.target.value));
    })
}

/*
    Render the forecast section of the UI.

    Function Inputs: None
    Function Returns: None
*/
function updateForecastHighlights() {
    const forecast_grid = document.querySelector('#forecast-highlights .row');
    let highlights_cards = '';

    // Iterates over each day of forecast data available, and renders them as a Card.
    weather_data?.forecast?.forecastday.forEach((day, index) => {
        const condition_image = day?.day?.condition?.icon;
        const date = day?.date;
        const max_temp = temperature_metric === 'celsius' ? day?.day?.maxtemp_c : day?.day?.maxtemp_f;
        const min_temp = temperature_metric === 'celsius' ? day?.day?.mintemp_c : day?.day?.mintemp_f;

        highlights_cards = `${highlights_cards}
        <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2 col-xl">
            <div class="card forecast-card">
                <h6 class="card-subtitle">${index !== 0 ? getDayName(date).substring(0, 3) : 'Today'}</h6>
                <img src="${condition_image}" class="card-img-top forecast-image" alt="weather-image">
                <div class="card-body p-0">
                    <p class="card-text">
                        <span class="forecast-max-temp" title="Max Temp">${Math.round(max_temp)}°</span>
                        <span class="forecast-min-temp" title="Min Temp">${Math.round(min_temp)}°</span>
                    </p>
                </div>
            </div>
        </div>
        `
    });

    forecast_grid.innerHTML = highlights_cards;
}
