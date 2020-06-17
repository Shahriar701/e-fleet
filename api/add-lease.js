import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const moment = require('moment');

export async function main(event, context) {

  const data = JSON.parse(event.body);

    data.order_id = data.order_id;
    data.created_at = Date.now();
    data.created_date = moment().add(-2, 'hours').format('YYYY-MM-DDThh:mm:ss');
    data.orientation = data.orientation;
    data.pk = data.order_id;
    data.sk = data.orientation;

  const params = {
    TableName: process.env.tableName,
    Item: data,
    ConditionExpression: "order_id <> :oi ",
    ExpressionAttributeValues:{
        ":oi": data.order_id
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
