const getError = (error) => {
    if (error.message){
        return error.message;
    }
    if (error.error){
        return getError(error.error);
    }
    return "Generic Error";
}

module.exports = {
    getError
}