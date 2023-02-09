const Operation = require("../models/Operation");
const Record = require("../models/Record");
const buildError = require("../utils/errorBuilder");

module.exports = {
  getOperations: async (req, res, next) => {
    try {
      let operations = await Operation.find();
      res.json({
        status: 200,
        data: operations,
      });
    } catch (err) {
      return next(buildError(err, err.status || 500));
    }
  },

  requestOperation: async (req, res, next) => {
    try {
      let answer = null;
      const {param1, param2} = req.body.params;
      const operation = await Operation.findOne({type: req.body.operation});
      if (!operation) {
        throw new Error('Your operation does not exist!');
      }
      if (req.user.cost >= operation.cost) {
        switch(operation.type) {
          case "addition":
            answer = Number(param1) + Number(param2);                
            break;
          case "subtraction":
            answer = Number(param1) - Number(param2);  
            break;
          case "multiplication":
            answer = Number(param1) * Number(param2);  
            break;
          case "division":
            answer = Number(param1) / Number(param2);  
            break;
          case "square_root":
            answer = Math.sqrt(Number(param1));
            break;
          case "random_string":
            answer = 'This is random string';
            break;
        }
        if (answer) {
          const newRecord = new Record({
            operation: operation.id,
            user: req.user.id,
            amount: operation.cost,
            userBalance: req.user.cost,
            operationResponse: answer
          });
          await newRecord.save();

          req.user.cost = req.user.cost - operation.cost;
          req.user.save();         
        }
      } else {
        throw new Error('Your credit is not enough!');
      }
      res.json({
        status: 200,
        data: answer,
      });
    } catch (err) {
      return next(buildError(err, err.status || 500));
    }
  },

  getRecords: async (req, res, next) => {
    try {
      const size = req.body.size || 5; // page size
      const page = req.body.page || 1; // current page
      const options = {
        offset: (page - 1) * size, 
        limit: size
      }
      const query = {'deleted': {$ne : true}};
      const records = await Record.find(query)
        .populate("operation")
        .populate("user")
        .lean({ virtuals: true })
        .sort({'createdAt' : -1})
        .limit(options.limit)
        .skip(options.offset)
        .exec();
      const count = await Record.countDocuments(query);
      res.json({
        status: 200,
        data: {records, totalPages: Math.ceil(count / options.limit)},
      });
    } catch (err) {
      return next(buildError(err, err.status || 500));
    }
  },

  deleteRecord: async (req, res, next) => {
    try {
      const record = await Record.findById(req.params.id);;
      record.deleted = true;
      await record.save();
      res.json({
        status: 200,
        data: { record }
      });
    }  catch (err) {
      return next(buildError(err, err.status || 500));
    }
  }
};
