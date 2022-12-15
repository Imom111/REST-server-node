const mongoose = require('mongoose');

const dbConnection = async() =>{
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('base de datos online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la abse de datos');
    }
}

module.exports = {
    dbConnection
}