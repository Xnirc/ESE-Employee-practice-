const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all employees
router.get('/', authMiddleware, employeeController.getAllEmployees);

// Search employee
router.get('/search', authMiddleware, employeeController.searchEmployee);

// Add employee
router.post('/', authMiddleware, employeeController.addEmployee);

// Update employee
router.put('/:id', authMiddleware, employeeController.updateEmployee);

// Delete employee
router.delete('/:id', authMiddleware, employeeController.deleteEmployee);

module.exports = router;
