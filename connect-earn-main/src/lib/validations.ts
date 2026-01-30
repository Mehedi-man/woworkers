import { z } from 'zod';

// Proposal validation schema
export const proposalSchema = z.object({
  bidAmount: z.number()
    .positive({ message: "বিড পরিমাণ অবশ্যই ০ এর বেশি হতে হবে" })
    .max(1000000, { message: "বিড পরিমাণ ১০,০০,০০০ এর বেশি হতে পারবে না" }),
  coverLetter: z.string()
    .min(50, { message: "কভার লেটার কমপক্ষে ৫০ অক্ষরের হতে হবে" })
    .max(5000, { message: "কভার লেটার ৫০০০ অক্ষরের বেশি হতে পারবে না" }),
  timeline: z.string()
    .max(200, { message: "টাইমলাইন ২০০ অক্ষরের বেশি হতে পারবে না" })
    .optional()
    .nullable(),
});

// Job creation validation schema
export const jobSchema = z.object({
  title: z.string()
    .min(10, { message: "শিরোনাম কমপক্ষে ১০ অক্ষরের হতে হবে" })
    .max(200, { message: "শিরোনাম ২০০ অক্ষরের বেশি হতে পারবে না" }),
  description: z.string()
    .min(50, { message: "বিবরণ কমপক্ষে ৫০ অক্ষরের হতে হবে" })
    .max(5000, { message: "বিবরণ ৫০০০ অক্ষরের বেশি হতে পারবে না" }),
  category: z.string()
    .min(1, { message: "একটি ক্যাটাগরি নির্বাচন করুন" }),
  budgetMin: z.number()
    .positive({ message: "সর্বনিম্ন বাজেট অবশ্যই ০ এর বেশি হতে হবে" })
    .max(10000000, { message: "সর্বনিম্ন বাজেট ১ কোটির বেশি হতে পারবে না" }),
  budgetMax: z.number()
    .positive({ message: "সর্বোচ্চ বাজেট অবশ্যই ০ এর বেশি হতে হবে" })
    .max(10000000, { message: "সর্বোচ্চ বাজেট ১ কোটির বেশি হতে পারবে না" }),
  skills: z.array(z.string()).max(10, { message: "সর্বোচ্চ ১০টি দক্ষতা নির্বাচন করা যাবে" }),
}).refine((data) => data.budgetMax >= data.budgetMin, {
  message: "সর্বোচ্চ বাজেট সর্বনিম্ন বাজেটের চেয়ে বেশি বা সমান হতে হবে",
  path: ["budgetMax"],
});

// Portfolio item validation schema
export const portfolioItemSchema = z.object({
  title: z.string()
    .min(3, { message: "শিরোনাম কমপক্ষে ৩ অক্ষরের হতে হবে" })
    .max(200, { message: "শিরোনাম ২০০ অক্ষরের বেশি হতে পারবে না" }),
  description: z.string()
    .max(1000, { message: "বিবরণ ১০০০ অক্ষরের বেশি হতে পারবে না" })
    .optional()
    .nullable(),
  imageUrl: z.string()
    .url({ message: "একটি বৈধ URL প্রদান করুন" })
    .max(500, { message: "URL ৫০০ অক্ষরের বেশি হতে পারবে না" }),
});

// Contract update validation schema
export const contractUpdateSchema = z.object({
  amount: z.number()
    .positive({ message: "পরিমাণ অবশ্যই ০ এর বেশি হতে হবে" })
    .max(10000000, { message: "পরিমাণ ১ কোটির বেশি হতে পারবে না" }),
});

// Type for validation results
export type ValidationResult<T> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: string };

// Helper function to validate and return errors
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { 
    success: false, 
    error: result.error.errors[0]?.message || "ভ্যালিডেশন ত্রুটি" 
  };
}
