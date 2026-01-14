import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Paper,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as CenterIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import ForceGraph2D from 'react-force-graph-2d';
import { graphAPI } from '../services/api';

const KnowledgeGraph = () => {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [depth, setDepth] = useState(2);
  const [nodeLimit, setNodeLimit] = useState(100);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [graphType, setGraphType] = useState('overview');
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [highlightedEdges, setHighlightedEdges] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const graphRef = useRef();

  const fetchGraphData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        depth,
        limit: nodeLimit
      };

      if (graphType === 'specific' && selectedEntity) {
        params.entityId = selectedEntity.id;
        params.entityType = selectedEntity.type;
      }

      const response = await graphAPI.getGraph(params);

      if (response.data.success) {
        setGraphData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching graph:', error);
    } finally {
      setLoading(false);
    }
  }, [depth, nodeLimit, graphType, selectedEntity]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  const handleNodeClick = (node) => {
    setSelectedEntity(node);

    // Highlight connected nodes
    const connectedNodes = new Set();
    const connectedEdges = new Set();

    graphData.edges.forEach(edge => {
      if (edge.source === node.id || edge.target === node.id) {
        connectedEdges.add(edge.id);
        connectedNodes.add(edge.source);
        connectedNodes.add(edge.target);
      }
    });

    setHighlightedNodes(connectedNodes);
    setHighlightedEdges(connectedEdges);
  };

  const handleNodeHover = (node) => {
    setHoverNode(node);
  };

  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(1.2, 100);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(0.8, 100);
    }
  };

  const handleCenterView = () => {
    if (graphRef.current) {
      graphRef.current.centerAt(0, 0, 100);
      graphRef.current.zoom(1, 100);
    }
  };

  const nodeCanvasObject = (node, ctx, globalScale) => {
    const label = node.name || node.title || node.id.substring(0, 8);
    const fontSize = 12 / globalScale;
    const nodeSize = node.size || 20;

    // Draw node circle
    ctx.beginPath();
    ctx.fillStyle = highlightedNodes.has(node.id)
      ? this.darkenColor(node.color, 0.3)
      : node.color;
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
    ctx.fill();

    // Draw border for selected node
    if (selectedEntity?.id === node.id) {
      ctx.beginPath();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2 / globalScale;
      ctx.arc(node.x, node.y, nodeSize + 2, 0, 2 * Math.PI, false);
      ctx.stroke();
    }

    // Draw icon
    if (node.icon) {
      ctx.font = `${fontSize * 1.5}px Material Icons`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const iconChar = this.getIconChar(node.icon);
      ctx.fillText(iconChar, node.x, node.y);
    }

    // Draw label
    if (globalScale > 0.5) {
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(label, node.x, node.y + nodeSize + 5);
    }
  };

  const linkCanvasObject = (link, ctx, globalScale) => {
    if (!link.source || !link.target) return;

    const start = link.source;
    const end = link.target;

    // Calculate line width based on weight and scale
    const lineWidth = (link.width || 1) / Math.max(globalScale, 0.5);

    // Draw line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = highlightedEdges.has(link.id)
      ? this.darkenColor(link.color, 0.3)
      : link.color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Draw arrowhead for directed edges
    if (link.directed) {
      const headLength = 10 / globalScale;
      const angle = Math.atan2(end.y - start.y, end.x - start.x);

      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - headLength * Math.cos(angle - Math.PI / 6),
        end.y - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        end.x - headLength * Math.cos(angle + Math.PI / 6),
        end.y - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = link.color;
      ctx.fill();
    }

    // Draw label
    if (globalScale > 0.8 && link.label) {
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;

      ctx.save();
      ctx.translate(midX, midY);
      //ctx.rotate(angle);

      ctx.font = `${10 / globalScale}px Arial`;
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(link.label, 0, -10 / globalScale);

      ctx.restore();
    }
  };

  const NodeDetailsPanel = () => {
    if (!selectedEntity) return null;

    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {selectedEntity.name || selectedEntity.title || 'Node Details'}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Chip
              label={selectedEntity.type}
              color="primary"
              size="small"
            />
          </Grid>

          {selectedEntity.department && (
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Department:</strong> {selectedEntity.department}
              </Typography>
            </Grid>
          )}

          {selectedEntity.expertiseLevel && (
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Expertise:</strong> {selectedEntity.expertiseLevel}
              </Typography>
            </Grid>
          )}

          {selectedEntity.qualityScore && (
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Quality Score:</strong> {selectedEntity.qualityScore}/100
              </Typography>
            </Grid>
          )}

          {selectedEntity.tags && selectedEntity.tags.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                <strong>Tags:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedEntity.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                // Navigate to entity detail page
                console.log('Navigate to:', selectedEntity);
              }}
            >
              View Details
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', p: 2 }}>
      <Grid container spacing={2}>
        {/* Controls Panel */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Graph Controls
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Graph Type</InputLabel>
                <Select
                  value={graphType}
                  onChange={(e) => setGraphType(e.target.value)}
                  label="Graph Type"
                >
                  <MenuItem value="overview">Overview</MenuItem>
                  <MenuItem value="specific">Specific Entity</MenuItem>
                  <MenuItem value="connections">Find Connections</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  Exploration Depth: {depth}
                </Typography>
                <Slider
                  value={depth}
                  onChange={(e, newValue) => setDepth(newValue)}
                  min={1}
                  max={5}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  Node Limit: {nodeLimit}
                </Typography>
                <Slider
                  value={nodeLimit}
                  onChange={(e, newValue) => setNodeLimit(newValue)}
                  min={10}
                  max={500}
                  step={10}
                  marks={[
                    { value: 50, label: '50' },
                    { value: 200, label: '200' },
                    { value: 500, label: '500' }
                  ]}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ZoomInIcon />}
                  onClick={handleZoomIn}
                  fullWidth
                >
                  Zoom In
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ZoomOutIcon />}
                  onClick={handleZoomOut}
                  fullWidth
                >
                  Zoom Out
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<CenterIcon />}
                  onClick={handleCenterView}
                  fullWidth
                >
                  Center View
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => {/* Export graph */ }}
                >
                  Export
                </Button>
              </Box>
            </CardContent>
          </Card>

          <NodeDetailsPanel />
        </Grid>

        {/* Graph Visualization */}
        <Grid item xs={12} md={9}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', p: 0, position: 'relative' }}>
              {loading ? (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}>
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>
                    Generating knowledge graph...
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1000,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    padding: 1,
                    borderRadius: 1
                  }}>
                    <Typography variant="caption">
                      {graphData.nodes.length} nodes • {graphData.edges.length} edges
                    </Typography>
                  </Box>

                  <ForceGraph2D
                    ref={graphRef}
                    graphData={graphData}
                    nodeLabel={node => node.name || node.title || node.id}
                    nodeColor={node => node.color || '#666666'}
                    nodeRelSize={node => node.size || 20}
                    linkLabel={link => link.label || link.type}
                    linkColor={link => link.color || '#999999'}
                    linkWidth={link => link.width || 1}
                    onNodeClick={handleNodeClick}
                    onNodeHover={handleNodeHover}
                    onLinkClick={link => console.log('Link clicked:', link)}
                    nodeCanvasObject={nodeCanvasObject}
                    linkCanvasObject={linkCanvasObject}
                    backgroundColor="#ffffff"
                    width={800}
                    height={600}
                    cooldownTime={3000}
                  />

                  {hoverNode && (
                    <Tooltip
                      title={hoverNode.name || hoverNode.title || hoverNode.id}
                      open
                      placement="top"
                    >
                      <Box sx={{ position: 'absolute', bottom: 10, left: 10 }}>
                        <Paper sx={{ p: 1 }}>
                          <Typography variant="body2">
                            Hovering: {hoverNode.name || hoverNode.title}
                          </Typography>
                        </Paper>
                      </Box>
                    </Tooltip>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default KnowledgeGraph;