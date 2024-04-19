const WEATHERAPI_API_KEY = '412243e4cd9f4a73a60185739241104';

/*
    Function gets Geocoding data from API based on the search string provided.
    Throws an error if search string is empty.

    Function Inputs:
    1. params: Object containing any parameters to pass to the URL of the GET request to API.

    Function Returns: Object containing the status of the API call and the data returned from API.
*/
export async function getLocationDataFromString(params) {
    if(params.query.trim() === '') {
        throw 'No input provided';
    }

    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(params?.query)}&format=json`);
    const geocoding_data = await response?.json();
    return {
        status_code: response?.status,
        data: geocoding_data
    };
}

/*
    Function fetches current along with forecast weather data from API based on latitude,
    logitude, and number of days for forecast given.

    Function Inputs:
    1. params: Object containing any parameters to pass to the URL of the GET request to API.

    Function Returns: Object containing the status of the API call and the data returned from API.
*/
export async function getFutureWeatherData(params) {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_API_KEY}&q=${params?.latitude},${params?.longitude}&days=${params?.days}&aqi=no&alerts=no`);
    if(response?.status === 403) {
        reponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_API_KEY}&q=${params?.latitude},${params?.longitude}&days=3&aqi=no&alerts=no`);
    }

    let forecast_data = await response?.json();
    
    return {
        status_code: response?.status,
        data: forecast_data
    };
}
