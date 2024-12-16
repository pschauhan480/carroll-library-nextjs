import mongoose from "mongoose";

const { Schema } = mongoose;

export let BookReviewsModel, AuditLogModel;

export function InitMongoConnection(mongoURL) {
    if (mongoose.connection.readyState == 1) {
        return;
    }
    const bookReviewSchema = new Schema({
        bookid: String,
        review: String,
        rating: Number,
    });
    BookReviewsModel = mongoose.model("book_review", bookReviewSchema);

    const auditLogSchema = new Schema({
        log: Schema.Types.Mixed,
        createdBy: String,
        createdAt: Schema.Types.Date,
        updatedBy: String,
        updatedAt: Schema.Types.Date,
    });
    AuditLogModel = mongoose.model("audit_log", auditLogSchema);

    try {
        mongoose.connect(mongoURL);
        console.log("mongo connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the mongo database:", error);
    }
}
