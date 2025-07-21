import { Label } from '@/components/ui/label';
import { AlertCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';

type ImageItem = {
  url?: string; // For default images (URLs)
  file?: File; // For newly uploaded files
  preview: string; // Data URL or original URL for preview
  id: string;
};

type CustomFileUploadInputProps = {
  name: string;
  label: string;
  loading: boolean;
  control: Control<any>;
  defaultImage?: string | string[];
  multiple?: boolean;
  helperText?: string;
  className?: string;
};

const CustomFileUploadInputMemo: React.FC<CustomFileUploadInputProps> = ({
  name,
  label,
  loading,
  control,
  defaultImage,
  multiple = false,
  helperText,
  className
}) => {
  const [images, setImages] = useState<ImageItem[]>([]);

  // Initialize images from defaultImage
  useEffect(() => {
    const initialImages = Array.isArray(defaultImage)
      ? defaultImage.map((url, index) => ({
        url,
        preview: url,
        id: `default-${index}`
      }))
      : defaultImage
        ? [{ url: defaultImage, preview: defaultImage, id: 'default-0' }]
        : [];
    setImages(initialImages);
  }, [defaultImage]);

  const handleFileChange = async (
    fileList: FileList | null,
    onChange: (value: File | File[] | null) => void
  ) => {
    if (fileList && fileList.length > 0) {
      const newFiles = Array.from(fileList);
      // Generate previews and create new image items
      const newImages = await Promise.all(
        newFiles.map(
          (file, index) =>
            new Promise<ImageItem>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () =>
                resolve({
                  file,
                  preview: reader.result as string,
                  id: `file-${Date.now()}-${index}`
                });
              reader.readAsDataURL(file);
            })
        )
      );

      // Append new images to existing images if multiple, otherwise replace
      const updatedImages = multiple ? [...images, ...newImages] : newImages;
      setImages(updatedImages);

      // Update form field value with files only (for form submission)
      const files = updatedImages
        .filter((img) => img.file)
        .map((img) => img.file!);
      onChange(multiple ? files : files[0] || null);
    }
  };

  const handleDelete = (
    index: number,
    onChange: (value: File | File[] | null) => void
  ) => {
    // Remove image at the specified index
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    // Update form field value with remaining files
    const files = updatedImages
      .filter((img) => img.file)
      .map((img) => img.file!);
    onChange(multiple ? files : files[0] || null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={name}>
        {label} <span>{multiple ? '(multiple allowed)' : ''}</span>
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <div>
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              id={name}
              disabled={loading}
              onChange={(e) => handleFileChange(e.target.files, field.onChange)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {error && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error.message}
              </p>
            )}
            {images.length > 0 && (
              <div
                className={
                  multiple
                    ? 'mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'
                    : 'mt-4'
                }
              >
                {images.map((image, index) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className={
                        multiple
                          ? 'h-32 w-full rounded border object-cover'
                          : 'h-auto max-w-md rounded border'
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleDelete(index, field.onChange)}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                      aria-label={`Delete image ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {helperText && (
              <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default CustomFileUploadInputMemo;
