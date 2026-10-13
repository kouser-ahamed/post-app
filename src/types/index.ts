export interface PostReactions {
  likes: number;
  dislikes: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: PostReactions;
  views: number;
  userId: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreatePostPayload {
  title: string;
  body: string;
  tags: string[];
  userId: number;
}

export interface UpdatePostPayload {
  title?: string;
  body?: string;
  tags?: string[];
}

export interface DeletePostResponse extends Post {
  isDeleted: boolean;
  deletedOn: string;
}

export interface PostFormData {
  title: string;
  body: string;
  tags: string;
}

export interface PostFormErrors {
  title?: string;
  body?: string;
  tags?: string;
}
