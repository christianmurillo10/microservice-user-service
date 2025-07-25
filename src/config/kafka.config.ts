export default {
  kafkaBroker: process.env.KAFKA_BROKER || "",
  kafkaClientId: process.env.KAFKA_CLIENT_ID || "",
  kafkaGroupId: process.env.KAFKA_GROUP_ID || ""
};