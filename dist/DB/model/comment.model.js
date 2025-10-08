"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentModel = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    commentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" },
    content: { type: String, minLength: 2, maxLength: 50000, required: function () {
            return !this.attachments?.length;
        }
    },
    attachments: [String],
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    freezedAt: Date,
    freezedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    restoredAt: Date,
    restoredBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    createdAt: Date,
    updatedAt: Date,
}, {
    timestamps: true,
    strictQuery: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});
commentSchema.pre(["find", 'findOne', "countDocuments"], function (next) {
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
commentSchema.pre(["updateOne", 'findOneAndUpdate'], function (next) {
    const query = this.getQuery();
    if (query.paranoid === false) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ ...query, freezedAt: { $exists: false } });
    }
    next();
});
commentSchema.virtual("reply", {
    localField: "_id",
    foreignField: "commentId",
    ref: "Comment",
    justOne: true,
});
exports.commentModel = mongoose_1.models.comment || (0, mongoose_1.model)("comment", commentSchema);
