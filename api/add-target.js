import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const moment = require('moment-timezone');
const date = new Date();

export async function main(event, context) {

  const data = JSON.parse(event.body);

  data.orientation = data.orientation;
  data.created_at = Date.now();
  data.created_date = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
  data.target_id = data.created_date + '_' + data.orientation.toLowerCase();
  data.pk = data.target_id;
  data.sk = data.created_date;
  data.status = data.orientation;

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
