import { pgTable, text, serial, integer, boolean, date, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // pesdo_admin, enrollment_officer, cashier
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
});

// Course schema
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  status: text("status").notNull().default("Active"), // Active, Inactive
  enrollmentCount: integer("enrollment_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  name: true,
  description: true,
  duration: true,
  status: true,
});

// Trainer schema
export const trainers = pgTable("trainers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  expertise: text("expertise").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  bio: text("bio"),
  activeCourses: integer("active_courses").notNull().default(0),
  totalTrainees: integer("total_trainees").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTrainerSchema = createInsertSchema(trainers).pick({
  name: true,
  expertise: true,
  email: true,
  phone: true,
  bio: true,
});

// Trainee schema
export const trainees = pgTable("trainees", {
  id: serial("id").primaryKey(),
  traineeId: text("trainee_id").notNull().unique(),
  name: text("name").notNull(),
  gender: text("gender").notNull(),
  address: text("address").notNull(),
  contact: text("contact").notNull(),
  courseId: integer("course_id").notNull(),
  course: text("course").notNull(),
  trainerId: integer("trainer_id"),
  trainer: text("trainer"),
  enrollmentDate: date("enrollment_date").notNull(),
  completionDate: date("completion_date"),
  status: text("status").notNull().default("Active"), // Active, Completed, Dropped
  payment: text("payment").notNull().default("Unpaid"), // Paid, Unpaid (removed Partial option)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTraineeSchema = createInsertSchema(trainees).pick({
  name: true,
  gender: true,
  address: true,
  contact: true,
  courseId: true,
  course: true,
  trainerId: true,
  trainer: true,
  enrollmentDate: true,
  status: true,
  payment: true,
});

// Payment schema
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  traineeId: text("trainee_id").notNull(),
  traineeName: text("trainee_name").notNull(),
  courseId: integer("course_id").notNull(),
  course: text("course").notNull(),
  amount: integer("amount").notNull(),
  receiptNumber: text("receipt_number").notNull().unique(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").notNull().default("Paid"), // Paid, Unpaid (removed Partial option)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  traineeId: true,
  traineeName: true,
  courseId: true,
  course: true,
  amount: true,
  paymentMethod: true,
  status: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Trainer = typeof trainers.$inferSelect;
export type InsertTrainer = z.infer<typeof insertTrainerSchema>;

export type Trainee = typeof trainees.$inferSelect;
export type InsertTrainee = z.infer<typeof insertTraineeSchema>;

// Assessment Results schema
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  traineeId: text("trainee_id").notNull(),
  traineeName: text("trainee_name").notNull(),
  courseId: integer("course_id").notNull(),
  course: text("course").notNull(),
  assessmentType: text("assessment_type").notNull(), // Theoretical, Practical, Final
  score: real("score").notNull(),
  maxScore: real("max_score").notNull(),
  result: text("result").notNull(), // Passed, Failed, Conditionally Passed
  feedback: text("feedback"),
  assessedBy: text("assessed_by").notNull(),
  assessmentDate: date("assessment_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).pick({
  traineeId: true,
  traineeName: true,
  courseId: true,
  course: true,
  assessmentType: true,
  score: true,
  maxScore: true,
  result: true,
  feedback: true,
  assessedBy: true,
  assessmentDate: true,
});

// Training Results schema
export const trainingResults = pgTable("training_results", {
  id: serial("id").primaryKey(),
  traineeId: text("trainee_id").notNull(),
  traineeName: text("trainee_name").notNull(),
  courseId: integer("course_id").notNull(),
  course: text("course").notNull(),
  competencies: text("competencies").notNull(),
  overallRating: real("overall_rating").notNull(),
  certificateIssued: boolean("certificate_issued").notNull().default(false),
  certificateNumber: text("certificate_number").unique(),
  issuedDate: date("issued_date"),
  remarks: text("remarks"),
  approvedBy: text("approved_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTrainingResultSchema = createInsertSchema(trainingResults).pick({
  traineeId: true,
  traineeName: true,
  courseId: true,
  course: true,
  competencies: true,
  overallRating: true,
  certificateIssued: true,
  certificateNumber: true,
  issuedDate: true,
  remarks: true,
  approvedBy: true,
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type TrainingResult = typeof trainingResults.$inferSelect;
export type InsertTrainingResult = z.infer<typeof insertTrainingResultSchema>;
