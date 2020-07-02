import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
const moment = require("moment-timezone");
const date = new Date();

export async function main(event, context) {

  const data = JSON.parse(event.body);
  // const util = require('./utils');

  data.orientation = data.orientation;
  // data.app_user_name = util.getUserName(event.headers);
  // data.app_user_id = util.getUserId(event.headers);
  data.name = data.name;
  data.email = data.email;
  data.phone = data.phone;
  data.created_at = Date.now();
  data.created_date = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
  data.customer_id = data.customer_id;
  data.pk = data.email;
  data.sk = data.customer_id;

  const params = {
    TableName: process.env.tableName,
    Item: data,
    ConditionExpression: "email <> :email OR phone <> :phone",
    ExpressionAttributeValues: {
      ":phone": data.phone,
      ":email": data.email
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