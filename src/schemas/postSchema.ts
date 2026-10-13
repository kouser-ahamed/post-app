import type { PostFormData, PostFormErrors } from '../types';

export const validatePostForm = (data: PostFormData): { isValid: boolean; errors: PostFormErrors } => {
  const errors: PostFormErrors = {};

  const trimmedTitle = data.title.trim();
  if (!trimmedTitle) {
    errors.title = 'Title is required';
  } else if (trimmedTitle.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  const trimmedBody = data.body.trim();
  if (!trimmedBody) {
    errors.body = 'Body is required';
  } else if (trimmedBody.length < 5) {
    errors.body = 'Body must be at least 5 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const parseTagsString = (rawTags: string): string[] => {
  return rawTags
    .split(',')
    .map((tag) => tag.replace(/^#+/, '').trim())
    .filter(Boolean);
};
