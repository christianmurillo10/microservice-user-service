import { ConsumerConfig, EachMessagePayload, Kafka, KafkaConfig, logLevel, Message, Producer } from "kafkajs";

export default class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, any> = new Map();

  constructor(kafkaConfig: KafkaConfig) {
    this.kafka = new Kafka({ ...kafkaConfig, logLevel: logLevel.ERROR });
    this.producer = this.kafka.producer();
  };

  connectProducer = async () => {
    try {
      console.log("Connecting producer...")
      await this.producer.connect();
      console.log("Producer connected successfully connected successfully")
    } catch (error) {
      console.error("Failed to connect Kafka producer:", error);
    }
  };

  initializeProducer = async (
    topic: string,
    event: string,
    data: unknown
  ) => {
    try {
      const msg: Message = {
        key: event,
        value: JSON.stringify(data)
      }
      await this.producer.send({
        topic: topic,
        messages: [msg]
      })
      console.log(`Message sent to topic ${topic}`)
    } catch (error) {
      console.log("failed to initialise producer")
    }
  };

  disconnectProducer = async () => {
    try {
      console.log("Disconnecting producer...")
      await this.producer.disconnect();
      console.log("Producer disconnected successfully")
    } catch (error) {
      console.error("Failed to disconnect Kafka producer:", error);
    }
  };

  initializeConsumer = async (
    topic: string,
    groupId: string,
    eachMessageHandler: (payload: EachMessagePayload) => Promise<void>
  ) => {
    try {
      const consumerConfig: ConsumerConfig = { groupId: groupId };
      const consumer = this.kafka.consumer(consumerConfig);

      console.log(`Connecting Kafka consumer for topic: ${topic}`);
      await consumer.connect();
      console.log(`Kafka consumer connected for topic: ${topic}`);

      await consumer.subscribe({ topic, fromBeginning: true });
      console.log(`Subscribed to topic ${topic}`);

      await consumer.run({
        eachMessage: async (payload) => {
          await eachMessageHandler(payload);
        },
      });

      this.consumers.set(topic, consumer);
    } catch (error) {
      console.error("Failed to initialize Kafka consumer:", error);
    }
  };

  disconnectConsumer = async (topic: string) => {
    const consumer = this.consumers.get(topic);
    if (consumer) {
      try {
        console.log(`Disconnecting Kafka consumer for topic: ${topic}`);
        await consumer.disconnect();
        console.log(`Kafka consumer disconnected for topic: ${topic}`);
        this.consumers.delete(topic);
      } catch (error) {
        console.error(`Failed to disconnect Kafka consumer for topic: ${topic}`, error);
      }
    } else {
      console.log(`No consumer found for topic: ${topic}`);
    }
  };
};