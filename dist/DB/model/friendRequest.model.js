"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRequestModel = void 0;
const mongoose_1 = require("mongoose");
const friendRequestSchmena = new mongoose_1.Schema({
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    sendTo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    acceptedAt: Date,
    createdAt: Date,
    updatedAt: Date,
}, {
    timestamps: true,
    strictQuery: true,
});
friendRequestSchmena.pre(["find", 'findOne', "countDocuments"], function (next) {
    const query = this.getQuery();
    if (query.paranoid === false) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ ...query, freezedAt: { $exists: false } });
    }
    console.log(this.getQuery());
    next();
});
friendRequestSchmena.pre(["updateOne", 'findOneAndUpdate'], function (next) {
    const query = this.getQuery();
    if (query.paranoid === false) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ ...query, freezedAt: { $exists: false } });
    }
    next();
});
exports.FriendRequestModel = mongoose_1.models.friendRequest || (0, mongoose_1.model)("FriendRequest", friendRequestSchmena);
