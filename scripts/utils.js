import './services';

async function callAPIService(api, params) {
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
