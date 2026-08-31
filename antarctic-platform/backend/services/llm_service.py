import httpx
from core.config import settings

class LLMService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"

    async def chat(self, prompt: str, context_chunks: list, station_context: dict):
        context_str = "\n".join([c["chunk_text"] for c in context_chunks])
        system_prompt = f"You are PolarAI, assisting {station_context.get('station_id')} station. Context:\n{context_str}"
        
        if not self.api_key:
            return {
                "answer": "Offline Mode: Based on context, " + (context_str[:200] if context_str else "no context found."),
                "source": "offline",
                "model": "local-fallback",
                "tokens_used": 0
            }
            
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    self.api_url,
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "model": "llama3-8b-8192",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt}
                        ]
                    },
                    timeout=10.0
                )
                res.raise_for_status()
                data = res.json()
                return {
                    "answer": data["choices"][0]["message"]["content"],
                    "source": "groq",
                    "model": "llama3-8b-8192",
                    "tokens_used": data.get("usage", {}).get("total_tokens", 0)
                }
        except Exception as e:
            return {
                "answer": f"Offline Mode (Error: {str(e)}): " + (context_str[:200] if context_str else "no context found."),
                "source": "offline",
                "model": "local-fallback",
                "tokens_used": 0
            }

    async def health_check(self):
        if not self.api_key:
            return {"status": "offline", "reason": "No API Key"}
        return {"status": "online"}

llm_service = LLMService()
