const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

const { handleContractUpload } = require('./handleContractUpload'); 

const app = express();
const port = 5000;

const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.post('/analyse-documents', upload.single('contract'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }
        console.log('Received /analyse-document request:', req.file);
        const filePath = req.file.path;
        const mimeType = req.file.mimetype;
        const reviewText = await handleContractUpload(filePath, mimeType);
        console.log('Document review result:', reviewText);
        res.status(200).send({ review: reviewText });
    } catch (error) {
        console.error('Error reviewing contract:', error);
        res.status(500).send({ error: 'An error occurred while reviewing the contract.' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});