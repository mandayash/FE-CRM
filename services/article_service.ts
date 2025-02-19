import { authService } from "./auth_service";
import {
  Article,
  ArticleStatus,
  ArticleResponse,
  CreateArticleData,
  UpdateArticleData,
} from "@/types/article";

const BASE_URL = "http://localhost:8081";
const ADMIN_URL = `${BASE_URL}/api/admin/articles`;
const SUPER_ADMIN_URL = `${BASE_URL}/api/super-admin/articles`;
const PUBLIC_URL = `${BASE_URL}/articles`;

// Define API response article structure
interface ApiArticle {
  ID: string;
  Title: string;
  Content: string;
  Image: string;
  Status: number;
  MakingDate: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
}

// Helper to map API response to our Article type
const mapArticleFromResponse = (articleData: ApiArticle): Article => ({
  id: articleData.ID,
  title: articleData.Title,
  content: articleData.Content,
  image: articleData.Image,
  status: articleData.Status,
  making_date: articleData.MakingDate,
});

export const articleService = {
  // Create a new article (Admin/Super Admin)
  createArticle: async (data: CreateArticleData): Promise<ArticleResponse> => {
    try {
      const response = await fetch(ADMIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          meta: {
            action: "create",
          },
          data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create article");
      }

      const result = (await response.json()) as {
        message?: string;
        article?: ApiArticle;
      };
      return {
        message: result.message,
        data: result.article
          ? mapArticleFromResponse(result.article)
          : undefined,
      };
    } catch (error) {
      throw error;
    }
  },

  // Update an article (Admin/Super Admin)
  updateArticle: async (data: UpdateArticleData): Promise<ArticleResponse> => {
    try {
      const response = await fetch(ADMIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          meta: {
            action: "update",
          },
          data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update article");
      }

      const result = (await response.json()) as {
        message?: string;
        article?: ApiArticle;
      };
      return {
        message: result.message,
        data: result.article
          ? mapArticleFromResponse(result.article)
          : undefined,
      };
    } catch (error) {
      throw error;
    }
  },

  // List all articles
  listArticles: async (): Promise<Article[]> => {
    try {
      const response = await fetch(PUBLIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meta: {
            action: "list",
          },
          data: {},
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }

      const result = (await response.json()) as { articles?: ApiArticle[] };

      // Check if articles array exists and map it to our Article type
      if (result.articles && Array.isArray(result.articles)) {
        return result.articles.map(mapArticleFromResponse);
      }

      return [];
    } catch (error) {
      console.error("Error fetching articles:", error);
      return [];
    }
  },

  // Get article by ID
  getArticleById: async (id: string): Promise<Article | null> => {
    try {
      const response = await fetch(PUBLIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meta: {
            action: "get",
          },
          data: { id },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch article");
      }

      const result = (await response.json()) as { article?: ApiArticle };

      // Check if article exists and map it to our Article type
      if (result.article) {
        return mapArticleFromResponse(result.article);
      }

      return null;
    } catch (error) {
      console.error("Error fetching article:", error);
      throw error;
    }
  },

  // List articles by status
  listArticlesByStatus: async (status: ArticleStatus): Promise<Article[]> => {
    try {
      const response = await fetch(PUBLIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meta: {
            action: "list_by_status",
          },
          data: { status },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch articles by status");
      }

      const result = (await response.json()) as { articles?: ApiArticle[] };

      // Check if articles array exists and map it to our Article type
      if (result.articles && Array.isArray(result.articles)) {
        return result.articles.map(mapArticleFromResponse);
      }

      return [];
    } catch (error) {
      console.error("Error fetching articles by status:", error);
      return [];
    }
  },

  // Delete article (Admin/Super Admin)
  deleteArticle: async (id: string): Promise<ArticleResponse> => {
    try {
      const response = await fetch(ADMIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          meta: {
            action: "delete",
          },
          data: { id },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete article");
      }

      const result = (await response.json()) as { message?: string };
      return {
        message: result.message,
      };
    } catch (error) {
      throw error;
    }
  },

  // Change article status (Super Admin only)
  changeArticleStatus: async (
    id: string,
    status: ArticleStatus
  ): Promise<ArticleResponse> => {
    try {
      const response = await fetch(SUPER_ADMIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          meta: {
            action: "change_status",
          },
          data: { id, status },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to change article status");
      }

      const result = (await response.json()) as {
        message?: string;
        article?: ApiArticle;
      };
      return {
        message: result.message,
        data: result.article
          ? mapArticleFromResponse(result.article)
          : undefined,
      };
    } catch (error) {
      throw error;
    }
  },

  // Helper function to get status text
  getStatusText: (status: ArticleStatus): string => {
    switch (status) {
      case ArticleStatus.DRAFT:
        return "Draft";
      case ArticleStatus.PUBLISHED:
        return "Terkirim";
      case ArticleStatus.DENIED:
        return "Gagal";
      default:
        return "Unknown";
    }
  },

  // Helper function to get status color
  getStatusColor: (status: ArticleStatus): string => {
    switch (status) {
      case ArticleStatus.DRAFT:
        return "bg-[#4B5563] text-[#FFFFFF]"; // Gray for draft
      case ArticleStatus.PUBLISHED:
        return "bg-[#EEFBD1] text-[#1F5305]"; // Green for published
      case ArticleStatus.DENIED:
        return "bg-[#FCE6CF] text-[#CF0000]"; // Red for denied
      default:
        return "bg-gray-100 text-gray-800"; // Gray for unknown
    }
  },

  // Add to auth_service.ts
  getUserRole: (): "admin" | "super_admin" => {
    const token = authService.getToken();
    if (!token) return "admin"; // Default to admin if no token

    try {
      // This assumes your JWT has a 'role' claim
      // You'll need to adjust based on your actual JWT structure
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role === "super_admin" ? "super_admin" : "admin";
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return "admin"; // Default to admin on error
    }
  },
};
