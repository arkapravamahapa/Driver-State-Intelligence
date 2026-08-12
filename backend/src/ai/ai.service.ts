import { HfInference } from "@huggingface/inference";
import { DriverState, Sentiment, TopicCategory } from "../types";

// Initialize Hugging Face Inference using the token from environment variables
const hf = new HfInference(process.env.HF_TOKEN);

export const aiService = {
  /**
   * Processes a radio transcript through a Hugging Face Zero-Shot Classification model
   * to determine if the driver is CALM, STRESSED, or TIRED.
   */
  analyzeTranscript: async (transcript: string) => {
    try {
      // Using facebook/bart-large-mnli for zero-shot text classification
      // This allows us to feed it our exact hackathon required states
      const result = await hf.zeroShotClassification({
        model: 'facebook/bart-large-mnli',
        inputs: transcript,
        parameters: {
          candidate_labels: ['stressed', 'tired', 'calm']
        }
      });

      // Explicitly tell TypeScript the exact shape of the Hugging Face response
      // This completely removes the red squiggly lines.
      const singleResult = (Array.isArray(result) ? result[0] : result) as unknown as {
        labels: string[];
        scores: number[];
      };

      // The Hugging Face API returns arrays of labels and scores sorted by highest confidence
      const topLabel = singleResult.labels[0];
      const confidence = Math.round(singleResult.scores[0] * 100);

      // Map the Hugging Face string result to our strict TypeScript DriverState
      let detectedState: DriverState = 'CALM';
      if (topLabel === 'stressed') detectedState = 'STRESSED';
      if (topLabel === 'tired') detectedState = 'TIRED';
      if (topLabel === 'calm') detectedState = 'CALM';

      // Determine basic sentiment based on the state for the mock contract
      const sentiment: Sentiment = topLabel === 'calm' ? 'Positive' : 'Negative';

      return {
        detectedState,
        confidence,
        sentiment,
        topic: 'GENERAL' as TopicCategory,
        keyPhrases: [transcript.substring(0, 20) + '...']
      };
      
    } catch (error) {
      console.error("Hugging Face AI Error. Ensure HF_TOKEN is set in .env.", error);
      
      // Fallback response in case the API rate limits or the token is missing
      return {
        detectedState: 'CONCERNED' as DriverState,
        confidence: 0,
        sentiment: 'Neutral' as Sentiment,
        topic: 'GENERAL' as TopicCategory,
        keyPhrases: []
      };
    }
  }
};