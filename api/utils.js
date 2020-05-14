const getUserId = (headers) => {
    return headers.user_id;
};

const getUserName = (headers) => {
    return headers.user_name;
};

const getCustoemrId = (headers) => {
    return headers.customer_id;
};

const getCustomerName = (headers) => {
    return headers.customer_name;
};

const getCustomerType = (headers) => {
    return headers.customer_type;
};

const getOrderId = (headers) => {
    return headers.order_id;
};

const getVendorId = (headers) => {
    return headers.vendor_id;
};

const getOrientation = (headers) => {
    return headers.orientation;
};

const getPk = (headers) => {
    return headers.pk;
};

const getSk = (headers) => {
    return headers.sk;
};

const getStatus = (headers) => {
    return headers.status;
};


const getVendorName = (headers) => {
    return headers.sk;
};

const getResponseHeaders = () => {
    return {
        'Access-Control-Allow-Origin': '*'
    };
};

export {
    getUserId,
    getUserName,
    getCustoemrId,
    getCustomerName,
    getCustomerType,
    getOrientation,
    getVendorId,
    getVendorName,
    getOrderId,
    getSk,
    getPk,
    getStatus,
    getResponseHeaders
};