const joi = require('joi');
const database = require('./database');
const fileMgmt = require('../shared/fileMgmt');

module.exports = {
    addCustomer: async function (req, res, next) {
        const reqBody = req.body;

        const schema = joi.object({

            name: joi.string().required().min(2).max(50),
            email: joi.string().required().regex(/^[^@]+@[^@]+$/),
            password_hase: joi.string().required().min(2).max(100),
            type: joi.number().required(),
        });

        const {
            error,
            value
        } = schema.validate(reqBody);

        if (error) {
            res.send(`error adding customer: ${error}`);
            return;
        }

        const sql =
            "INSERT INTO customers( name, email, password, type)" +
            " VALUES(?, ?, ?, ?);";

        try {
            const result = await database.query(
                sql,
                [
                    reqBody.name,
                    //reqBody.last_name,
                    reqBody.email,
                    reqBody.password_hase,
                    reqBody.type
                ]
            );
        } catch (err) {
            console.log(err);
            return;
        }

        res.send(`${reqBody.name} added successfully`);
    },




    customersList: async function (req, res, next) {
        const param = req.query; // get method
        //  const param = req.body;  // post method

        const schema = joi.object({
            column: joi.string().valid('name', 'email', 'type').default('name'),
            sort: joi.string().valid('ASC', 'DESC').default('ASC'),
        });

        const {
            error,
            value
        } = schema.validate(param);

        if (error) {
            console.log(error);
            res.status(400).send('add failed');
            return
        }

        const fieldsMap = new Map([
            ['name', 'customers.name'],
            ['email', 'customers.email'],
            ['type', 'customers.type'],
        ]);

        const sql = `SELECT customers.id, customers.name, customers.email, customers .type,  
            ORDER BY ${fieldsMap.get(value.column)} ${value.sort};`;

        try {
            const result = await database.query(sql);
            res.send(result[0]);
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    },


    exportCustomers: async function (req, res, next) {
        const sql = "SELECT * FROM customers;";
        fileMgmt.exportToFile(res, sql, 'customers');
    },



    findCustomer: async function (req, res, next) {

        const param = req.query;

        const schema = joi.object({
            search: joi.string().required().min(2)
        });

        const {
            error,
            value
        } = schema.validate(param);

        if (error) {
            res.status(400).send(`search error: ${error}`);
            throw error;
        }

        const searchQuery = `%${value.search}%`;

        const sql = `SELECT customers.name, customers.email,customers.type,   
       WHERE customers.name LIKE ? OR customers.email LIKE ? OR customers.type LIKE ? ;`;

        try {
            const result = await database.query(
                sql,
                [
                    searchQuery,
                    searchQuery,
                    searchQuery,
                ]
            );

            res.send(result[0]);
        } catch (err) {
            res.status(400).send(`search error: ${err}`);
            throw error;
        }
    },

}