import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/)
    .min(3)
    .max(30)
    .required()
    .messages(
      {
        "string.pattern.base": "الاسم يجب أن يحتوي على حروف فقط",
        "string.empty": 'الاسم مطلوب يا بطل!',
        'string.min': 'الاسم يجب أن يكون أكتر من ٣ حروف',
        'string.max': 'الاسم يجب أن يكون أقل من ٣٠ حرف'
      }
    ),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'تأكد من كتابة البريد الإلكتروني بشكل صحيح',
      'string.empty': 'البريد الإلكتروني مطلوب'
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'كلمة المرور ضعيفة، اختر ٦ رموز على الأقل'
    }),

  avatar_url: Joi.string().uri().optional()
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'تأكد من كتابة البريد الإلكتروني بشكل صحيح',
      'string.empty': 'البريد الإلكتروني مطلوب'
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'برجاء إدخال كلمة المرور'
    })
});
