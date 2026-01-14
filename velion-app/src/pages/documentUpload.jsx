import React, { useState, useRef } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    LinearProgress,
    Alert,
    Chip,
    Grid,
    Paper,
    IconButton
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Close as CloseIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { documentAPI } from '../services/api';

const DocumentUpload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [aiResults, setAiResults] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
                setMessage({
                    type: 'error',
                    text: 'File size exceeds 50MB limit'
                });
                return;
            }

            setFile(selectedFile);
            if (!title) {
                setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
            }
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleUpload = async () => {
        if (!file || !title.trim()) {
            setMessage({
                type: 'error',
                text: 'Please select a file and provide a title'
            });
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setMessage({ type: '', text: '' });

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const fileData = event.target.result.split(',')[1];

                // Simulate upload progress
                const progressInterval = setInterval(() => {
                    setUploadProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(progressInterval);
                            return 90;
                        }
                        return prev + 10;
                    });
                }, 300);

                const uploaderId = JSON.parse(localStorage.getItem('user')).id;

                const response = await documentAPI.upload({
                    title,
                    description,
                    fileData,
                    metadata: {
                        originalFilename: file.name,
                        fileType: file.type,
                        fileSize: file.size
                    },
                    tags,
                    uploaderId
                });

                clearInterval(progressInterval);
                setUploadProgress(100);

                if (response.data.success) {
                    setAiResults(response.data.data.aiResults);
                    setMessage({
                        type: 'success',
                        text: 'Document uploaded and processed successfully!'
                    });

                    // Reset form after successful upload
                    setTimeout(() => {
                        setFile(null);
                        setTitle('');
                        setDescription('');
                        setTags([]);
                        setAiResults(null);
                        setUploadProgress(0);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    }, 3000);
                } else {
                    setMessage({
                        type: 'error',
                        text: response.data.error || 'Upload failed'
                    });
                }
            };

            reader.onerror = () => {
                setMessage({
                    type: 'error',
                    text: 'Error reading file'
                });
                setUploading(false);
            };

            reader.readAsDataURL(file);
        } catch (error) {
            setMessage({
                type: 'error',
                text: `Upload failed: ${error.message}`
            });
        } finally {
            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
            }, 1000);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Upload Knowledge Document
                    </Typography>

                    {message.text && (
                        <Alert severity={message.type} sx={{ mb: 2 }}>
                            {message.text}
                        </Alert>
                    )}

                    <Grid container spacing={3}>
                        {/* File Upload Section */}
                        <Grid item xs={12}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    border: '2px dashed',
                                    borderColor: 'grey.300',
                                    backgroundColor: 'grey.50',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: 'primary.lightest'
                                    }
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept=".pdf,.doc,.docx,.txt,.md,.ppt,.pptx,.xls,.xlsx"
                                    style={{ display: 'none' }}
                                />

                                <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />

                                <Typography variant="h6" gutterBottom>
                                    {file ? file.name : 'Click to select file'}
                                </Typography>

                                <Typography variant="body2" color="textSecondary">
                                    Supports PDF, Word, Excel, PowerPoint, Text files
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    Maximum file size: 50MB
                                </Typography>
                            </Paper>

                            {file && (
                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                    <CheckIcon color="success" sx={{ mr: 1 }} />
                                    <Typography variant="body2">
                                        Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setFile(null);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                            }
                                        }}
                                        sx={{ ml: 1 }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </Grid>

                        {/* Document Details */}
                        <Grid item xs={12}>
                            <TextField
                                label="Document Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                required
                                disabled={uploading}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                disabled={uploading}
                                placeholder="Brief description of the document content"
                            />
                        </Grid>

                        {/* Tags Section */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                                Tags
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TextField
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                    placeholder="Add tags (press Enter)"
                                    size="small"
                                    disabled={uploading}
                                    sx={{ flexGrow: 1, mr: 1 }}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={handleAddTag}
                                    disabled={uploading || !tagInput.trim()}
                                >
                                    Add
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        onDelete={() => handleRemoveTag(tag)}
                                        disabled={uploading}
                                    />
                                ))}
                            </Box>
                        </Grid>

                        {/* Upload Progress */}
                        {uploading && (
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ flexGrow: 1, mr: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={uploadProgress}
                                        />
                                    </Box>
                                    <Typography variant="body2">
                                        {uploadProgress}%
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="textSecondary">
                                    {uploadProgress < 100
                                        ? 'Uploading and processing with AI...'
                                        : 'Complete!'}
                                </Typography>
                            </Grid>
                        )}

                        {/* AI Results Display */}
                        {aiResults && (
                            <Grid item xs={12}>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'success.lightest' }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        AI Analysis Results
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">
                                                <strong>Quality Score:</strong> {aiResults.qualityScore}/100
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">
                                                <strong>Status:</strong> {aiResults.qualityScore >= 80 ? 'Ready for Review' : 'Needs Manual Review'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2">
                                                <strong>Generated Tags:</strong> {aiResults.tags.join(', ')}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2">
                                                <strong>Summary:</strong> {aiResults.summary}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        )}

                        {/* Upload Button */}
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                onClick={handleUpload}
                                disabled={uploading || !file}
                                fullWidth
                                size="large"
                                startIcon={uploading ? null : <UploadIcon />}
                            >
                                {uploading ? 'Processing...' : 'Upload & Process with AI'}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default DocumentUpload;