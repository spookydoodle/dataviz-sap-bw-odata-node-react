const BWoData = require('./BWoData');
const { TestScheduler } = require('jest');

// TODO finish tests, mock connection and test each function
const brand = "TH";
const server = "http://testserver.com";
const port = "8080";
const service = "testqueryservice"
const query = "testquery"

// Test that errors appear when select and top are not requested
test("Test that error is thrown if no select and no top parameters are specified", async () => {
    const url = new BWoData(server, port, service, query).url

    // expect(url)
});

// Test that errors appear when select is not requested
test("Test that error is thrown if no select and no top parameters are specified", async () => {
    const url = new BWoData(server, port, service, query)
        .select(['dim1', 'dim2'])
        .url
    expect()
});

// Test that errors appear when top are not requested
test("Test that error is thrown if no select and no top parameters are specified", async () => {
    const url = new BWoData(server, port, service, query)
        .setTop('50')
        .url
});
