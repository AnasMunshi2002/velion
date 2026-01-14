class AIService {
  async analyzeDocument(content) {
    // Placeholder for AI analysis
    return {
      summary: "Document analyzed successfully",
      keywords: ["knowledge", "management"],
      sentiment: "neutral",
    };
  }

  async generateEmbeddings(text) {
    // Placeholder for embeddings
    return [0.1, 0.2, 0.3]; // dummy vector
  }
}

module.exports = new AIService();
