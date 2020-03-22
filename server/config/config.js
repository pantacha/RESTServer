

process.env.PORT = process.env.PORT || 8000;

process.env.NODE_ENV = process.env.NODE_ENV || 'env';

process.env.CAD_TOKEN = 60 * 60 * 24 * 30;

process.env.SEED = process.env.SEED || 'secret';

let urlDB;
if (process.env.NODE_ENV === 'env') {
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//PssERJrnmSY6M8pU

