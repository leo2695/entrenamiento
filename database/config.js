const mongoose = require('mongoose');

const dbConnection = async () => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
            //useCreateIndex: true,
            //useFindAndModify: false //para poder usar findByIdAndUpdate tengo que quitarlo, recomendacion de mongoose
        });

        console.log('BD Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error iniciando la base de datos');
    }
}

module.exports = {
    dbConnection
}