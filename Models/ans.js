import mongoose from "mongoose";


const answerSchema = new mongoose.Schema({
    id: {type: String, required: true},
    answer: {type: String, required: true}
});

export const AnswerModel = mongoose.model("answers", answerSchema);