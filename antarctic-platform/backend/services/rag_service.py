from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class RAGService:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.documents = []
        self.tfidf_matrix = None
        self.is_fitted = False

    async def load_documents(self, db_col):
        docs = await db_col.find({}).to_list(length=None)
        self.documents = []
        texts = []
        for doc in docs:
            for i, chunk in enumerate(doc.get("chunks", [])):
                self.documents.append({
                    "doc_id": str(doc["_id"]),
                    "title": doc["title"],
                    "chunk_text": chunk,
                })
                texts.append(chunk)
        
        if texts:
            self.tfidf_matrix = self.vectorizer.fit_transform(texts)
            self.is_fitted = True

    def retrieve(self, query: str, top_k: int = 3):
        if not self.is_fitted:
            return []
        
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.05:
                res = self.documents[idx].copy()
                res["score"] = float(similarities[idx])
                results.append(res)
        return results

    async def get_context_for_query(self, query: str, station_id: str, db_col):
        if not self.is_fitted:
            await self.load_documents(db_col)
        return self.retrieve(query)

rag_service = RAGService()
