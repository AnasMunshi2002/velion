const DjangoService = require("../services/djangoService");
const AIService = require("../services/aiService");

class SearchController {
  async searchKnowledge(req, res) {
    try {
      const { query, filters = {}, page = 1, limit = 20 } = req.query;

      let results = [];

      // Check if query is natural language
      if (this.isNaturalLanguageQuery(query)) {
        // Use AI-powered semantic search
        const semanticResults = await AIService.semanticSearch({
          query,
          filters,
          limit: parseInt(limit),
        });
        results = semanticResults;
      } else {
        // Use traditional keyword search
        results = await DjangoService.searchDocuments({
          query,
          filters,
          page: parseInt(page),
          limit: parseInt(limit),
        });
      }

      // Enhance results with additional metadata
      const enhancedResults = await this.enhanceSearchResults(results);

      // Get total count for pagination
      const totalCount = await DjangoService.getSearchCount({ query, filters });

      res.status(200).json({
        success: true,
        data: {
          results: enhancedResults,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalCount,
            totalPages: Math.ceil(totalCount / parseInt(limit)),
          },
          query: query,
          filters: filters,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  isNaturalLanguageQuery(query) {
    // Check if query appears to be natural language
    const words = query.trim().split(/\s+/);
    if (words.length > 3) {
      return true;
    }

    // Check for question words
    const questionWords = [
      "what",
      "how",
      "why",
      "when",
      "where",
      "who",
      "which",
    ];
    const firstWord = words[0].toLowerCase();
    return questionWords.includes(firstWord) || query.includes("?");
  }

  async enhanceSearchResults(results) {
    return Promise.all(
      results.map(async (doc) => {
        // Get additional metadata
        const knowledgeComponent = await DjangoService.getKnowledgeComponent(
          doc.id
        );
        const uploader = await DjangoService.getUserById(doc.uploader);

        return {
          ...doc,
          metadata: {
            ...doc.metadata,
            uploaderName: `${uploader.first_name} ${uploader.last_name}`,
            uploaderDepartment: uploader.department,
            expertiseLevel: uploader.expertise_level,
          },
          knowledgeComponent: knowledgeComponent
            ? {
                summary: knowledgeComponent.summary,
                keyTopics: knowledgeComponent.key_topics,
                sentimentScore: knowledgeComponent.sentiment_score,
                complexityScore: knowledgeComponent.complexity_score,
              }
            : null,
          relevanceScore: this.calculateRelevanceScore(doc),
          quickActions: this.generateQuickActions(doc),
        };
      })
    );
  }

  calculateRelevanceScore(doc) {
    // Calculate relevance score based on multiple factors
    let score = 0;

    // Quality score contributes 40%
    if (doc.quality_score) {
      score += doc.quality_score * 0.4;
    }

    // Recency contributes 30% (more recent = higher score)
    const ageInDays =
      (new Date() - new Date(doc.created_at)) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 100 - ageInDays * 0.5);
    score += recencyScore * 0.3;

    // Popularity (views/downloads) contributes 30%
    const popularityScore = Math.min(100, (doc.view_count || 0) * 2);
    score += popularityScore * 0.3;

    return Math.min(100, Math.round(score));
  }

  generateQuickActions(doc) {
    const actions = [
      { label: "View", action: "view", icon: "visibility" },
      { label: "Download", action: "download", icon: "download" },
    ];

    if (doc.status === "PUBLISHED") {
      actions.push({ label: "Share", action: "share", icon: "share" });
      actions.push({
        label: "Add to Workspace",
        action: "add_to_workspace",
        icon: "workspace",
      });
    }

    if (doc.blockchain_tx_id) {
      actions.push({ label: "Verify", action: "verify", icon: "verified" });
    }

    return actions;
  }
}

module.exports = new SearchController();
