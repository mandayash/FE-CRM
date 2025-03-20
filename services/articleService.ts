import apiClient from "@/lib/api";

export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  author_id: number;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ArticleListResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}

export const articleService = {
  // Mendapatkan semua artikel
  getAllArticles: async (
    page = 1,
    limit = 10
  ): Promise<ArticleListResponse> => {
    try {
      const response = await apiClient.get(
        `/articles?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }
  },

  // Mendapatkan artikel berdasarkan ID
  getArticleById: async (id: number): Promise<Article> => {
    try {
      const response = await apiClient.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching article with ID ${id}:`, error);
      throw error;
    }
  },

  // Membuat artikel baru
  createArticle: async (
    articleData: Omit<
      Article,
      | "id"
      | "author_id"
      | "view_count"
      | "created_at"
      | "updated_at"
      | "published_at"
    >
  ): Promise<Article> => {
    try {
      const response = await apiClient.post("/articles", articleData);
      return response.data;
    } catch (error) {
      console.error("Error creating article:", error);
      throw error;
    }
  },

  // Mengupdate artikel
  updateArticle: async (
    id: number,
    updatedData: Partial<
      Omit<
        Article,
        | "id"
        | "author_id"
        | "view_count"
        | "created_at"
        | "updated_at"
        | "published_at"
      >
    >
  ): Promise<Article> => {
    try {
      const response = await apiClient.put(`/articles/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating article with ID ${id}:`, error);
      throw error;
    }
  },

  // Menghapus artikel
  deleteArticle: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/articles/${id}`);
    } catch (error) {
      console.error(`Error deleting article with ID ${id}:`, error);
      throw error;
    }
  },
};
