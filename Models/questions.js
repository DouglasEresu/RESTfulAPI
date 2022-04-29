import mongoose from "mongoose";


const questionSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    question: {type: String, required: true}
});

export const QuestionModel = mongoose.model("question", questionSchema);