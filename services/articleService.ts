import apiClient from "@/lib/api";
import { Article } from "@/types/article";

export const articleService = {
  createArticle: async (
    data: Omit<Article, "id" | "created_at" | "updated_at">
  ): Promise<Article> => {
    const response = await apiClient.post("/articles", data);
    return response.data;
  },

  getAllArticles: async (): Promise<Article[]> => {
    const response = await apiClient.get("/articles");
    return response.data;
  },

  getArticleById: async (id: number): Promise<Article> => {
    const response = await apiClient.get(`/articles/${id}`);
    return response.data;
  },

  updateArticle: async (
    id: number,
    data: Partial<Article>
  ): Promise<Article> => {
    const response = await apiClient.put(`/articles/${id}`, data);
    return response.data;
  },
};
