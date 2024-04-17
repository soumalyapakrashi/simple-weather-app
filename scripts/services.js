const WEATHERAPI_API_KEY = '412243e4cd9f4a73a60185739241104';

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

// This endpoint not used any more as we are getting the data from forecast api
export async function getWeatherData(params) {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_API_KEY}&q=${params?.latitude},${params?.longitude}&aqi=no`);
    const weather_data = await response?.json();
    return {
        status_code: response?.status,
        data: weather_data
    };
}

export async function getFutureWeatherData(params) {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_API_KEY}&q=${params?.latitude},${params?.longitude}&days=${params.days}&aqi=no&alerts=no`);
    const forecast_data = await response?.json();
    return {
        status_code: response?.status,
        data: forecast_data
    };
}
