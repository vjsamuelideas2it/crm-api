export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value: any): boolean => {
  return value !== null && value !== undefined && value !== '';
};

export const validateLength = (value: string, min: number, max?: number): boolean => {
  if (!value) return false;
  if (max) {
    return value.length >= min && value.length <= max;
  }
  return value.length >= min;
};

export const sanitizeString = (value: string): string => {
  return value.trim().replace(/[<>]/g, '');
}; 