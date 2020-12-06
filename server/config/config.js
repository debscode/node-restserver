/**
 * Port
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * Environment
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Data base
 */

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = 'mongodb+srv://debs:imQcEgJGTIB6rZaM@cluster0.yyx0d.mongodb.net/coffee';
}

process.env.urlDB = urlDB;