import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

// Authorization middleware
function hasRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden - Insufficient permissions" });
    }
    
    next();
  };
}

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
  
  app.post("/api/courses", hasRole("pesdo_admin", "enrollment_officer"), (req, res) => {
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
  
  app.put("/api/courses/:id", hasRole("pesdo_admin", "enrollment_officer"), (req, res) => {
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
  
  app.post("/api/trainees", hasRole("pesdo_admin", "enrollment_officer"), (req, res) => {
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
  
  app.put("/api/trainees/:id", hasRole("pesdo_admin", "enrollment_officer"), (req, res) => {
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
  
  app.post("/api/trainers", hasRole("pesdo_admin"), (req, res) => {
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
  
  app.put("/api/trainers/:id", hasRole("pesdo_admin"), (req, res) => {
    storage.updateTrainer(parseInt(req.params.id), req.body)
      .then(trainer => {
        if (!trainer) return res.status(404).json({ error: "Trainer not found" });
        res.json(trainer);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  // Payment routes
  app.get("/api/payments", hasRole("pesdo_admin", "cashier"), (req, res) => {
    storage.getAllPayments()
      .then(payments => res.json(payments))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.post("/api/payments", hasRole("pesdo_admin", "cashier"), (req, res) => {
    storage.createPayment(req.body)
      .then(payment => res.status(201).json(payment))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.get("/api/payments/:id", hasRole("pesdo_admin", "cashier"), (req, res) => {
    storage.getPayment(parseInt(req.params.id))
      .then(payment => {
        if (!payment) return res.status(404).json({ error: "Payment not found" });
        res.json(payment);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  // Dashboard statistics - accessible by all authenticated users
  app.get("/api/dashboard/stats", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    storage.getDashboardStats()
      .then(stats => res.json(stats))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  // Assessment routes
  app.get("/api/assessments", hasRole("pesdo_admin"), (req, res) => {
    storage.getAllAssessments()
      .then(assessments => res.json(assessments))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.get("/api/assessments/trainee/:traineeId", hasRole("pesdo_admin"), (req, res) => {
    storage.getAssessmentsByTraineeId(req.params.traineeId)
      .then(assessments => res.json(assessments))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.post("/api/assessments", hasRole("pesdo_admin"), (req, res) => {
    storage.createAssessment(req.body)
      .then(assessment => res.status(201).json(assessment))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.get("/api/assessments/:id", hasRole("pesdo_admin"), (req, res) => {
    storage.getAssessment(parseInt(req.params.id))
      .then(assessment => {
        if (!assessment) return res.status(404).json({ error: "Assessment not found" });
        res.json(assessment);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.put("/api/assessments/:id", hasRole("pesdo_admin"), (req, res) => {
    storage.updateAssessment(parseInt(req.params.id), req.body)
      .then(assessment => {
        if (!assessment) return res.status(404).json({ error: "Assessment not found" });
        res.json(assessment);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  // Training Results routes
  app.get("/api/training-results", hasRole("pesdo_admin"), (req, res) => {
    storage.getAllTrainingResults()
      .then(results => res.json(results))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.get("/api/training-results/trainee/:traineeId", hasRole("pesdo_admin"), (req, res) => {
    storage.getTrainingResultByTraineeId(req.params.traineeId)
      .then(result => {
        if (!result) return res.status(404).json({ error: "Training result not found for this trainee" });
        res.json(result);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.post("/api/training-results", hasRole("pesdo_admin"), (req, res) => {
    storage.createTrainingResult(req.body)
      .then(result => res.status(201).json(result))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.get("/api/training-results/:id", hasRole("pesdo_admin"), (req, res) => {
    storage.getTrainingResult(parseInt(req.params.id))
      .then(result => {
        if (!result) return res.status(404).json({ error: "Training result not found" });
        res.json(result);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  app.put("/api/training-results/:id", hasRole("pesdo_admin"), (req, res) => {
    storage.updateTrainingResult(parseInt(req.params.id), req.body)
      .then(result => {
        if (!result) return res.status(404).json({ error: "Training result not found" });
        res.json(result);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });

  // Reports data - only accessible by admin
  app.get("/api/reports/:type", hasRole("pesdo_admin"), (req, res) => {
    const { type } = req.params;
    const { from, to } = req.query;
    
    storage.getReportData(type, from as string, to as string)
      .then(data => res.json(data))
      .catch(err => res.status(500).json({ error: err.message }));
  });

  const httpServer = createServer(app);

  return httpServer;
}
