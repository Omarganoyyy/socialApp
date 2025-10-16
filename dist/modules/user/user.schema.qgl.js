"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQlOneUserResponse = exports.GraphQlGenderEnum = void 0;
const graphql_1 = require("graphql");
const model_1 = require("../../DB/model");
const user_service_1 = __importDefault(require("./user.service"));
exports.GraphQlGenderEnum = new graphql_1.GraphQLEnumType({
    name: "GraphQLGenderEnum",
    values: {
        male: { value: model_1.GenderEnum.male },
        female: { value: model_1.GenderEnum.female },
    }
});
exports.GraphQlOneUserResponse = new graphql_1.GraphQLObjectType({
    name: "OneUserResponse",
    fields: {
        id: { type: graphql_1.GraphQLID },
        name: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            description: "userName",
        },
        email: { type: graphql_1.GraphQLString },
        gender: { type: exports.GraphQlGenderEnum },
    }
});
let users = [
    {
        id: 1,
        name: "omar",
        email: "omarganoyyy@gmail.com",
        gender: model_1.GenderEnum.male,
        password: "748787",
        followers: [],
    },
    {
        id: 2,
        name: "mohamed",
        email: "mohamedganoyyy@gmail.com",
        gender: model_1.GenderEnum.male,
        password: "748787",
        followers: [],
    },
    {
        id: 3,
        name: "sara",
        email: "saraganoyyy@gmail.com",
        gender: model_1.GenderEnum.female,
        password: "748787",
        followers: [],
    }
];
class UserGQLSchema {
    constructor() { }
    registerQuery = () => {
        return {
            sayHi: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                description: "this field return our server welcome message",
                resolve: (parent, args) => {
                    return "Hello graphQl";
                }
            },
            allUsers: {
                type: new graphql_1.GraphQLList(new graphql_1.GraphQLObjectType({
                    name: "oneUserResponse",
                    fields: {
                        id: { type: graphql_1.GraphQLID },
                        name: { type: graphql_1.GraphQLString },
                        email: { type: graphql_1.GraphQLString },
                    }
                })),
                args: {
                    name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                    gender: {
                        type: new graphql_1.GraphQLEnumType({
                            name: "GraphQlGenderEnum",
                            values: {
                                male: { value: model_1.GenderEnum.male },
                                female: { value: model_1.GenderEnum.female },
                            },
                        })
                    }
                },
                resolve: (parent, args) => {
                    const user = users.find(ele => ele.email === args.email);
                    return { message: "Done", data: { users } };
                },
            }
        };
    };
    registerMutation = () => {
        return {
            addFollower: {
                type: new graphql_1.GraphQLList(exports.GraphQlOneUserResponse),
                args: {
                    friendId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
                    myId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
                },
                resolve: (parent, args) => {
                    users = user_service_1.default.map((ele) => {
                        if (ele._id === args.friendId) {
                            ele.followers.push(args.myId);
                        }
                        return ele;
                    });
                }
            }
        };
    };
}
exports.default = new UserGQLSchema;
