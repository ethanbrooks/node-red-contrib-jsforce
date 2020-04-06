"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsforce = require("jsforce");
module.exports = function (RED) {
    function JsForceNode(config) {
        let node = this;
        RED.nodes.createNode(this, config);
        this.on('input', (msg) => __awaiter(this, void 0, void 0, function* () {
            var conn = new jsforce.Connection({
            // you can change loginUrl to connect to sandbox or prerelease env.
            // loginUrl : 'https://test.salesforce.com'
            });
            let username = 'ethan';
            let password = '88';
            conn.login(username, password, function (err, userInfo) {
                if (err) {
                    return console.error(err);
                }
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
        }));
    }
    RED.nodes.registerType('jsforce', JsForceNode);
};
