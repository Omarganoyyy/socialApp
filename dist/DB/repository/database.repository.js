"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
class DatabaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findOne({ filter, select, options, }) {
        const doc = this.model.findOne(filter).select(select || "");
        // if(options?.populate)
        // {
        //     doc.populate(options.populate)  
        // }
        if (options?.lean) {
            doc.lean(options.lean);
        } //mabetraga3s el extras zy username w last name only returns email and id
        return await doc.exec();
    }
    async create({ data, options }) {
        return await this.model.create(data, options);
    }
    async updateOne({ filter, update, options, }) {
        return await this.model.updateOne(filter, { ...update, $inc: { _v: 1 } }, options);
    }
    async findByIdAndUpdate({ id, update, options = { new: true }, }) {
        return this.model.findByIdAndUpdate(id, { ...update, $inc: { _v: 1 } }, options);
    }
    async deleteOne({ filter, }) {
        return this.model.deleteOne(filter);
    }
    async findOneAndUpdate({ filter, update, options = { new: true }, }) {
        return this.model.findOneAndUpdate(filter, { ...update, $inc: { __v: 1 } }, options);
    }
    async find({ filter, select, options, }) {
        const doc = this.model.find(filter || {}).select(select || "");
        if (options?.populate) {
            doc.populate(options.populate);
        }
        if (options?.lean) {
            doc.lean(options.lean);
        }
        return await doc.exec();
    }
}
exports.DatabaseRepository = DatabaseRepository;
