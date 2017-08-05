// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by client-server-logger.js.
import { name as packageName } from "meteor/client-server-logger";

// Write your tests here!
// Here is an example.
Tinytest.add('client-server-logger - example', function (test) {
  test.equal(packageName, "client-server-logger");
});
