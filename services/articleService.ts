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
  image_url?: string | null;
}

export interface ArticleListResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateArticlePayload {
  title: string;
  summary: string;
  content: string;
  is_published: boolean;
  image?: File;
}

export interface UpdateArticlePayload {
  title?: string;
  summary?: string;
  content?: string;
  is_published?: boolean;
  image?: File;
}

export const articleService = {
  // Mendapatkan semua artikel
  getAllArticles: async (
    page = 1,
    limit = 10
  ): Promise<ArticleListResponse> => {
    const response = await apiClient.get(
      `/articles?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Mencari artikel berdasarkan query
  searchArticles: async (
    query: string,
    page = 1,
    limit = 10
  ): Promise<ArticleListResponse> => {
    const response = await apiClient.get(
      `/articles/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Mendapatkan artikel berdasarkan ID
  getArticleById: async (id: number): Promise<Article> => {
    const response = await apiClient.get(`/articles/${id}`);
    return response.data;
  },

  // Membuat artikel baru (dengan gambar opsional)
  createArticle: async (articleData: FormData): Promise<Article> => {
    const response = await apiClient.post("/articles", articleData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Mengupdate artikel (dengan gambar opsional & partial form)
  updateArticle: async (
    id: number,
    data: UpdateArticlePayload
  ): Promise<Article> => {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.summary) formData.append("summary", data.summary);
    if (data.content) formData.append("content", data.content);
    if (data.is_published !== undefined) {
      formData.append("is_published", data.is_published.toString());
    }
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await apiClient.put(`/articles/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Menghapus artikel
  deleteArticle: async (id: number): Promise<void> => {
    await apiClient.delete(`/articles/${id}`);
  },

  // Generate URL gambar artikel
  getImageUrl: (imagePath: string | null | undefined): string => {
    if (!imagePath) return "";
    return `${process.env.NEXT_PUBLIC_API_URL}/article/uploads/${imagePath}`;
  },
};
