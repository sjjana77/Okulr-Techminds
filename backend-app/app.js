const express = require('express');
const bodyParser = require('body-parser');
const FormRoutes = require('./routes/FormRoutes');
const app = express();
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');




const corsOptions = {
  origin: ['http://localhost/', 'http://localhost:3000/react_task', 'http://localhost:3000', 'http://localhost/', 'http://localhost:3001/react_task', 'http://localhost:3001', 'https://github.com/'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    if (file.originalname == 'blob') {
      ext = ".webm";
    }
    else {
      ext = ".pdf";

    }
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    cb(null, 'data_' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

app.post('/react_task/upload_pdf', upload.single('pdf'), (req, res) => {
  res.send(req.file.path);
});

app.post('/react_task/upload_video', upload.single('video'), (req, res) => {
  res.send(req.file.path);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/react_task/forms', FormRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
