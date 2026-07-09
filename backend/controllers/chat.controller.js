/**
 * Chat controller.
 *
 * Handles chatbot requests and returns
 * generated answers to the frontend.
 */

import { runRag } from "../services/rag.service.js";

export const handleChat = async (req, res) => {
  const message = req.body.message;

  try {
    const response = await runRag(message);

    res.json({
      answer: response
    });
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de l'appel RAG"
    });
  }
};