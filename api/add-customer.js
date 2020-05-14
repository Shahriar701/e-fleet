import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const abbreviate = require('abbreviate');

export async function main(event, context) {

    const data = JSON.parse(event.body);

    data.orientation = data.orientation.toLowerCase();
    data.customer_name = data.customer_name;
    data.customer_phn = data.customer_phn;
    data.created_at = Date.now();
    data.customer_id = abbreviate(data.customer_name, {length: 4}).toLowerCase() + '_' + data.customer_phn + '_' + data.orientation;
    data.pk = data.customer_id;
    data.sk = data.orientation;

  const params = {
    TableName: process.env.tableName,
    Item: data,
    ConditionExpression: "customer_id <> :ci ",
    ExpressionAttributeValues:{
        ":ci": data.customer_id
    }
  };
  try {
    await dynamoDbLib.call("put", params);
    return success({
      data: params.Item,
      isExecuted: true,
    });
  } catch (e) {
    return failure({ isExecuted: false, error: e });
  }
}
