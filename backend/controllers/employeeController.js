const Employee = require('../models/Employee');

exports.addEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;
    
    // Validation Logic
    if (performanceScore === undefined) {
      return res.status(400).json({ message: 'Validation Error: Performance score is required.' });
    }
    
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Error: Employee with this email already exists' });
    }

    const employee = new Employee({ name, email, department, skills, performanceScore, experience });
    await employee.save();
    res.status(201).json({ message: 'Employee stored successfully', employee });
  } catch (err) {
    next(err);
  }
};

exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    next(err);
  }
};

exports.searchEmployee = async (req, res, next) => {
  try {
    const { department } = req.query;
    let query = {};
    if (department) {
      query.department = { $regex: new RegExp(department, 'i') };
    }
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (err) {
    next(err);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (err) {
    next(err);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee removed successfully' });
  } catch (err) {
    next(err);
  }
};
