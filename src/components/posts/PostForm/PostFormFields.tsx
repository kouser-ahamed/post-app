import type { PostFormData, PostFormErrors } from '../../../types';

export interface PostFormFieldsProps {
  formData: PostFormData;
  errors?: PostFormErrors;
  onChange: (field: keyof PostFormData, value: string) => void;
  disabled?: boolean;
}

export const PostFormFields = ({
  formData,
  errors = {},
  onChange,
  disabled = false,
}: PostFormFieldsProps) => {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Title
        </label>
        <input
          type="text"
          placeholder="Enter post title..."
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          disabled={disabled}
          className={`mt-1.5 block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-1 disabled:bg-slate-50 disabled:opacity-60 ${
            errors.title
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
              : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-rose-600 font-medium">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Body
        </label>
        <textarea
          rows={5}
          placeholder="Write your post content..."
          value={formData.body}
          onChange={(e) => onChange('body', e.target.value)}
          disabled={disabled}
          className={`mt-1.5 block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-1 disabled:bg-slate-50 disabled:opacity-60 ${
            errors.body
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
              : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
          }`}
        />
        {errors.body && (
          <p className="mt-1 text-xs text-rose-600 font-medium">{errors.body}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Tags (comma separated)
        </label>
        <input
          type="text"
          placeholder="e.g. history, crime, fiction"
          value={formData.tags}
          onChange={(e) => onChange('tags', e.target.value)}
          disabled={disabled}
          className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 disabled:opacity-60"
        />
      </div>
    </div>
  );
};
