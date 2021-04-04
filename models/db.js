const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/DBAssignment', { useNewUrlParser: true , useUnifiedTopology : true }, (err) => {
    if (!err) { console.log('MongoDB Connection sss.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./employee.model');