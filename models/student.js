const studentSchema = new mongoose.Schema({
    roll_no: Number,
    name: String,
    year: Number,
    subjects: [String]
});

const Student = mongoose.model('Student', studentSchema);