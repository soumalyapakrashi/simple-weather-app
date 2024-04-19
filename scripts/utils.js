/*
    This function acts as an intermediary for API call. It calls given API with given parameters
    and returns the data if response code is 200 (success). If response code is anything other than
    200 (which means there is an error), then it throws an error message.

    Function Inputs:
    1. api: Reference to the function to call for fetching data.
    2. params: Any parameters to add to the URL of the GET request.

    Function Returns: The data returned from the API call function. Refer to services.js for
        more details on data returned from each function.
*/
export async function callAPIService(api, params) {
    const response = await api(params);

    // When call is successful, but no location is found
    if(response?.status_code === 200 && response?.data?.length === 0) {
        throw "Data not found.";
    }
    // When call is not successful (example, invalid API key)
    else if(response?.status_code !== 200) {
        throw "Something went wrong. Please try again later.";
    }
    else {
        return response?.data;
    }
}

/*
    Function converts a given date value to a Day of Week string value.

    Function Inputs:
    1. input_date: The string representation of a date containing year, month and day of the month
        (eg, 2024-04-19).

    Function Returns: String representation of the day of week (eg, Sunday, Monday, etc.)
*/
export function getDayName(input_date) {
    // Sunday is considered the first day of week. Thus, list starts from Sunday.
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Creating a Date object from the input date
    const date = new Date(input_date);

    // Getting the day as a number (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    const dayOfWeekNumber = date.getDay();
    
    return days[dayOfWeekNumber];
};

/*
    Function converts a given date value to a full date string value.

    Function Inputs:
    1. input_date: The string representation of a date containing year, month and day of the month
        (eg, 2024-04-19).

    Function Returns: String representation of the current date (eg, 19 April, 2024)
*/
export function getDateString(input_date) {
    const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
        'September', 'October', 'November', 'December'
    ];

    const date = new Date(input_date);
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}
