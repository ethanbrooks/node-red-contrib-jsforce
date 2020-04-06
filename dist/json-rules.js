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
const json_rules_engine_1 = require("jsforce-engine");
module.exports = function (RED) {
    function JsForceNode(config) {
        RED.nodes.createNode(this, config);
        this.on('input', (msg) => __awaiter(this, void 0, void 0, function* () {
            let options = {
                allowUndefinedFacts: false
            };
            let engine = new json_rules_engine_1.Engine([], options);
            const accountClient = require('./support/account-api-client');
            const rules = JSON.parse(config.rules).rules;
            for (let index = 0; index < rules.length; index++) {
                const rule = rules[index];
                engine.addRule(rule);
            }
            engine
                .on('success', (event, almanac) => {
                this.send({ event, passed: true });
                almanac.addRuntimeFact(event.type + '-passed', true);
            })
                .on('failure', (event, almanac) => {
                almanac.addRuntimeFact(event.type + '-passed', false);
                this.send({ event, passed: false });
            });
            /**
             * 'account-information' fact executes an api call and retrieves account data
             * - Demonstrates facts called only by other facts and never mentioned directly in a rule
             */
            engine.addFact('account-information', (params, almanac) => {
                return almanac.factValue('accountId')
                    .then(accountId => {
                    return accountClient.getAccountInformation(accountId);
                })
                    .catch((error) => {
                    return this.send(error);
                });
            });
            /**
             * 'employee-tenure' fact retrieves account-information, and computes the duration of employment
             * since the account was created using 'accountInformation.createdAt'
             */
            engine.addFact('employee-tenure', (params, almanac) => {
                return almanac.factValue('account-information')
                    .then((accountInformation) => {
                    const created = new Date(accountInformation.createdAt);
                    const now = new Date();
                    switch (params.unit) {
                        case 'years':
                            return now.getFullYear() - created.getFullYear();
                        case 'milliseconds':
                        default:
                            return now.getTime() - created.getTime();
                    }
                })
                    .catch((error) => {
                    return this.send(error);
                });
            });
            // define fact(s) known at runtime
            const facts = msg.payload;
            engine
                .run(facts)
                .then((response) => {
                return this.send(response);
            })
                .catch((error) => {
                return this.send(error);
            });
        }));
    }
    RED.nodes.registerType('jsforce', JsForceNode);
};
