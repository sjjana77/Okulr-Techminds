import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Typography, Container, MenuItem, Grid } from '@mui/material';
import axios from 'axios';
import Webcam from 'react-webcam';

const Form = () => {
    const webcamRef = useRef(null);
    const [formdata, setFormdata] = useState({
        firstname: '',
        lastname: '',
        mobile: '',
        emailid: '',
        pdf: '',
        pdf_name: '',
        videoBlob: '',
        video_path: ''
    });
    const [recording, setRecording] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(30);
    const [responseMsg, setResponseMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name);
        setFormdata({ ...formdata, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formdataa = new FormData();
            formdataa.append('firstname', formdata.firstname);
            formdataa.append('lastname', formdata.lastname);
            formdataa.append('mobile', formdata.mobile);
            formdataa.append('emailid', formdata.emailid);
            formdataa.append('pdf', formdata.pdf);
            formdataa.append('videoBlob', formdata.videoBlob);
            const res = await axios.post(`${process.env.REACT_APP_API_URL}forms`, formdata);
            setResponseMsg('Email Sent Successfully'); 
            console.log(res);
        }
        catch (err) {
            console.log(err);
            setResponseMsg('Error submitting form');
        }

    }

    const handleUpload = async (e, type) => {
        let file;
        try {
            let formdataa = new FormData();
            if (type == "pdf") {
                file = e.target.files[0]
                formdataa.append('pdf', file);
            }
            else {
                formdataa.append('video', formdata.videoBlob);
            }
            const res = await axios.post(`${process.env.REACT_APP_API_URL}upload_${type}`, formdataa,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            if (type == "pdf") {
                setFormdata({ ...formdata, pdf: res.data, pdf_name: file.name });
            }
            else {
                setFormdata({ ...formdata, video_path: res.data });
            }

        }
        catch (err) {
            console.log(err);
        }
    }

    const startRecording = () => {
        setRecording(true);
        let timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev === 1) {
                    clearInterval(timer);
                    setRecording(false);
                    handleStopRecording();
                }
                return prev - 1;
            });
        }, 1000);

        const videoStream = webcamRef.current.video.srcObject;
        const options = { mimeType: 'video/webm' };
        const mediaRecorder = new MediaRecorder(videoStream, options);
        const chunks = [];

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const videoBlob = new Blob(chunks, { type: 'video/webm' });
            setFormdata({ ...formdata, videoBlob: videoBlob });

        };

        mediaRecorder.start();
        setTimeout(() => {
            mediaRecorder.stop();
        }, 30000); // Record for 30 seconds
    };

    const handleStopRecording = () => {
        setSecondsLeft(30);
    };

    useEffect(() => {
        console.log(formdata);
    }, [formdata])

    useEffect(() => {
        if (formdata.videoBlob !== '') {
            setSecondsLeft(3);
            handleUpload("", "video");
        }
    }, [formdata.videoBlob]);


    return (
        <Container maxWidth="sm" >
            <Typography variant="h4" align="center" gutterBottom>
                Add Form
            </Typography>
            <form onSubmit={handleSubmit} style={{ margin: "20px" }} >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            type="text"
                            name="firstname"
                            label="First Name"
                            value={formdata.firstname}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            type="text"
                            name="lastname"
                            label="Last Name"
                            value={formdata.lastname}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            type="text"
                            name="mobile"
                            label="Mobile"
                            value={formdata.mobile}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            type="text"
                            name="emailid"
                            label="Email Id"
                            value={formdata.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleUpload(e, "pdf")}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Webcam
                            ref={webcamRef}
                        />
                        {recording && <Typography>Recording... {secondsLeft} seconds left</Typography>}
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            onClick={startRecording}
                            disabled={recording}
                        >
                            Start Recording
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                    {responseMsg && <Typography>{responseMsg}</Typography>} 
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    )
}

export default Form;
