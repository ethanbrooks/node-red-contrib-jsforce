import { Red, Node, NodeProperties } from 'node-red';
import * as jsforce from 'jsforce';


interface JsForceProps extends NodeProperties {
  rules: string;
  rulesType: 'json';
}

module.exports = function (RED: Red) {
  function JsForceNode ( config: JsForceProps) {
    let node = this as Node;
    RED.nodes.createNode(this, config);

    this.on('input', async msg => {


      var conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
        // loginUrl : 'https://test.salesforce.com'
      });
      let username = 'ethan';
      let password = '88';
      conn.login(username, password, function(err, userInfo) {
        if (err) { return console.error(err); }
        // Now you can get the access token and instance URL information.
        // Save them to establish connection next time.
        console.log(conn.accessToken);
        console.log(conn.instanceUrl);
        // logged in user property
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);
        // ...
      });

      /*
          return this.send(response);
        })
        .catch((error) => {
          return this.send(error);
        });
      */
    });
  }
  RED.nodes.registerType('jsforce', JsForceNode);
};
