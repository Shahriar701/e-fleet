// import * as dynamoDbLib from "../libs/dynamodb-lib";
// import { success, failure } from "../libs/response-lib";

// export async function main(event, context) {

//   try {
//     const data = JSON.parse(event.body);

//     const params = null;
//     params = {
//       TransactItems: [{
//         Put: {
//           TableName: process.env.tableName,
//           order_id: data.order_id,
//           created_at: Date.now(),
//           orientation: data.orientation,
//           pk: data.order_id,
//           sk: data.orientation,

//           ConditionExpression: "order_id <> :oi ",
//           ExpressionAttributeValues: {
//             ":oi": data.order_id
//           }
//         }
//       }, {
//         Update: {
//           TableName: process.env.tableName,
//           Item: element,
//           Key: {
//             pk: element.pk,
//             sk: element.sk
//           },
//           UpdateExpression: "SET #status = :status",
//           ExpressionAttributeNames: {
//             "#status": 'status'
//           },
//           ExpressionAttributeValues: {
//             ":status": element.status
//           },
//           ReturnValues: "ALL_NEW"
//         }
//       }]
//     };

//     await dynamoDbLib.call("transactWrite", params);


//     return success({
//       data: params.TransactItems,
//       isExecuted: true
//     });
//   } catch (e) {
//     return failure({ status: false, error: e });
//   }
// }


// // import * as dynamoDbLib from "../libs/dynamodb-lib";
// // import { success, failure } from "../libs/response-lib";

// // const abbreviate = require('abbreviate');
// // const moment = require("moment-timezone");
// // const date = new Date();

// // export async function main(event, context) {

// //   const data = JSON.parse(event.body);
// //   const util = require('./utils');

// //   data.orientation = data.orientation;
// //   data.app_user_name = util.getUserName(event.headers);
// //   data.app_user_id = util.getUserId(event.headers);
// //   data.name = data.name;
// //   data.email = data.email;
// //   data.type = data.type;
// //   data.phone = data.phone;
// //   data.created_at = Date.now();
// //   data.created_date = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
// //   data.customer_id = data.phone + '_' + abbreviate(data.name, { length: 4 }).toLowerCase() + '_' + data.orientation.toLowerCase();
// //   data.pk = data.customer_id;
// //   data.sk = data.type;

// //   const params = {
// //     TableName: process.env.tableName,
// //     Item: data,
// //     ConditionExpression: "customer_id <> :ci OR phone <> :phone OR email <> :email",
// //     ExpressionAttributeValues: {
// //       ":ci": data.customer_id,
// //       ":phone": data.phone,
// //       ":email": data.email
// //     }
// //   };
// //   try {
// //     await dynamoDbLib.call("put", params);
// //     return success({
// //       data: params.Item,
// //       isExecuted: true,
// //     });
// //   } catch (e) {
// //     return failure({ isExecuted: false, error: e });
// //   }
// // }

