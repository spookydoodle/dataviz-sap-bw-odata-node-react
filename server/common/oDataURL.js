// TODO: Add checks if certain URL parameters are already present
// TODO: Error handling

class oDataURL {
    constructor(server, port, service, query) {
        this.server = server;
        this.port = port;
        this.service = service;
        this.query = query;
        this.variables = new Map();         // Expected { "<var_name>": "<var_value>", }
        this.selections = new Array();      // Expected ["<dim1>", "<dim2>"]
        this.filters = new Map();           // Expected { "<dim>": ["<dim_value>"], }
        this.order = new Map();             // Expected { "<dim_name>": "asc/desc", }
        this.top = undefined;
        this.skip = undefined;
        // this.baseURL = `http://${this.server}:${this.port}/sap/opu/odata/sap/${this.service}/${this.query}`;
        // this.urlString = `${this.baseURL}Results?$format=json`;
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

        
        console.log("this:");
        console.log(this);

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

    applySelections = () => {
        if (this.selections.length > 0) {
            this.urlString += `&$select=${this.selections.join(',')}`;
        }
    }

    // TODO: add option to exclude or add other conditions: 'eq' , 'ne' , 'le' , 'lt' , 'ge' , 'gt' 
    applyFilters = () => {
        if (this.filters.size > 0) {
            this.urlString += `&$filter=`;

            for (let [dimension, valArr] of this.filters) {
                this.urlString += `(${dimension} eq '${valArr.join(`' or ${dimension} eq '`)}') and `
            }

            // Remove ' and ' after the last element
            this.removeFromEnd(5);
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

    // TODO: Get metadata and check variable type and apply url parameters accordingly (single value, interval/selection)
    // TODO: Add a check if the variable url parameter already exists in url, if yes, add new ones after a comma
    setVariable = (variable, value) => {
        this.variables.set(variable, value);
        console.log("Variables: ", this.variables);

        return this;
    }

    select = dimArr => {
        this.selections = [...dimArr];
        console.log("Selections: ", this.selections);

        return this;
    }

    // Client might pass empty array as filtering criteria which should be ignored
    filter = (dimension, valArr) => {
        this.filters.set(dimension, valArr);
        console.log("Filters: ", this.filters);
        // if(valArr && valArr.length > 0) {
        //     this.urlString = `${this.urlString}&$filter=${dimension} eq '${valArr.join(`' or ${dimension} eq '`)}'`;
        // }

        return this;
    }

    // TODO: error handling for 'order by 'dim' is not supported' - appears for measures
    orderBy = (dimension, sort) => {
        this.order.set(dimension, sort);
        console.log("Order: ", this.order);

        return this;
    }

    setTop = n => {
        this.top = n;
        console.log("Top: ", this.top);

        return this;
    }

    setSkip = n => {
        this.skip = n;
        console.log("Skpi: ", this.skip);

        return this;
    }

}


module.exports = oDataURL;