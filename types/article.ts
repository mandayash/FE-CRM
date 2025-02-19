// src/types/article.ts

// Article Status enum for better type safety
export enum ArticleStatus {
  DRAFT = 1,
  PUBLISHED = 2,
  DENIED = 3,
}

// Base article interface
export interface Article {
  id: string;
  title: string;
  content: string;
  image: string;
  status: ArticleStatus;
  making_date: string;
}

// Request types
interface RequestMeta {
  action:
    | "create"
    | "update"
    | "list"
    | "get"
    | "list_by_status"
    | "delete"
    | "change_status";
}

export interface BaseRequest<T> {
  meta: RequestMeta;
  data: T;
}

// Create article
export interface CreateArticleData {
  title: string;
  content: string;
  image: string;
  status: ArticleStatus;
  making_date: string;
}

export type CreateArticleRequest = BaseRequest<CreateArticleData>;

// Update article
export interface UpdateArticleData {
  id: string;
  title: string;
  content: string;
  image: string;
  status: ArticleStatus;
  making_date: string;
}

export type UpdateArticleRequest = BaseRequest<UpdateArticleData>;

// List articles
// Using Record<never, never> for empty object type instead of empty interface
export type ListArticlesData = Record<string, never>;

export type ListArticlesRequest = BaseRequest<ListArticlesData>;

// Get article by ID
export interface GetArticleData {
  id: string;
}

export type GetArticleRequest = BaseRequest<GetArticleData>;

// List by status
export interface ListByStatusData {
  status: ArticleStatus;
}

export type ListByStatusRequest = BaseRequest<ListByStatusData>;

// Delete article
export interface DeleteArticleData {
  id: string;
}

export type DeleteArticleRequest = BaseRequest<DeleteArticleData>;

// Change status
export interface ChangeStatusData {
  id: string;
  status: ArticleStatus;
}

export type ChangeStatusRequest = BaseRequest<ChangeStatusData>;

// Response types
export interface ArticleResponse {
  message?: string;
  data?: Article | Article[];
}
