const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const roleSc = require('../models/roles');

router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Insert Employee"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var employee = new Employee();
    const roleSchema = new roleSc();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    roleSchema.roleName = req.body.role;
    roleSchema.empName = req.body.fullName;

    employee.save((err, doc) => {
        roleSchema.empId = doc._id;
        if (!err){
            roleSchema.save()
                .then(role =>{
                    console.log(role);
                    res.redirect('employee/list'); 
                })
            ;
        }
           
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', async (req, res) => {
    let emps = await Employee.find({});
    let roles = await roleSc.find({});
    let empWithRoles = [];

 for (let index = 0; index < emps.length; index++) {
    for (let index2 = 0; index2 < roles.length; index2++) {
         if (emps[index]._id == roles[index2].empId){
             empWithRoles.push({
                 fullName : emps[index].fullName,
                 email : emps[index].email,
                 mobile : emps[index].mobile,
                 city : emps[index].city,
                 role : roles[index2].roleName
             })
         }
    }
     
 }


                console.log('made i');
            res.render("employee/list", {
                
                list : empWithRoles
            })
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

module.exports = router;