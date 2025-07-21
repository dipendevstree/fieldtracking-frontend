export function jsonToFormData(json: Record<string, any>, prefix: string = ''): FormData {
  const formData = new FormData();

  function appendFormData(key: string, value: any, currentPrefix: string) {
    const formKey = currentPrefix ? `${currentPrefix}.${key}` : key;

    if (value === null || value === undefined) {
      formData.append(formKey, '');
      return;
    }

    if (value instanceof File || value instanceof Blob) {
      formData.append(formKey, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        appendFormData(`${key}[${index}]`, item, currentPrefix);
      });
      return;
    }

    if (typeof value === 'object' && !(value instanceof Date)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        appendFormData(nestedKey, nestedValue, formKey);
      });
      return;
    }

    formData.append(formKey, value instanceof Date ? value.toISOString() : String(value));
  }

  Object.entries(json).forEach(([key, value]) => {
    appendFormData(key, value, prefix);
  });

  return formData;
}
