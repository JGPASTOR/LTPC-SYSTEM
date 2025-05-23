import { 
  users, 
  courses, 
  trainers, 
  trainees, 
  payments,
  assessments,
  trainingResults,
  type User, 
  type InsertUser,
  type Course,
  type InsertCourse,
  type Trainer,
  type InsertTrainer,
  type Trainee,
  type InsertTrainee,
  type Payment,
  type InsertPayment,
  type Assessment,
  type InsertAssessment,
  type TrainingResult,
  type InsertTrainingResult
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { pool } from "./db";
import { eq, desc, and, isNotNull } from "drizzle-orm";
import { promisify } from "util";
import { scrypt, randomBytes } from "crypto";

// For in-memory session store (used for development)
const MemoryStore = createMemoryStore(session);

// For database session store (used in production)
const PostgresSessionStore = connectPg(session);

// Define storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course methods
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<Course>): Promise<Course | undefined>;
  
  // Trainer methods
  getAllTrainers(): Promise<Trainer[]>;
  getTrainer(id: number): Promise<Trainer | undefined>;
  createTrainer(trainer: InsertTrainer): Promise<Trainer>;
  updateTrainer(id: number, trainer: Partial<Trainer>): Promise<Trainer | undefined>;
  
  // Trainee methods
  getAllTrainees(): Promise<Trainee[]>;
  getTrainee(id: number): Promise<Trainee | undefined>;
  createTrainee(trainee: InsertTrainee): Promise<Trainee>;
  updateTrainee(id: number, trainee: Partial<Trainee>): Promise<Trainee | undefined>;
  
  // Payment methods
  getAllPayments(): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  
  // Assessment methods
  getAllAssessments(): Promise<Assessment[]>;
  getAssessmentsByTraineeId(traineeId: string): Promise<Assessment[]>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: number, assessment: Partial<Assessment>): Promise<Assessment | undefined>;
  
  // Training Results methods
  getAllTrainingResults(): Promise<TrainingResult[]>;
  getTrainingResultByTraineeId(traineeId: string): Promise<TrainingResult | undefined>;
  getTrainingResult(id: number): Promise<TrainingResult | undefined>;
  createTrainingResult(result: InsertTrainingResult): Promise<TrainingResult>;
  updateTrainingResult(id: number, result: Partial<TrainingResult>): Promise<TrainingResult | undefined>;
  
  // Dashboard and reports
  getDashboardStats(): Promise<any>;
  getReportData(type: string, from?: string, to?: string): Promise<any>;
  
  // Session store
  sessionStore: session.Store;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private trainers: Map<number, Trainer>;
  private trainees: Map<number, Trainee>;
  private payments: Map<number, Payment>;
  private assessments: Map<number, Assessment>;
  private trainingResults: Map<number, TrainingResult>;
  sessionStore: session.Store;
  
  private userCurrentId: number;
  private courseCurrentId: number;
  private trainerCurrentId: number;
  private traineeCurrentId: number;
  private paymentCurrentId: number;
  private assessmentCurrentId: number;
  private trainingResultCurrentId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.trainers = new Map();
    this.trainees = new Map();
    this.payments = new Map();
    this.assessments = new Map();
    this.trainingResults = new Map();
    
    this.userCurrentId = 1;
    this.courseCurrentId = 1;
    this.trainerCurrentId = 1;
    this.traineeCurrentId = 1;
    this.paymentCurrentId = 1;
    this.assessmentCurrentId = 1;
    this.trainingResultCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Add initial admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      name: "System Administrator",
      role: "pesdo_admin"
    });
    
    // Add sample enrollment officer
    this.createUser({
      username: "enrollment",
      password: "enrollment123",
      name: "Enrollment Officer",
      role: "enrollment_officer"
    });
    
    // Add sample cashier
    this.createUser({
      username: "cashier",
      password: "cashier123",
      name: "Cashier",
      role: "cashier"
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Course methods
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.courseCurrentId++;
    const newCourse: Course = { ...course, id };
    this.courses.set(id, newCourse);
    return newCourse;
  }
  
  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;
    
    const updatedCourse = { ...course, ...courseData };
    this.courses.set(id, updatedCourse);
    
    return updatedCourse;
  }
  
  // Trainer methods
  async getAllTrainers(): Promise<Trainer[]> {
    return Array.from(this.trainers.values());
  }
  
  async getTrainer(id: number): Promise<Trainer | undefined> {
    return this.trainers.get(id);
  }
  
  async createTrainer(trainer: InsertTrainer): Promise<Trainer> {
    const id = this.trainerCurrentId++;
    const newTrainer: Trainer = { ...trainer, id };
    this.trainers.set(id, newTrainer);
    return newTrainer;
  }
  
  async updateTrainer(id: number, trainerData: Partial<Trainer>): Promise<Trainer | undefined> {
    const trainer = this.trainers.get(id);
    if (!trainer) return undefined;
    
    const updatedTrainer = { ...trainer, ...trainerData };
    this.trainers.set(id, updatedTrainer);
    
    return updatedTrainer;
  }
  
  // Trainee methods
  async getAllTrainees(): Promise<Trainee[]> {
    return Array.from(this.trainees.values());
  }
  
  async getTrainee(id: number): Promise<Trainee | undefined> {
    return this.trainees.get(id);
  }
  
  async createTrainee(trainee: InsertTrainee): Promise<Trainee> {
    const id = this.traineeCurrentId++;
    const traineeId = `T-${new Date().getFullYear()}-${id.toString().padStart(4, '0')}`;
    const newTrainee: Trainee = { ...trainee, id, traineeId };
    this.trainees.set(id, newTrainee);
    return newTrainee;
  }
  
  async updateTrainee(id: number, traineeData: Partial<Trainee>): Promise<Trainee | undefined> {
    const trainee = this.trainees.get(id);
    if (!trainee) return undefined;
    
    const updatedTrainee = { ...trainee, ...traineeData };
    this.trainees.set(id, updatedTrainee);
    
    return updatedTrainee;
  }
  
  // Payment methods
  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }
  
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }
  
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.paymentCurrentId++;
    const receiptNumber = `RN-${new Date().getFullYear()}-${id.toString().padStart(3, '0')}`;
    const newPayment: Payment = { 
      ...payment, 
      id, 
      receiptNumber,
      createdAt: new Date().toISOString()
    };
    this.payments.set(id, newPayment);
    return newPayment;
  }
  
  // Dashboard and reports
  async getDashboardStats(): Promise<any> {
    const totalEnrollments = this.trainees.size;
    const activeCourses = Array.from(this.courses.values()).filter(
      course => course.status === "Active"
    ).length;
    
    const completedTrainings = Array.from(this.trainees.values()).filter(
      trainee => trainee.status === "Completed"
    ).length;
    
    const totalPayments = Array.from(this.payments.values()).reduce(
      (sum, payment) => sum + payment.amount, 0
    );
    
    return {
      totalEnrollments,
      activeCourses,
      completedTrainings,
      paymentCollection: `₱${totalPayments.toLocaleString()}`
    };
  }
  
  // Assessment methods
  async getAllAssessments(): Promise<Assessment[]> {
    return Array.from(this.assessments.values());
  }
  
  async getAssessmentsByTraineeId(traineeId: string): Promise<Assessment[]> {
    return Array.from(this.assessments.values()).filter(
      assessment => assessment.traineeId === traineeId
    );
  }
  
  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }
  
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const id = this.assessmentCurrentId++;
    const newAssessment: Assessment = { 
      ...assessment, 
      id,
      createdAt: new Date().toISOString()
    };
    this.assessments.set(id, newAssessment);
    return newAssessment;
  }
  
  async updateAssessment(id: number, assessmentData: Partial<Assessment>): Promise<Assessment | undefined> {
    const assessment = this.assessments.get(id);
    if (!assessment) return undefined;
    
    const updatedAssessment = { ...assessment, ...assessmentData };
    this.assessments.set(id, updatedAssessment);
    
    return updatedAssessment;
  }
  
  // Training Results methods
  async getAllTrainingResults(): Promise<TrainingResult[]> {
    return Array.from(this.trainingResults.values());
  }
  
  async getTrainingResultByTraineeId(traineeId: string): Promise<TrainingResult | undefined> {
    return Array.from(this.trainingResults.values()).find(
      result => result.traineeId === traineeId
    );
  }
  
  async getTrainingResult(id: number): Promise<TrainingResult | undefined> {
    return this.trainingResults.get(id);
  }
  
  async createTrainingResult(result: InsertTrainingResult): Promise<TrainingResult> {
    const id = this.trainingResultCurrentId++;
    const certificateNumber = result.certificateIssued ? 
      `CERT-${new Date().getFullYear()}-${id.toString().padStart(4, '0')}` : 
      undefined;
      
    const newTrainingResult: TrainingResult = { 
      ...result, 
      id,
      certificateNumber,
      createdAt: new Date().toISOString()
    };
    
    this.trainingResults.set(id, newTrainingResult);
    return newTrainingResult;
  }
  
  async updateTrainingResult(id: number, resultData: Partial<TrainingResult>): Promise<TrainingResult | undefined> {
    const result = this.trainingResults.get(id);
    if (!result) return undefined;
    
    // Generate certificate number if newly issued
    let updatedData = { ...resultData };
    if (resultData.certificateIssued && !result.certificateIssued) {
      updatedData.certificateNumber = `CERT-${new Date().getFullYear()}-${id.toString().padStart(4, '0')}`;
    }
    
    const updatedResult = { ...result, ...updatedData };
    this.trainingResults.set(id, updatedResult);
    
    return updatedResult;
  }

  async getReportData(type: string, from?: string, to?: string): Promise<any> {
    // This would filter based on dates in a real implementation
    switch (type) {
      case 'enrollment':
        return Array.from(this.trainees.values()).map(trainee => ({
          id: trainee.id,
          name: trainee.name,
          course: trainee.course,
          enrollmentDate: trainee.enrollmentDate
        }));
        
      case 'completion':
        return Array.from(this.trainees.values())
          .filter(trainee => trainee.status === "Completed")
          .map(trainee => ({
            id: trainee.id,
            name: trainee.name,
            course: trainee.course,
            completionDate: trainee.completionDate
          }));
        
      case 'payment':
        return Array.from(this.payments.values()).map(payment => ({
          id: payment.id,
          traineeId: payment.traineeId,
          traineeName: payment.traineeName,
          amount: payment.amount,
          receiptNumber: payment.receiptNumber,
          paymentDate: payment.createdAt
        }));
        
      case 'assessment':
        return Array.from(this.assessments.values()).map(assessment => ({
          id: assessment.id,
          traineeId: assessment.traineeId,
          traineeName: assessment.traineeName,
          course: assessment.course,
          assessmentType: assessment.assessmentType,
          score: assessment.score,
          maxScore: assessment.maxScore,
          result: assessment.result,
          assessmentDate: assessment.assessmentDate
        }));
        
      case 'training_results':
        return Array.from(this.trainingResults.values()).map(result => ({
          id: result.id,
          traineeId: result.traineeId,
          traineeName: result.traineeName,
          course: result.course,
          overallRating: result.overallRating,
          certificateIssued: result.certificateIssued,
          certificateNumber: result.certificateNumber,
          issuedDate: result.issuedDate
        }));
        
      default:
        return [];
    }
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });

    // Initialize with sample users on first run
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Check if we already have users
      const existingUsers = await db.select().from(users);
      
      if (existingUsers.length === 0) {
        // Create hash function here to avoid circular dependencies
        const scryptAsync = promisify(scrypt);
        
        const hashPasswordLocal = async (password: string) => {
          const salt = randomBytes(16).toString("hex");
          const buf = (await scryptAsync(password, salt, 64)) as Buffer;
          return `${buf.toString("hex")}.${salt}`;
        };
        
        // Add initial admin user
        await this.createUser({
          username: "admin",
          password: await hashPasswordLocal("admin123"),
          name: "System Administrator",
          role: "pesdo_admin"
        });
        
        // Add sample enrollment officer
        await this.createUser({
          username: "enrollment",
          password: await hashPasswordLocal("enrollment123"),
          name: "Enrollment Officer",
          role: "enrollment_officer"
        });
        
        // Add sample cashier
        await this.createUser({
          username: "cashier",
          password: await hashPasswordLocal("cashier123"),
          name: "Cashier",
          role: "cashier"
        });
        
        console.log("Initial users created successfully");
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Course methods
  async getAllCourses(): Promise<Course[]> {
    return db.select().from(courses);
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }
  
  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }
  
  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course | undefined> {
    const [updatedCourse] = await db
      .update(courses)
      .set(courseData)
      .where(eq(courses.id, id))
      .returning();
    
    return updatedCourse;
  }
  
  // Trainer methods
  async getAllTrainers(): Promise<Trainer[]> {
    return db.select().from(trainers);
  }
  
  async getTrainer(id: number): Promise<Trainer | undefined> {
    const [trainer] = await db.select().from(trainers).where(eq(trainers.id, id));
    return trainer;
  }
  
  async createTrainer(trainer: InsertTrainer): Promise<Trainer> {
    const [newTrainer] = await db.insert(trainers).values(trainer).returning();
    return newTrainer;
  }
  
  async updateTrainer(id: number, trainerData: Partial<Trainer>): Promise<Trainer | undefined> {
    const [updatedTrainer] = await db
      .update(trainers)
      .set(trainerData)
      .where(eq(trainers.id, id))
      .returning();
    
    return updatedTrainer;
  }
  
  // Trainee methods
  async getAllTrainees(): Promise<Trainee[]> {
    return db.select().from(trainees);
  }
  
  async getTrainee(id: number): Promise<Trainee | undefined> {
    const [trainee] = await db.select().from(trainees).where(eq(trainees.id, id));
    return trainee;
  }
  
  async createTrainee(traineeData: InsertTrainee): Promise<Trainee> {
    // Generate trainee ID 
    const allTrainees = await this.getAllTrainees();
    const id = allTrainees.length > 0 
      ? Math.max(...allTrainees.map(t => t.id)) + 1 
      : 1;
    const traineeId = `T-${new Date().getFullYear()}-${id.toString().padStart(4, '0')}`;
    
    const [trainee] = await db
      .insert(trainees)
      .values({ ...traineeData, traineeId })
      .returning();
    
    return trainee;
  }
  
  async updateTrainee(id: number, traineeData: Partial<Trainee>): Promise<Trainee | undefined> {
    const [updatedTrainee] = await db
      .update(trainees)
      .set(traineeData)
      .where(eq(trainees.id, id))
      .returning();
    
    return updatedTrainee;
  }
  
  // Payment methods
  async getAllPayments(): Promise<Payment[]> {
    return db.select().from(payments).orderBy(desc(payments.createdAt));
  }
  
  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }
  
  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    // Generate receipt number
    const allPayments = await this.getAllPayments();
    const id = allPayments.length > 0 
      ? Math.max(...allPayments.map(p => p.id)) + 1 
      : 1;
    const receiptNumber = `RN-${new Date().getFullYear()}-${id.toString().padStart(3, '0')}`;
    
    const [payment] = await db
      .insert(payments)
      .values({ ...paymentData, receiptNumber })
      .returning();
    
    return payment;
  }
  
  // Assessment methods
  async getAllAssessments(): Promise<Assessment[]> {
    return db.select().from(assessments).orderBy(desc(assessments.createdAt));
  }
  
  async getAssessmentsByTraineeId(traineeId: string): Promise<Assessment[]> {
    return db.select()
      .from(assessments)
      .where(eq(assessments.traineeId, traineeId))
      .orderBy(desc(assessments.assessmentDate));
  }
  
  async getAssessment(id: number): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment;
  }
  
  async createAssessment(assessmentData: InsertAssessment): Promise<Assessment> {
    const [assessment] = await db
      .insert(assessments)
      .values(assessmentData)
      .returning();
    
    return assessment;
  }
  
  async updateAssessment(id: number, assessmentData: Partial<Assessment>): Promise<Assessment | undefined> {
    const [updatedAssessment] = await db
      .update(assessments)
      .set(assessmentData)
      .where(eq(assessments.id, id))
      .returning();
    
    return updatedAssessment;
  }
  
  // Training Results methods
  async getAllTrainingResults(): Promise<TrainingResult[]> {
    return db.select().from(trainingResults).orderBy(desc(trainingResults.createdAt));
  }
  
  async getTrainingResultByTraineeId(traineeId: string): Promise<TrainingResult | undefined> {
    const [result] = await db
      .select()
      .from(trainingResults)
      .where(eq(trainingResults.traineeId, traineeId));
    
    return result;
  }
  
  async getTrainingResult(id: number): Promise<TrainingResult | undefined> {
    const [result] = await db.select().from(trainingResults).where(eq(trainingResults.id, id));
    return result;
  }
  
  async createTrainingResult(resultData: InsertTrainingResult): Promise<TrainingResult> {
    let certificateNumber = resultData.certificateNumber;
    
    // Generate certificate number if certificate is issued but no number provided
    if (resultData.certificateIssued && !certificateNumber) {
      const allResults = await this.getAllTrainingResults();
      const id = allResults.length > 0 
        ? Math.max(...allResults.map(r => r.id)) + 1 
        : 1;
      certificateNumber = `CERT-${new Date().getFullYear()}-${id.toString().padStart(4, '0')}`;
    }
    
    const [result] = await db
      .insert(trainingResults)
      .values({ ...resultData, certificateNumber })
      .returning();
    
    return result;
  }
  
  async updateTrainingResult(id: number, resultData: Partial<TrainingResult>): Promise<TrainingResult | undefined> {
    // If certificate is being issued, generate a certificate number if needed
    if (resultData.certificateIssued) {
      const [currentResult] = await db
        .select()
        .from(trainingResults)
        .where(eq(trainingResults.id, id));
      
      if (currentResult && !currentResult.certificateIssued && !resultData.certificateNumber) {
        resultData.certificateNumber = `CERT-${new Date().getFullYear()}-${id.toString().padStart(4, '0')}`;
      }
    }
    
    const [updatedResult] = await db
      .update(trainingResults)
      .set(resultData)
      .where(eq(trainingResults.id, id))
      .returning();
    
    return updatedResult;
  }
  
  // Dashboard and reports
  async getDashboardStats(): Promise<any> {
    const allTrainees = await this.getAllTrainees();
    const allCourses = await this.getAllCourses();
    const allPayments = await this.getAllPayments();
    
    const totalEnrollments = allTrainees.length;
    const activeCourses = allCourses.filter(course => course.status === "Active").length;
    const completedTrainings = allTrainees.filter(trainee => trainee.status === "Completed").length;
    const totalPayments = allPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      totalEnrollments,
      activeCourses,
      completedTrainings,
      paymentCollection: `₱${totalPayments.toLocaleString()}`
    };
  }
  
  async getReportData(type: string, from?: string, to?: string): Promise<any> {
    // Filter based on dates if provided
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    
    if (from) {
      startDate = new Date(from);
    }
    
    if (to) {
      endDate = new Date(to);
      // Set to end of day
      endDate.setHours(23, 59, 59, 999);
    }
    
    switch (type) {
      case 'enrollment': {
        const enrollmentData = await db.select({
          id: trainees.id,
          name: trainees.name,
          course: trainees.course,
          enrollmentDate: trainees.enrollmentDate
        }).from(trainees);
        
        return enrollmentData;
      }
        
      case 'completion': {
        const completionData = await db.select({
          id: trainees.id,
          name: trainees.name,
          course: trainees.course,
          completionDate: trainees.completionDate
        })
        .from(trainees)
        .where(
          and(
            eq(trainees.status, "Completed"),
            isNotNull(trainees.completionDate)
          )
        );
        
        return completionData;
      }
        
      case 'payment': {
        const paymentData = await db.select({
          id: payments.id,
          traineeId: payments.traineeId,
          traineeName: payments.traineeName,
          amount: payments.amount,
          receiptNumber: payments.receiptNumber,
          paymentDate: payments.createdAt
        })
        .from(payments);
        
        return paymentData;
      }
        
      case 'assessment': {
        const assessmentData = await db.select({
          id: assessments.id,
          traineeId: assessments.traineeId,
          traineeName: assessments.traineeName,
          course: assessments.course,
          assessmentType: assessments.assessmentType,
          score: assessments.score,
          maxScore: assessments.maxScore,
          result: assessments.result,
          assessmentDate: assessments.assessmentDate
        })
        .from(assessments)
        .orderBy(desc(assessments.assessmentDate));
        
        return assessmentData;
      }
        
      case 'training_results': {
        const trainingResultsData = await db.select({
          id: trainingResults.id,
          traineeId: trainingResults.traineeId,
          traineeName: trainingResults.traineeName,
          course: trainingResults.course,
          overallRating: trainingResults.overallRating,
          certificateIssued: trainingResults.certificateIssued,
          certificateNumber: trainingResults.certificateNumber,
          issuedDate: trainingResults.issuedDate
        })
        .from(trainingResults);
        
        return trainingResultsData;
      }
        
      default:
        return [];
    }
  }
}

// Use database storage
export const storage = new DatabaseStorage();
