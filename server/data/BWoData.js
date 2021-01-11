const { flatten } = require('./convertObj');

// See here for URI convention: https://www.odata.org/documentation/odata-version-2-0/uri-conventions/
class BWoData {
    constructor(name, server, port, service, query, credentials) {
        this.name = name;
        this.server = server;
        this.port = port;
        this.service = service;
        this.query = query;
        this.credentials = credentials;     // Base64 encoded username:pass
        this.variables = new Map();         // Expected { "<var_name>": "<var_value>", }
        this.selections = {};               // Expected { "<dim1>", "<dim2>" }
        this.filters = new Map();           // Expected { "<dim>": ["<dim_value>"], }
        this.filterOutValues = new Map();   // Expected { "<dim>": ["<dim_value>"], }
        this.order = new Map();             // Expected { "<dim_name>": "asc/desc", }
        this.top = undefined;
        this.skip = undefined;
        this.urlString = '';
    }

    get url() {
        this.urlString = `http://${this.server}:${this.port}/sap/opu/odata/sap/${this.service}/${this.query}`

        this.applyVariables();
        this.applyFormat();
        this.applySelections();
        this.applyFilters();
        this.applyOrder();
        this.applyTop();
        this.applySkip();

        // Assure that characteristics are selected to avoid performance issues
        if (this.urlString.indexOf('$select') === -1) {
            throw new Error(`No columns specified. Select at least one dimension or measure using .select() method.`);
        }

        // Assure that number of rows to pull from data is specified. Getting too many rows will slow down the application
        if (this.urlString.indexOf('$top') === -1) {
            throw new Error(`Specify number of records to pull using .setTop() method.`);
        }

        console.log("Generated URL string: ");
        console.log(this.urlString);

        return this.urlString;
    }

    removeFromEnd = (n) => {
        this.urlString = this.urlString.substring(0, this.urlString.length - n);
    }

    applyVariables = () => {
        if (this.variables.size > 0) {
            this.urlString += "(";

            for (let [variable, value] of this.variables) {
                this.urlString += `${variable}=${value},`
            }

            // Remove comma after the last element
            this.removeFromEnd(1);
            this.urlString += `)/Results?`;
        }
        else {
            this.urlString += "Results?";
        }
    }

    applyFormat = () => {
        this.urlString += "$format=json";
    }

    // Selections are provided in JSON format, which should also be reflected 
    // in the result set sent in response to the client. 
    //      Example: { brand: { key: "ZBRAND", text: "ZBRAND_T"} }
    
    applySelections = () => {
        if (Object.values(this.selections).length > 0) {
            // The 'flatten' method extracts the array of technical names, which are passed
            // in this.selections as object values. 
            //      Example: flatten({ brand: { key: "ZBRAND", text: "ZBRAND_T"} }) = ["ZBRAND", "ZBRAND_T"]
            const selectionsArr = flatten(this.selections);
            this.urlString += `&$select=${selectionsArr.join(',')}`;
        }
    }

    // TODO: add option to exclude or add other conditions: 'eq' , 'ne' , 'le' , 'lt' , 'ge' , 'gt' 
    applyFilters = () => {
        if (this.filters.size > 0) {
            this.urlString += `&$filter=`;

            for (let [dimension, valArr] of this.filters) {
                this.urlString += `(${dimension} eq '${valArr.join(`' or ${dimension} eq '`)}') and `
            }

            // Filter if includes pattern.
            // Only one value can be provided for one dimension.
            // BW returns error "filter criteria too complex" if you try to add 'and' condition 
            // for filtering out multiple patterns on one dimension
            if (this.filterOutValues.size > 0) {
                for (let [dimension, val] of this.filterOutValues) {
                    this.urlString += `(not substringof('${val}',${dimension}))`
                }
            } else {
                // Remove ' and ' after the last element
                this.removeFromEnd(5);
            }


        }
    }

    applyOrder = () => {
        if (this.order.size > 0) {
            this.urlString += `&$orderby=`;

            for (let [dimension, sort] of this.order) {
                this.urlString += `${dimension} ${sort},`
            }

            // Remove comma after the last element
            this.removeFromEnd(1);
        }
    }

    applyTop = () => {
        if (this.top) {
            this.urlString += `&$top=${this.top}`;
        }
    }

    applySkip = () => {
        if (this.skip) {
            this.urlString += `&$skip=${this.skip}`;
        }
    }

    setVariable = (variable, value) => {
        this.variables.set(variable, value);

        return this;
    }

    select = selectJSON => {
        this.selections = selectJSON;

        return this;
    }

    // Client might pass empty array as filtering criteria which should be ignored
    filter = (dimension, valArr) => {
        this.filters.set(dimension, valArr);

        return this;
    }

    // Filter out pattern
    filterOut = (dimension, val) => {
        this.filterOutValues.set(dimension, val);

        return this;
    }

    // TODO: error handling for 'order by 'dim' is not supported' - appears for measures
    orderBy = (dimension, sort) => {
        this.order.set(dimension, sort);

        return this;
    }

    setTop = n => {
        this.top = n;

        return this;
    }

    setSkip = n => {
        this.skip = n;

        return this;
    }

}


module.exports = BWoData;