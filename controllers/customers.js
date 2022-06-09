const joi = require('joi');
const database = require('./database');
//const fileMgmt = require('../shared/fileMgmt');

module.exports = {
    addCustomer: async function (req, res, next) {
        const reqBody = req.body;

        const schema = joi.object({
            name: joi.string().required().min(2).max(200),
            email: joi.string().required().regex(/^[^@]+@[^@]+$/),
            //countryInputHtml: joi.number().required(),
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
            "INSERT INTO customers(name, email, password, type)" +
            " VALUES(?,?,?,?);";

        try {
            const result = await database.query(
                sql,
                [
                    reqBody.name,
                    reqBody.email,
                    reqBody.passeors,
                    type,
                ]
            );
        } catch (err) {
            console.log(err);
            return;
        }

        res.send(`${reqBody.name} added successfully`);
    },

   
}
