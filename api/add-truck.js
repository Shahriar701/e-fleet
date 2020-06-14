import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

//const util = require('./utils');
const moment = require('moment');

//const abbreviate = require('abbreviate');

export async function main(event, context) {

  const data = JSON.parse(event.body);
  data.orientation = data.orientation;
  data.name = data.name;
  data.vendor_id = data.vendor_id;
  data.truck_reg = data.truck_reg;
  data.capacity = data.capacity;
  data.type = data.type;
  data.truck_id = data.truck_reg+'_'+data.orientation;
  data.status = data.status;
  data.created_at = Date.now();
  data.created_date = moment().add(-2, 'hours').format('YYYY-MM-DD hh:mm:ss');
  data.pk = data.truck_id;
  data.sk = data.vendor_id;

  const params = {
    TableName: process.env.tableName,
    Item: data,
    ConditionExpression: "truck_reg <> :tr",
    ExpressionAttributeValues: {
      ":tr": data.truck_reg
    }
  };
  try {
    await dynamoDbLib.call("put", params);
    return success({
      data: params.Item,
      isExecuted: true
    });
  } catch (e) {
    return failure({ isExecuted: false, error: e });
  }
}
