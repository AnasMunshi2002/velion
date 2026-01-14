import { useState } from 'react';
import {
    Box,
    TextField,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    IconButton,
    Button,
    Menu,
    MenuItem,
    LinearProgress,
    Pagination
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Sort as SortIcon,
    Visibility as ViewIcon,
    Download as DownloadIcon,
    Share as ShareIcon,
    Workspaces as WorkspaceIcon,
    Verified as VerifiedIcon
} from '@mui/icons-material';
import { searchAPI } from '../services/api';

const KnowledgeSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        documentType: [],
        qualityScore: [0, 100],
        dateRange: 'all',
        tags: [],
        department: ''
    });
    const [sortBy, setSortBy] = useState('relevance');
    const [anchorEl, setAnchorEl] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    const documentTypes = [
        'PROPOSAL', 'REPORT', 'PRESENTATION', 'CONTRACT',
        'RESEARCH', 'GUIDELINE', 'TEMPLATE', 'OTHER'
    ];

    const departments = [
        'Consulting', 'Strategy', 'Research', 'Operations',
        'Finance', 'Marketing', 'Technology', 'Human Resources'
    ];

    const handleSearch = async (page = 1) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const response = await searchAPI.search({
                query: searchQuery,
                filters,
                sortBy,
                page,
                limit: pagination.limit
            });

            if (response.data.success) {
                setSearchResults(response.data.data.results);
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleSortChange = (sortOption) => {
        setSortBy(sortOption);
        setAnchorEl(null);
    };

    const handlePageChange = (event, page) => {
        setPagination(prev => ({ ...prev, page }));
        handleSearch(page);
    };

    const renderResultCard = (result) => (
        <Card key={result.id} sx={{ mb: 2, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="h6" gutterBottom>
                                {result.title}
                            </Typography>
                            <Chip
                                label={result.document_type}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            {result.description || result.knowledgeComponent?.summary}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" sx={{ mr: 2 }}>
                                Quality: {result.quality_score}/100
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={result.quality_score}
                                sx={{ flexGrow: 1, mr: 2 }}
                            />
                            <Typography variant="caption">
                                Relevance: {result.relevanceScore}%
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {result.tags.slice(0, 5).map((tag, index) => (
                                <Chip key={index} label={tag} size="small" />
                            ))}
                            {result.tags.length > 5 && (
                                <Chip label={`+${result.tags.length - 5}`} size="small" />
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Typography variant="caption" color="textSecondary">
                                By {result.metadata.uploaderName} • {result.metadata.uploaderDepartment}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Box>
                                <Typography variant="caption" color="textSecondary">
                                    {new Date(result.created_at).toLocaleDateString()} •
                                    Version: {result.version} •
                                    {result.file_size && ` ${(result.file_size / 1024 / 1024).toFixed(1)} MB`}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {result.quickActions.map((action, index) => (
                                    <IconButton
                                        key={index}
                                        size="small"
                                        title={action.label}
                                        onClick={() => handleAction(action.action, result)}
                                    >
                                        {action.icon === 'visibility' && <ViewIcon />}
                                        {action.icon === 'download' && <DownloadIcon />}
                                        {action.icon === 'share' && <ShareIcon />}
                                        {action.icon === 'workspace' && <WorkspaceIcon />}
                                        {action.icon === 'verified' && <VerifiedIcon />}
                                    </IconButton>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

    const handleAction = (action, document) => {
        // Implement action handlers
        console.log(action, document);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Search Bar */}
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search knowledge base... (e.g., 'Find blockchain projects in logistics' or 'How to create client proposals?')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                        endAdornment: (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                    onClick={() => setAnchorEl(document.getElementById('sort-button'))}
                                    id="sort-button"
                                >
                                    <SortIcon />
                                </IconButton>
                                <IconButton onClick={() => {/* Open filter drawer */ }}>
                                    <FilterIcon />
                                </IconButton>
                                <Button
                                    variant="contained"
                                    onClick={() => handleSearch()}
                                    disabled={loading || !searchQuery.trim()}
                                >
                                    Search
                                </Button>
                            </Box>
                        )
                    }}
                />

                {/* Quick Tips */}
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    Tip: Use natural language queries for better results. Try questions like
                    "best practices for client onboarding" or "recent AI strategy documents"
                </Typography>
            </Box>

            {/* Sort Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={() => handleSortChange('relevance')}>
                    Relevance
                </MenuItem>
                <MenuItem onClick={() => handleSortChange('recent')}>
                    Most Recent
                </MenuItem>
                <MenuItem onClick={() => handleSortChange('quality')}>
                    Highest Quality
                </MenuItem>
                <MenuItem onClick={() => handleSortChange('popular')}>
                    Most Viewed
                </MenuItem>
            </Menu>

            {/* Search Results */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <LinearProgress sx={{ width: '100%' }} />
                </Box>
            ) : searchResults.length > 0 ? (
                <>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Found {pagination.total} results for "{searchQuery}"
                    </Typography>

                    {searchResults.map(renderResultCard)}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={pagination.totalPages}
                                page={pagination.page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </>
            ) : searchQuery ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            No results found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Try different keywords or check your search filters
                        </Typography>
                    </CardContent>
                </Card>
            ) : null}
        </Box>
    );
};

export default KnowledgeSearch;