/*
    This function acts as an intermediary for API call. It calls given API with given parameters
    and returns the data if response code is 200 (success). If response code is anything other than
    200 (which means there is an error), then it throws an error message.
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

// Function converts a given date value to a Day of Week string value.
export function getDayName(input_date) {
    // Sunday is considered the first day of week. Thus, list starts from Sunday.
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Creating a Date object from the input date
    const date = new Date(input_date);

    // Getting the day as a number (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    const dayOfWeekNumber = date.getDay();
    
    return days[dayOfWeekNumber];
};

export function getDateString(input_date) {
    const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
        'September', 'October', 'November', 'December'
    ];

    const date = new Date(input_date);
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}
