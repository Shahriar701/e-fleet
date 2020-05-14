import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const abbreviate = require('abbreviate');

export async function main(event, context) {

  const data = JSON.parse(event.body);

    data.orientation = data.orientation.toLowerCase();
    data.customer_name = data.customer_name;
    data.customer_id = data.customer_id;
    data.created_at = Date.now();
    data.order_id = abbreviate(data.customer_name, {length: 4}).toLowerCase() +'_'+data.created_at +'_'+ data.orientation +'_';
    data.pk = data.order_id;
    data.sk = data.orientation;

  const params = {
    TableName: process.env.tableName,
    Item: data
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
