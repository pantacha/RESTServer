

process.env.PORT = process.env.PORT || 8000;

process.env.NODE_ENV = process.env.NODE_ENV || 'env';

let urlDB;
if (process.env.NODE_ENV === 'env') {
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb+srv://George:PssERJrnmSY6M8pU@cluster0-y139h.mongodb.net/cafe';
}

process.env.URLDB = urlDB;

//PssERJrnmSY6M8pU

