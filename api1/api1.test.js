// setting up unit tests for API 1 - convert 'model' and 'year' into car value
const { modelToNum } = require("./api1")

describe("API 1 test cases", ()=> {
    // test("1. Ideal test: enter 'Starlet', 1998 and return 11498", () => {
    //     expect(modelToNum("Starlet", 1998)).toBe(11498);
    // });
    test("2. Test model input hybrid char: enter 'ix35', 2013 and return 5313", () => {
        expect(modelToNum("ix35", 2013)).toBe(5313);
    });
    test.todo("3. Test model input num: enter '404', 1969. Return 1969");
    test.todo("4. Test invalid model char: enter 'Santa-Fe', 2012 return error");
    test.todo("5. Test negative year: enter 'Vitz', -2000 return error");
    test.todo("6. Test invalid year input type: enter 'Demio', twenty thirteen return error");
})