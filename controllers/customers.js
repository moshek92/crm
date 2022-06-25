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


    exportCustomers: function (req, res, next) {
        const sql = "SELECT * FROM customers;";
        fileMgmt.exportToFile(res, sql, 'customers');
    }

    // todo: search in customers by parameter (name,email,country)
    // sql: SELECT WHERE
    // findCustomer: async function (req, res, next) {
    /*
    1. [V] client send request using html form
    2. the request is being send to a router 
        -[V] router maps the request to a function (controller),
        -[V] router uses READ -> GET API
    3. controller function:
        -[V] req.query -> parameters in the request from client
        -[V] use joi to validate req.query param (string, required, min 2 characters)
        -[V] error or success => manage error
        -[V] if success => add parameters into query
        -[V] send query to database and get results
        -[V] return response to client, display to user
    */

    // const param = req.query;

    // const schema = joi.object({
    //     search: joi.string().required().min(2)
    // });

    // const {
    //     error,
    //     value
    // } = schema.validate(param);

    // if (error) {
    //     res.status(400).send(`search error: ${error}`);
    //     throw error;
    // }

    //  const searchQuery = `%${value.search}%`;

    //const sql = `SELECT customers.id, customers.name, customers.email,   
    //   WHERE customers.name LIKE ? OR customers.email LIKE ? OR customers.LIKE ? 
    //   ORDER BY customers.name ASC;`;

    // try {
    //    const result = await database.query(
    //        sql,
    //        [
    //             searchQuery,
    //             searchQuery,
    //             searchQuery,
    //         ]
    //     );

    //    res.send(result[0]);
    //} catch (err) {
    //    res.status(400).send(`search error: ${err}`);
    //    throw error;
    // }
    // },

    // todo: edit/update customer
    // updateCustomer: async function (req, res, next) {},

    // todo: view more details of a customer
    // viewCustomerDetails: async function (req, res, next) { },
}