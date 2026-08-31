import { apiPost, apiGet } from './client';
import { ApiResponse, ChatMessage } from '../types';

export async function sendChatMessage(stationId: string, message: string, history: ChatMessage[] = []): Promise<ApiResponse<ChatMessage>> {
  const res = await apiPost<any>(`/api/polar-ai/chat`, {
    question: message,
    station_id: stationId,
    session_id: 'session-' + stationId
  });

  return {
    ...res,
    data: {
      role: 'assistant',
      content: res.answer || res.response || res.data?.content || '',
      sources: res.sources || res.data?.sources || [],
      source_type: res.source || res.source_type || 'offline',
      timestamp: new Date().toISOString()
    }
  };
}

export async function fetchAISuggestions(stationId: string): Promise<ApiResponse<string[]>> {
  const res = await apiGet<any>(`/api/polar-ai/suggestions?station_id=${stationId}`);
  return {
    ...res,
    data: res.suggestions || res.data || []
  };
}
