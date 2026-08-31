import httpx
from core.config import settings

class LLMService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.default_model = "openai/gpt-oss-120b"

    async def chat(self, prompt: str, context_chunks: list, station_context: dict):
        context_str = "\n".join([c["chunk_text"] for c in context_chunks]) if context_chunks else ""
        station_id = station_context.get("station_id", "Maitri")
        
        system_prompt = (
            f"You are PolarAI, the expert AI Assistant for Indian Antarctic Research Stations (Maitri & Bharati) "
            f"under the National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences (MoES).\n"
            f"Active Station: {station_id.upper()}.\n"
            f"Reference SOP Context:\n{context_str}\n\n"
            f"Provide concise, operational, and actionable advice for station personnel."
        )
        
        if not self.api_key:
            return {
                "answer": "Offline Mode: Based on SOP records, " + (context_str[:250] if context_str else "All systems operating nominally."),
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
                        "model": self.default_model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.3,
                        "max_tokens": 400
                    },
                    timeout=15.0
                )
                if res.status_code == 200:
                    data = res.json()
                    return {
                        "answer": data["choices"][0]["message"]["content"],
                        "source": "groq",
                        "model": self.default_model,
                        "tokens_used": data.get("usage", {}).get("total_tokens", 0)
                    }
                else:
                    # Try secondary model if primary model errors
                    fallback_res = await client.post(
                        self.api_url,
                        headers={"Authorization": f"Bearer {self.api_key}"},
                        json={
                            "model": "openai/gpt-oss-20b",
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": prompt}
                            ],
                            "max_tokens": 400
                        },
                        timeout=15.0
                    )
                    if fallback_res.status_code == 200:
                        data = fallback_res.json()
                        return {
                            "answer": data["choices"][0]["message"]["content"],
                            "source": "groq",
                            "model": "openai/gpt-oss-20b",
                            "tokens_used": data.get("usage", {}).get("total_tokens", 0)
                        }
                    raise Exception(f"Groq API error {res.status_code}: {res.text}")
        except Exception as e:
            return {
                "answer": f"PolarAI (Autonomous Fallback): Based on station SOP database, " + (context_str[:250] if context_str else "Emergency protocols active. Ensure all personnel check in at muster station."),
                "source": "offline-fallback",
                "model": "local-rules-engine",
                "tokens_used": 0
            }

    async def health_check(self):
        if not self.api_key:
            return {"status": "offline", "reason": "No API Key"}
        return {"status": "online", "model": self.default_model}

llm_service = LLMService()
