import { engineerInsights, radioCalls } from '../data/mockData';
import { EngineerInsight, InsightCategory, TopicCategory } from '../types';

/**
 * The only signal available in backend data to classify an insight's
 * category is the topic of its linked radio call, so that mapping is
 * applied consistently for every insight that resolves to one.
 */
const TOPIC_TO_CATEGORY: Record<TopicCategory, InsightCategory> = {
  'TYRE / GRIP': 'Tyre Concern',
  'CAR BALANCE': 'Performance Risk',
  'ENGINE / TEMP': 'Performance Risk',
  'BRAKE BIAS': 'Performance Risk',
  'TRAFFIC / GAP': 'Communication Alert',
  'STRATEGY': 'Communication Alert',
  'GENERAL': 'Driver State'
};

/** Uses the first sentence of `message` as a short title; falls back to the full message if there's no sentence break. */
const deriveTitle = (message: string): string => {
  const firstSentence = message.split('.')[0].trim();
  return firstSentence.length > 0 ? firstSentence : message;
};

/**
 * Enriches a raw stored insight with the fields the frontend EngineerInsight
 * contract requires but that aren't stored directly. Everything here is
 * derived from the insight's own `message` plus its linked radio call —
 * nothing is invented:
 *  - category      <- linked radio call's topic (mapped via TOPIC_TO_CATEGORY)
 *  - lapNumber      <- linked radio call's lapNumber
 *  - title          <- first sentence of message
 *  - summary        <- message (message already serves as the summary text)
 *  - primaryConcern <- linked radio call's highlightedPhrase
 *  - evidence       <- linked radio call's keyPhrases
 *  - acknowledged   <- false (no persisted acknowledgment state exists in the backend)
 * `actionSuggested` is intentionally left undefined: there is no backend
 * data (e.g. an engineer's recommended action) to derive it from.
 */
const enrichInsight = (insight: EngineerInsight): EngineerInsight => {
  const linkedRadioCall = insight.relatedRadioCallId
    ? radioCalls.find(r => r.id === insight.relatedRadioCallId)
    : undefined;

  return {
    ...insight,
    category: linkedRadioCall ? TOPIC_TO_CATEGORY[linkedRadioCall.topic] : undefined,
    lapNumber: linkedRadioCall?.lapNumber,
    title: deriveTitle(insight.message),
    summary: insight.message,
    primaryConcern: linkedRadioCall?.highlightedPhrase,
    evidence: linkedRadioCall?.keyPhrases ?? [],
    acknowledged: false
  };
};

export const insightService = {
  getAllInsights: (): EngineerInsight[] => engineerInsights.map(enrichInsight),

  getInsightById: (id: string): EngineerInsight | undefined => {
    const insight = engineerInsights.find(i => i.id === id);
    return insight ? enrichInsight(insight) : undefined;
  }
};