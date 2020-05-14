import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

//const util = require('./utils');


//const abbreviate = require('abbreviate');

export async function main(event, context) {

    const data = JSON.parse(event.body);
    data.vendor_name = data.vendor_name;
    data.vendor_id = data.vendor_id;
    data.truck_reg = data.truck_reg;
    data.capacity = data.capacity;
    data.type = data.type;

    data.truck_id = 'truck_' + data.truck_reg;

    data.is_available = data.is_available;
    data.created_at = Date.now();

    data.pk = data.truck_id;
    data.sk = data.vendor_id;

  const params = {
    TableName: process.env.tableName,
    Item: data,
    ConditionExpression: "truck_reg <> :tr ",
    ExpressionAttributeValues:{
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
    return failure({ isExecuted: false });
  }
}
