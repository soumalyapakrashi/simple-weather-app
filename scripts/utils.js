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

export function getDayName(input_date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const date = new Date(input_date); // Creating a Date object from the input date

    // Getting the day as a number (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    const dayOfWeekNumber = date.getDay();
    
    return days[dayOfWeekNumber];
};
