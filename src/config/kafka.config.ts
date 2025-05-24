export default {
  kafka_broker: process.env.KAFKA_BROKER || "",
  kafka_client_id: process.env.KAFKA_CLIENT_ID || "",
  kafka_group_id: process.env.KAFKA_GROUP_ID || ""
};