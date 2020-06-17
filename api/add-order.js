import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const moment = require('moment');
const abbreviate = require('abbreviate');

export async function main(event, context) {

  const data = JSON.parse(event.body);

  data.orientation = data.orientation;
  data.name = data.name;
  data.customer_id = data.customer_id;
  data.created_at = Date.now();
  data.created_date = moment().add(-2, 'hours').format('YYYY-MM-DDThh:mm:ss');
  data.order_id = data.created_at + '_' + abbreviate(data.name, { length: 4 }).toLowerCase() + '_' + data.orientation.toLowerCase();
  data.pk = data.order_id;
  data.sk = data.customer_id;

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
    return failure({ isExecuted: false, error: e });
  }
}
