const getError = (error) => {
    if (error.message) {
        return { message: error.message, code: error.code };
    }
    if (error.error) {
        return getError(error.error);
    }
    return { message: "Generic Error" };
}

module.exports = {
    getError
}