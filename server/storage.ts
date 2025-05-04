import { 
  users, 
  courses, 
  trainers, 
  trainees, 
  payments, 
  type User, 
  type InsertUser,
  type Course,
  type InsertCourse,
  type Trainer,
  type InsertTrainer,
  type Trainee,
  type InsertTrainee,
  type Payment,
  type InsertPayment
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { pool } from "./db";
import { eq, desc, and, isNotNull } from "drizzle-orm";

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
  sessionStore: session.Store;
  
  private userCurrentId: number;
  private courseCurrentId: number;
  private trainerCurrentId: number;
  private traineeCurrentId: number;
  private paymentCurrentId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.trainers = new Map();
    this.trainees = new Map();
    this.payments = new Map();
    
    this.userCurrentId = 1;
    this.courseCurrentId = 1;
    this.trainerCurrentId = 1;
    this.traineeCurrentId = 1;
    this.paymentCurrentId = 1;
    
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
    // Check if we already have users
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      // Add initial admin user
      await this.createUser({
        username: "admin",
        password: "admin123",
        name: "System Administrator",
        role: "pesdo_admin"
      });
      
      // Add sample enrollment officer
      await this.createUser({
        username: "enrollment",
        password: "enrollment123",
        name: "Enrollment Officer",
        role: "enrollment_officer"
      });
      
      // Add sample cashier
      await this.createUser({
        username: "cashier",
        password: "cashier123",
        name: "Cashier",
        role: "cashier"
      });
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
        
      default:
        return [];
    }
  }
}

// Use database storage
export const storage = new DatabaseStorage();
