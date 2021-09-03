module.exports = class APIFeatures {
    constructor(query, queryString) {
        this.queryString = queryString;
        this.query = query;
    }

    filter() {
        let queryObject = { ...this.queryString };
        let excludedFields = ['sort', 'page', 'limit', 'fields'];
        
        excludedFields.forEach(el => delete queryObject[el]);
        
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        queryObject = JSON.parse(queryStr);
        
        this.query = this.query.find(queryObject);
        return this;
    }

    project() {
        if(this.queryString.fields) {
            let selectRule = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(selectRule);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    sort() {
        const sortingRule = this.queryString.sort;

        if(sortingRule) {
            const sortingRuleString = sortingRule.split(',').join(' ');
            this.query = this.query.sort(sortingRuleString);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
}


