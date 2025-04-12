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
      console.info("Connecting producer...")
      await this.producer.connect();
      console.info("Producer connected successfully connected successfully")
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
      console.info(`Message sent to topic ${topic}`)
    } catch (error) {
      console.info("failed to initialise producer")
    }
  };

  disconnectProducer = async () => {
    try {
      console.info("Disconnecting producer...")
      await this.producer.disconnect();
      console.info("Producer disconnected successfully")
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
      const consumerConfig: ConsumerConfig = {
        groupId: groupId,
        heartbeatInterval: 10000,
        sessionTimeout: 60000
      };
      const consumer = this.kafka.consumer(consumerConfig);

      console.info(`Connecting Kafka consumer for topic: ${topic}`);
      await consumer.connect();
      console.info(`Kafka consumer connected for topic: ${topic}`);

      await consumer.subscribe({ topic, fromBeginning: true });
      console.info(`Subscribed to topic ${topic}`);

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
        console.info(`Disconnecting Kafka consumer for topic: ${topic}`);
        await consumer.disconnect();
        console.info(`Kafka consumer disconnected for topic: ${topic}`);
        this.consumers.delete(topic);
      } catch (error) {
        console.error(`Failed to disconnect Kafka consumer for topic: ${topic}`, error);
      }
    } else {
      console.info(`No consumer found for topic: ${topic}`);
    }
  };
};