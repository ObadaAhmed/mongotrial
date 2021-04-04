const mongoose = require('mongoose');
const schema = mongoose.Schema;


const roleSchema = new schema({
    empId : {type : String , required : true},
    empName : {type: String , required : true},
    roleName : {type : String , required : true}
});

const Role = mongoose.model('empRole' , roleSchema);

module.exports = Role;

