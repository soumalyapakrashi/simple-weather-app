[![pages-build-deployment](https://github.com/soumalyapakrashi/simple-weather-app/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/soumalyapakrashi/simple-weather-app/actions/workflows/pages/pages-build-deployment)

# Weather App

**Live Site Link:** https://soumalyapakrashi.github.io/simple-weather-app/

## Contents

1. [Features](#features)
2. [Setup Instructions](#setup-instructions)
3. [References](#references)

## Features

### On page load, default data is displayed

When page is first loaded, weather data is fetched for **Kolkata** by default and displayed. After this, user can search for any other location and get the corresponding weather data.

![Window Initial Load](assets/img/window-initial-load.jpg)

### Loader during data fetch

When data is being fetched from Geocoding or Weather API, a loader is displayed. When data has been fetched and is ready to be displayed, loader is hidden.

![Data Fetch Loader](assets/img/loader-during-data-fetch.jpg)

### Search field autofocus

When page is loaded, the search input field is automatically focused so that users can start typing right away without needing to manually click on the input field.

### Any location search and weather information

Users can search for any location (or address) and the weather details for the corresponding location will be displayed. This works for city names, addresses, street names, etc. This feature is enabled with the help of Geocoding API which returns the location data which closely matches the search string provided as input.

**Note:** As the Geocoding API matches locations which closely match the input provided, sometimes, this can provide undesirable output. For example, we might want to get information about _Salt Lake Sector 5_ in _Kolkata_, but if we just search for _Salt Lake Sector 5_, it might return data for _Salt Lake, United States_. In such cases, providing more information will resolve the issue. For example, giving _Salt Lake Sector 5, Kolkata_ will fetch the correct data.

### Current weather information

The following weather information are displayed for the current day.

* Temperature
* Weather condition (like cloudy, sunny)
* Feels like temperature
* UV index
* Relative humidity
* Wind speed
* Wind direction
* Visibility
* Precipitation
* Pressure
* Cloud cover

All temperature data can be displayed either in Celsius or Fahrenheit. A toggle button is implemented which helps to toggle between these 2 temperature scales.

![Temperature in Celsius](assets/img/temperature-celsius.jpg)

![Temperature in Fahrenheit](assets/img/temperature-fahrenheit.jpg)

For some of the individual cards, the displayed metric can be changed as well. Below is the list of metrics which can be changed to a different metric and their acceptable metrics:

* Wind speed - _kmph_ and _mph_
* Visibility - _km_ and _mi_
* Precipitation - _mm_ and _in_
* Pressure - _in_ and _mb_

where

1. km = kilometers
2. mi = miles
3. kmph = kilometers per hour
4. mph = miles per hour
5. mm = millimeters
5. in = inches
6. mb = millibars

![Multiple Metrics](assets/img/multiple-metrics.jpg)

### Future weather prediction

Weather data for future 7 days is displayed in the predictions section. Per each card, the following information is displayed:

* Day of week
* Image of the average weather condition
* Maximum temperature
* Minimum temperature

**Important Note:** The API used to fetch weather data has both free and paid plans. In the paid plan, 8 days of future prediction can be fetched, but in the free version, only 3 days of forecast is available. During new sign-up, the API provides free trial to the paid plan for a fixed number of days after which the plan is automatically switched to the free version. Currently, the date of expiry of the paid trial is 25th April, 2024. So, up to that date, 8 future forecast dates will be shown in the app. After that day, only 3 future forecast dates will be shown.

### Error handling

An appropriate error message is displayed if there is any error in the app, for example, if user enters a location which cannot be matched to any supported location by the Geocoding API, then an error message is shown.

Also, after an error occurs, the last successfully fetched data is shown in the weather information sections.

![Error message](assets/img/error.jpg)

### Responsive design

The webpage is made responsive by design so that users can enjoy a seamless experience both in bigger screens like laptops and desktops as well as in smaller screens like mobiles and tablets.

#### Desktop view

![Desktop View](assets/img/desktop-view.jpg)

#### Tablet view

![Tablet View](assets/img/tablet-view.jpg)

#### Mobile view

![Mobile View](assets/img/mobile-view.jpg)

## Setup Instructions

**Step 1:** Clone the GitHub repository in local system.

```bash
git clone https://github.com/soumalyapakrashi/simple-weather-app.git
```

**Step 2:** Open the downloaded folder in [VSCode](https://code.visualstudio.com/) (or any other editor of choice).

**Step 3:** Install the _Live Server_ extension of VSCode by Ritwick Dey from the _Extensions_ tab (or respective Live Server application for editor of choice).

![VSCode Live Server](assets/img/live-server-vscode.jpg)

**Step 4:** Open the `index.html` file in VSCode and click on the _Go Online_ button. It will open the website in the default browser.

![Go Live VSCode](assets/img/go-live-vscode.jpg)

## References

1. UI Kit: [Bootstrap 5](https://getbootstrap.com/)
2. Geocoding API: [Nominatim](https://nominatim.org/)
3. Weather API: [The WeatherAPI](https://www.weatherapi.com/)
4. Wind Categories referenced from [The Beaufort Wind Scale](https://www.rmets.org/metmatters/beaufort-wind-scale)
5. UV Index ranges referenced from [United States Environmental Protection Agency](https://www.epa.gov/sites/default/files/documents/uviguide.pdf)
6. Humidity Categorization Data from [ResearchGate](https://www.researchgate.net/figure/Relative-humidity-categorization_tbl1_42385503)
7. Icon SVGs from [SVGRepo](https://www.svgrepo.com/).
8. UI Design reference from [Dribble](https://dribbble.com/shots/20449736-Weather-App).
