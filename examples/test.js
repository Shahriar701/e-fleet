// import * as dynamoDbLib from "../libs/dynamodb-lib";
// import { success, failure } from "../libs/response-lib";

// export async function main(event, context) {
//   const data = JSON.parse(event.body);

//   data.order_id = data.order_id;
//   data.created_at = Date.now();
//   data.orientation = data.orientation;
//   data.pk = data.order_id;
//   data.sk = data.orientation;

//   const params = {
//     TransactItems: [{
//       Update: {
//         TableName: process.env.tableName,
//         Item: data,
//         Key: {
//           pk: data.pk,
//           sk: data.sk
//         },
//         UpdateExpression: "SET #status = :status",
//         ExpressionAttributeNames: {
//           "#status": 'status'
//         },
//         ExpressionAttributeValues: {
//           ":status": data.status
//         },
//         ReturnValues: "ALL_NEW"
//       }
//     }, {
//       Put: {
//         TableName: process.env.tableName,
//         Item: data,
//         ConditionExpression: '#pk = :pk AND #sk = :sk',
//         ExpressionAttributeNames: {
//           '#pk': 'pk',
//           '#sk': 'sk'
//         },
//         ExpressionAttributeValues: {
//           ":pk": data.pk,
//           ":sk": data.sk
//         }
//       }
//     }, {
//       Update: {
//         TableName: process.env.tableName,
//         Item: data,
//         Key: {
//           pk: data.pk,
//           sk: data.sk
//         },
//         UpdateExpression: "SET #status = :status",
//         ExpressionAttributeNames: {
//           "#status": 'status'
//         },
//         ExpressionAttributeValues: {
//           ":status": data.status
//         },
//         ReturnValues: "ALL_NEW"
//       }
//     }]
//   };

//   try {
//     await dynamoDbLib.call("transactWrite", params);
//     return success({
//       data: params.Item,
//       isExecuted: true
//     });
//   } catch (e) {
//     return failure({ status: false, error: e });
//   }
// }


// const a = {
// 	"TransactItems": [{
//         "Update": {
//             "Item": {
//                 "pk": "1589727785726_bat_order",
// 			        	"sk": "01786788976_bat_customer",
// 			        	"status": "orderConfirmed"
//             }
//         }
//     }, {
//         "Put": {
//             "Item": {
//                 "order_id":"1589727785726_bat_order",
//     		      	"orientation":"lease",
//     		      	"own_vendor":[

// 			        {
// 			            "capacity": "3",
// 			            "device_id": "12345678",
// 			            "truck_id": "truck_3_open_dhaka-123459",
// 			            "truck_reg": "dhaka-123458",
// 			            "type": "covered"
// 			          },
// 			          {
// 			            "capacity": "5",
// 			            "truck_id": "truck_3_open_dhaka-123457",
// 			            "truck_reg": "dhaka-123457",
// 			            "type": "covered"
// 			          }

// 				    ],
// 				    "other_vendor":[
// 				        {
// 				            "vendor_email": "tbl@tbl.com",
// 				            "vendor_id": "vendor_tbl_1237",
// 				            "vendor_name": "True Brothers LTD",
// 				            "vendor_phn": "01673092106",
// 				            "capacity":"5",
// 				            "type":"covered",
// 				            "amount":"3"
// 				        },
// 				        {
// 				            "vendor_email": "tbl@tbl.com",
// 				            "vendor_id": "vendor_tbl_1237",
// 				            "vendor_name": "True Brothers LTD",
// 				            "vendor_phn": "01673092106",
// 				            "capacity":"3",
// 				            "type":"open",
// 				            "amount":"1"
// 				        }
// 				    ]
//             }
//         }
//     }, {
//         "Update": {
//             "Item": {
//                 "pk": "hjhjdhh_other",
//                 "sk": "017889977990_rngs_vendor",
//                 "status":"rented"
//             }
//         }
//     }]
// }

//1591997654844 

const moment = require('moment');

console.log(moment().add(-7, 'days').add(-2, 'hours').format('YYYY-MM-DD'));

