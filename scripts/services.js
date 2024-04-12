const POSITIONSTACK_API_KEY = 'ea6a9021e0c1baa29c4bac6c4baae0ec';
const WEATHERAPI_API_KEY = '412243e4cd9f4a73a60185739241104';

async function getLocationDataFromString(params) {
    const response = await fetch(`http://api.positionstack.com/v1/forward?access_key=${POSITIONSTACK_API_KEY}&query=${encodeURIComponent(params?.query)}`);
    const geocoding_data = await response?.json();
    return {
        status_code: response?.status,
        data: geocoding_data
    };
}

async function getWeatherData(params) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_API_KEY}&q=${params?.latitude},${params?.longitude}&aqi=no`);
    const weather_data = await response?.json();
    return {
        status_code: response?.status,
        data: weather_data
    };
}

getLocationDataFromString('Eta akta hofeless jayega').then(value => {
    console.log(value);
    if(value.status_code === 200) {
        getWeatherData(value.data.data[0]?.latitude, value.data.data[0]?.longitude).then(weather_data => {
            console.log(weather_data);
        })
    }
})