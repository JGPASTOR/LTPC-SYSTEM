import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Course routes
  app.get("/api/courses", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.getAllCourses()
      .then(courses => res.json(courses))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.post("/api/courses", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.createCourse(req.body)
      .then(course => res.status(201).json(course))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.get("/api/courses/:id", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.getCourse(parseInt(req.params.id))
      .then(course => {
        if (!course) return res.status(404).json({ error: "Course not found" });
        res.json(course);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.put("/api/courses/:id", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.updateCourse(parseInt(req.params.id), req.body)
      .then(course => {
        if (!course) return res.status(404).json({ error: "Course not found" });
        res.json(course);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  // Trainee routes
  app.get("/api/trainees", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.getAllTrainees()
      .then(trainees => res.json(trainees))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.post("/api/trainees", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.createTrainee(req.body)
      .then(trainee => res.status(201).json(trainee))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.get("/api/trainees/:id", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.getTrainee(parseInt(req.params.id))
      .then(trainee => {
        if (!trainee) return res.status(404).json({ error: "Trainee not found" });
        res.json(trainee);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.put("/api/trainees/:id", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.updateTrainee(parseInt(req.params.id), req.body)
      .then(trainee => {
        if (!trainee) return res.status(404).json({ error: "Trainee not found" });
        res.json(trainee);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  // Trainer routes
  app.get("/api/trainers", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.getAllTrainers()
      .then(trainers => res.json(trainers))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.post("/api/trainers", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.createTrainer(req.body)
      .then(trainer => res.status(201).json(trainer))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.get("/api/trainers/:id", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.getTrainer(parseInt(req.params.id))
      .then(trainer => {
        if (!trainer) return res.status(404).json({ error: "Trainer not found" });
        res.json(trainer);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.put("/api/trainers/:id", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.updateTrainer(parseInt(req.params.id), req.body)
      .then(trainer => {
        if (!trainer) return res.status(404).json({ error: "Trainer not found" });
        res.json(trainer);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  // Payment routes
  app.get("/api/payments", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.getAllPayments()
      .then(payments => res.json(payments))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.post("/api/payments", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.createPayment(req.body)
      .then(payment => res.status(201).json(payment))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.get("/api/payments/:id", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.getPayment(parseInt(req.params.id))
      .then(payment => {
        if (!payment) return res.status(404).json({ error: "Payment not found" });
        res.json(payment);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  // Dashboard statistics
  app.get("/api/dashboard/stats", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.getDashboardStats()
      .then(stats => res.json(stats))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  // Reports data
  app.get("/api/reports/:type", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { type } = req.params;
    const { from, to } = req.query;
    
    storage.getReportData(type, from as string, to as string)
      .then(data => res.json(data))
      .catch(err => res.status(500).json({ error: err.message }));
  });

  const httpServer = createServer(app);

  return httpServer;
}
