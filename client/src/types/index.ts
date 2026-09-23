export type Platform = 'x' | 'linkedin' | 'instagram';

export type PostStatus = 'draft' | 'approved' | 'rejected' | 'published';

export type WorkflowStep = 'ingest' | 'generate' | 'review' | 'publish';

export interface Blog {
  id: string;
  user_id: string;
  content: string;
  post_url?: string | null;
  created_at?: string;
}

export interface Post {
  id: string;
  user_id: string;
  status: PostStatus;
  blog_id: string;
  x_post: string;
  linkedin_post: string;
  instagram_post: string;
  blog_content?: string;
  post_url?: string | null;
}

export interface PlatformConfig {
  id: Platform;
  name: string;
  displayName: string;
  maxLength: number;
  maxHashtags: number;
  tone: string;
  badge: string;
  placeholder: string;
  accentClass: string;
}

export interface IngestResponse {
  message?: string;
  blogId: string;
  content: string;
  post_url?: string | null;
}

export interface GenerateResponse {
  postId: string;
  x_post: string;
  linkedin_post: string;
  instagram_post: string;
  success?: boolean;
  message?: string;
}

export interface ReviewResponse {
  sucess: boolean;
  result: {
    status: PostStatus;
  };
}

export interface PublishResponse {
  sucess: boolean;
  message: string;
  error?: any;
}

export interface ServerHealthResponse {
  status: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
