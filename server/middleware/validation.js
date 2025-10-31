import Joi from 'joi';
import { AppError } from './errorHandler.js';

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - Request property to validate (body, query, params)
 */
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(errorMessages, 400));
    }

    // Replace request property with validated and sanitized value
    req[property] = value;
    next();
  };
};

// User validation schemas
export const userSchemas = {
  register: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must not exceed 100 characters'
      }),
    email: Joi.string()
      .trim()
      .email()
      .lowercase()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address'
      }),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .lowercase()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address'
      }),
    password: Joi.string()
      .required()
      .messages({
        'string.empty': 'Password is required'
      })
  }),

  forgotPassword: Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .lowercase()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address'
      })
  }),

  verifyOtp: Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .lowercase()
      .required(),
    otp: Joi.string()
      .length(6)
      .pattern(/^\d+$/)
      .required()
      .messages({
        'string.length': 'OTP must be 6 digits',
        'string.pattern.base': 'OTP must contain only numbers'
      })
  }),

  resetPassword: Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .lowercase()
      .required(),
    newPassword: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Passwords do not match'
      })
  }),

  updateProfile: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .optional(),
    mobile: Joi.string()
      .pattern(/^\+?[\d\s-()]+$/)
      .min(10)
      .max(15)
      .optional()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      }),
    avatar: Joi.string()
      .uri()
      .optional()
  })
};

// Product validation schemas
export const productSchemas = {
  create: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(200)
      .required()
      .messages({
        'string.empty': 'Product name is required',
        'string.min': 'Product name must be at least 2 characters'
      }),
    image: Joi.array()
      .items(Joi.string().uri())
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one image is required'
      }),
    category: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one category is required',
        'string.pattern.base': 'Invalid category ID format'
      }),
    subCategory: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one subcategory is required',
        'string.pattern.base': 'Invalid subcategory ID format'
      }),
    unit: Joi.string()
      .trim()
      .required()
      .messages({
        'string.empty': 'Unit is required'
      }),
    stock: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.min': 'Stock cannot be negative'
      }),
    price: Joi.number()
      .positive()
      .required()
      .messages({
        'number.positive': 'Price must be a positive number',
        'any.required': 'Price is required'
      }),
    discount: Joi.number()
      .min(0)
      .max(100)
      .default(0)
      .messages({
        'number.min': 'Discount cannot be negative',
        'number.max': 'Discount cannot exceed 100%'
      }),
    description: Joi.string()
      .trim()
      .min(10)
      .max(2000)
      .required()
      .messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 10 characters'
      }),
    more_details: Joi.object()
      .optional()
  }),

  get: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10),
    search: Joi.string()
      .trim()
      .allow('')
      .optional()
  }),

  getByCategory: Joi.object({
    id: Joi.alternatives()
      .try(
        Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      )
      .required()
      .messages({
        'alternatives.match': 'Invalid category ID format',
        'any.required': 'Category ID is required'
      })
  })
};

// Category validation schemas
export const categorySchemas = {
  create: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Category name is required',
        'string.min': 'Category name must be at least 2 characters'
      }),
    image: Joi.string()
      .uri()
      .required()
      .messages({
        'string.empty': 'Category image is required',
        'string.uri': 'Invalid image URL'
      })
  }),

  update: Joi.object({
    _id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid category ID format',
        'any.required': 'Category ID is required'
      }),
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .optional(),
    image: Joi.string()
      .uri()
      .optional()
  }),

  delete: Joi.object({
    _id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid category ID format',
        'any.required': 'Category ID is required'
      })
  })
};

// SubCategory validation schemas
export const subCategorySchemas = {
  create: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Subcategory name is required',
        'string.min': 'Subcategory name must be at least 2 characters'
      }),
    image: Joi.string()
      .uri()
      .required()
      .messages({
        'string.empty': 'Subcategory image is required',
        'string.uri': 'Invalid image URL'
      }),
    category: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one category is required',
        'string.pattern.base': 'Invalid category ID format'
      })
  }),

  update: Joi.object({
    _id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid subcategory ID format',
        'any.required': 'Subcategory ID is required'
      }),
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .optional(),
    image: Joi.string()
      .uri()
      .optional(),
    category: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .optional()
  }),

  delete: Joi.object({
    _id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid subcategory ID format',
        'any.required': 'Subcategory ID is required'
      })
  })
};

// MongoDB ObjectId validation
export const mongoIdSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid ID format',
      'any.required': 'ID is required'
    })
});
