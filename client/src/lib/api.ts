import type {
  Blog,
  GenerateResponse,
  IngestResponse,
  Post,
  PublishResponse,
  ReviewResponse,
  ServerHealthResponse,
} from '../types';

const API_BASE = ''; // uses Vite proxy configured in vite.config.ts

export async function checkHealth(): Promise<ServerHealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.statusText}`);
  }
  return res.json();
}

export async function ingestBlog(params: {
  content?: string;
  post_url?: string;
  user_id: string;
  idempotency_key: string;
}): Promise<IngestResponse> {
  const res = await fetch(`${API_BASE}/api/v1/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Failed to ingest blog content');
  }

  return res.json();
}

export async function generatePostVariants(blogId: string): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE}/api/v1/generate/${blogId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Failed to generate post variants');
  }

  return res.json();
}

export async function reviewPost(
  postId: string,
  status: 'approved' | 'rejected'
): Promise<ReviewResponse> {
  const res = await fetch(`${API_BASE}/api/v1/review/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Failed to review post');
  }

  return res.json();
}

export async function publishPost(
  postId: string,
  scheduledTime: string
): Promise<PublishResponse> {
  const res = await fetch(`${API_BASE}/api/v1/publish/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ scheduledTime }),
  });

  const data = await res.json().catch(() => ({ message: res.statusText, sucess: false }));

  if (!res.ok) {
    throw new Error(data.message || 'Failed to schedule post');
  }

  return data;
}

export async function fetchAllPosts(userId?: string): Promise<{ success: boolean; posts: Post[] }> {
  const url = userId
    ? `${API_BASE}/api/v1/posts?user_id=${encodeURIComponent(userId)}`
    : `${API_BASE}/api/v1/posts`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export async function fetchPostById(postId: string): Promise<{ success: boolean; post: Post }> {
  const res = await fetch(`${API_BASE}/api/v1/post/${postId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }
  return res.json();
}

export async function fetchBlogById(blogId: string): Promise<{ success: boolean; blog: Blog }> {
  const res = await fetch(`${API_BASE}/api/v1/blog/${blogId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch blog');
  }
  return res.json();
}
