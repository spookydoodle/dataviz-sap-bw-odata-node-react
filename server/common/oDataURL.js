// TODO: Add checks if certain URL parameters are already present
// TODO: Error handling

class oDataURL {
    constructor(server, port, service, query) {
        this.server = server;
        this.port = port;
        this.service = service;
        this.query = query;
        this.variables = {},    // Expected { "<var_name>": "<var_value>", }
        this.selections = {},   // Expected { "<dim>": { key: "", text: ""}, }
        this.filters = {},      // Expected { "<dim>": ["<dim_value>"], }
        this.order = {},        // Expected { "<dim_name>": "asc/desc", }
        this.top = undefined,
        this.skip = undefined,
        this.baseURL = `http://${this.server}:${this.port}/sap/opu/odata/sap/${this.service}`;
        this.urlString = `${this.baseURL}Results?$format=json`;
    }

    get url() {
        if(this.urlString.indexOf('$select') === -1) {
            throw new Error(`No columns specified. Select at least one dimension or measure using .select() method.`);
        }
        return this.urlString;
    }

    create = (
        variables = {}, 
        dimensions = {}, 
        measures = {}, 
        filters = {}, 
        order = {}, 
        top = undefined, 
        skip = undefined
        ) => {

        // Add variables
        Object.keys(variables).forEach(variable => this.setVariable(variable, variables[variable]))

        // Select dimensions and measures
        this.select([...flatten(dimensions), ...flatten(measures)])
        
        // Apply filters
        Object.keys(filters).forEach(dim => this.filter(dim, filters[dim]))
        
        // Order by dimension
        Object.keys(order).forEach(dim => this.orderBy(dim, order[dim]))

        // Apply top and skip rows
        top ? this.top(top) : null
        skip ? this.top(skip) : null
    }

    // Default fixed to json, optionally add a method to change to xml
    // format = format => {
    //     this.url.concat(`&$format=${format}`);
    //     return this;
    // }

    // TODO: Get metadata and check variable type and apply url parameters accordingly (single value, interval/selection)
    // TODO: Add a check if the variable url parameter already exists in url, if yes, add new ones after a comma
    setVariable = (variable, value) => {
        this.urlString = this.urlString.indexOf(")/") === -1 ? (
            `${this.baseURL}/${this.query}(${variable}=${value})/${this.urlString.substring(this.urlString.indexOf('Results'))}`
        ) : (
            `${this.urlString.substring(0, this.urlString.indexOf(")/"))},${variable}=${value}${this.urlString.substring(this.urlString.indexOf(")/"))}`
        ) 
        return this;
    }

    select = dimArr => {
        this.urlString = `${this.urlString}&$select=${dimArr.join()}`;
        return this;
    }

    filter = (dimension, valArr) => {
        this.urlString = `${this.urlString}&$filter=${dimension} eq '${valArr.join(`' or ${dimension} eq '`)}'`;
        return this;
    }

    // TODO: error handling for 'order by 'dim' is not supported' - appears for measures
    orderBy = (dimension, sort) => {
        this.urlString = `${this.urlString}&$orderby=${dimension} ${sort}`;
        return this;
    }

    top = n => {
        this.urlString = `${this.urlString}&$top=${n}`;
        return this;
    }

    skip = n => {
        this.urlString = `${this.urlString}&$skip=${n}`;
        return this;
    }

}


module.exports = oDataURL;