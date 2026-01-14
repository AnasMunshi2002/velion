const Neo4jService = require("../services/neo4jService");
const DjangoService = require("../services/djangoService");

class GraphController {
  async generateKnowledgeGraph(req, res) {
    try {
      const { entityId, entityType, depth = 2, limit = 50 } = req.query;

      let graphData = {};

      if (entityId && entityType) {
        // Generate graph around specific entity
        graphData = await Neo4jService.getEntityGraph({
          entityId,
          entityType,
          depth: parseInt(depth),
          limit: parseInt(limit),
        });
      } else {
        // Generate overview graph
        graphData = await Neo4jService.getOverviewGraph(parseInt(limit));
      }

      // Enhance graph data with additional information
      const enhancedGraph = await this.enhanceGraphData(graphData);

      res.status(200).json({
        success: true,
        data: enhancedGraph,
        metadata: {
          generatedAt: new Date().toISOString(),
          entityId,
          entityType,
          depth,
          totalNodes: enhancedGraph.nodes.length,
          totalEdges: enhancedGraph.edges.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async enhanceGraphData(graphData) {
    const self = this; // Store reference to this
    const enhancedNodes = graphData.nodes.map((node) => {
      let additionalData = {};

      switch (node.label) {
        case "Document":
          additionalData = {
            title: node.properties.title || "Sample Document",
            qualityScore: 85,
            status: "approved",
            tags: ["sample"],
            createdDate: new Date().toISOString(),
            icon: "description",
          };
          break;

        case "User":
          additionalData = {
            name: node.properties.name || "Sample User",
            department: "IT",
            expertiseLevel: "intermediate",
            icon: "person",
          };
          break;

        case "Project":
          additionalData = {
            name: node.properties.name || "Sample Project",
            status: "active",
            client: "Sample Client",
            icon: "project",
          };
          break;

        default:
          additionalData = {
            icon: "default",
          };
      }

      return {
        ...node,
        ...additionalData,
        color: self.getNodeColor(node.label),
        size: self.calculateNodeSize(node, additionalData),
      };
    });

    return {
      nodes: enhancedNodes,
      edges: graphData.edges.map((edge) => ({
        ...edge,
        width: self.calculateEdgeWidth(edge),
        label: edge.type.replace(/_/g, " "),
        color: self.getEdgeColor(edge.type),
      })),
    };
  }

  getNodeColor(nodeType) {
    const colors = {
      Document: "#4caf50",
      User: "#2196f3",
      Project: "#9c27b0",
      Knowledge: "#ff9800",
      Client: "#f44336",
      Department: "#607d8b",
    };
    return colors[nodeType] || "#757575";
  }

  calculateNodeSize(node, additionalData) {
    let size = 20; // Base size

    switch (node.label) {
      case "Document":
        size += (additionalData.qualityScore || 0) / 10;
        break;
      case "User":
        size +=
          additionalData.expertiseLevel === "SENIOR"
            ? 15
            : additionalData.expertiseLevel === "LEAD"
            ? 20
            : 0;
        break;
      case "Project":
        size += 10;
        break;
    }

    return Math.max(20, Math.min(100, size));
  }

  calculateEdgeWidth(edge) {
    const weights = {
      AUTHORED: 3,
      BELONGS_TO: 2,
      TAGGED_WITH: 2,
      RELATED_TO: 1,
      WORKS_ON: 2,
      MENTORS: 3,
    };
    return weights[edge.type] || 1;
  }

  getEdgeColor(edgeType) {
    const colors = {
      AUTHORED: "#4caf50",
      BELONGS_TO: "#2196f3",
      TAGGED_WITH: "#ff9800",
      RELATED_TO: "#9c27b0",
      WORKS_ON: "#f44336",
      MENTORS: "#607d8b",
    };
    return colors[edgeType] || "#757575";
  }

  async findConnections(req, res) {
    try {
      const { sourceId, targetId } = req.query;

      const connections = await Neo4jService.findPaths({
        sourceId,
        targetId,
        maxDepth: 4,
      });

      // Format paths for visualization
      const formattedPaths = connections.map((path) => ({
        nodes: path.nodes.map((node) => ({
          id: node.id,
          type: node.labels[0],
          properties: node.properties,
        })),
        edges: path.relationships.map((rel) => ({
          source: rel.startNodeElementId,
          target: rel.endNodeElementId,
          type: rel.type,
          properties: rel.properties,
        })),
        length: path.length,
        weight: this.calculatePathWeight(path),
      }));

      res.status(200).json({
        success: true,
        data: {
          paths: formattedPaths,
          shortestPath: formattedPaths[0],
          totalPaths: formattedPaths.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  calculatePathWeight(path) {
    // Calculate weight based on relationship types and node properties
    let weight = 0;

    path.relationships.forEach((rel) => {
      switch (rel.type) {
        case "AUTHORED":
          weight += 10;
          break;
        case "MENTORS":
          weight += 8;
          break;
        case "WORKS_ON":
          weight += 6;
          break;
        case "TAGGED_WITH":
          weight += 4;
          break;
        case "RELATED_TO":
          weight += 2;
          break;
        default:
          weight += 1;
      }
    });

    return weight;
  }
}

module.exports = new GraphController();
