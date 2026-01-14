const DjangoService = require("../services/djangoService");
const AIService = require("../services/aiService");
const BlockchainService = require("../services/blockchainService");
const { v4: uuidv4 } = require("uuid");

class DocumentController {
  async uploadDocument(req, res) {
    try {
      const { title, description, fileData, metadata, uploaderId } = req.body;

      // Step 1: Generate document ID and hash
      const documentId = uuidv4();
      const contentHash = await this.calculateHash(fileData);

      // Step 2: Save basic document info to Django
      const documentData = {
        id: documentId,
        title,
        description,
        content_hash: contentHash,
        uploader: uploaderId,
        metadata: {
          ...metadata,
          originalFilename: metadata.originalFilename,
          uploadTimestamp: new Date().toISOString(),
        },
        file_url: await this.storeFile(fileData, documentId),
        file_size: Buffer.from(fileData, "base64").length,
        file_type: metadata.fileType,
        status: "PENDING_REVIEW",
      };

      const savedDocument = await DjangoService.createDocument(documentData);

      // Step 3: AI Processing
      const aiResults = await AIService.processDocument({
        content: fileData,
        documentId: savedDocument.id,
        title,
        description,
      });

      // Step 4: Update document with AI results
      const updatedDocument = await DjangoService.updateDocument(
        savedDocument.id,
        {
          tags: aiResults.tags,
          quality_score: aiResults.qualityScore,
          summary: aiResults.summary,
          status:
            aiResults.qualityScore >= 80 ? "UNDER_REVIEW" : "PENDING_REVIEW",
        }
      );

      // Step 5: Create knowledge component
      await DjangoService.createKnowledgeComponent({
        document: savedDocument.id,
        summary: aiResults.summary,
        key_topics: aiResults.keyTopics,
        entities: aiResults.entities,
        sentiment_score: aiResults.sentimentScore,
        complexity_score: aiResults.complexityScore,
        validation_status:
          aiResults.qualityScore >= 80 ? "PENDING" : "REQUIRES_REVIEW",
      });

      // Step 6: If high quality, initiate blockchain verification
      if (aiResults.qualityScore >= 90) {
        await BlockchainService.initiateVerification({
          documentId: savedDocument.id,
          contentHash: contentHash,
          title: title,
        });
      }

      res.status(201).json({
        success: true,
        data: {
          document: updatedDocument,
          aiResults: {
            qualityScore: aiResults.qualityScore,
            tags: aiResults.tags,
            summary: aiResults.summary,
          },
          nextSteps:
            aiResults.qualityScore >= 80
              ? "Document under review for publication"
              : "Document requires manual review",
        },
        message: "Document uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async calculateHash(data) {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  async storeFile(fileData, documentId) {
    // Implementation for storing file in cloud storage
    const filename = `${documentId}_${Date.now()}`;
    // Upload to S3 or similar service
    return `https://storage.dkn.com/documents/${filename}`;
  }
}

module.exports = new DocumentController();
