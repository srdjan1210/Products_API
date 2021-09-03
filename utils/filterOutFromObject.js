module.exports = (obj, ...filters) => {
    let retObj = new Object(obj);
    filters.forEach(el => {
        retObj[el] = undefined;
    });
    return retObj;
}