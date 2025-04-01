import { Admin, AdminConfig, ConsumerConfig, EachMessagePayload, Kafka, KafkaConfig, logLevel, Message, Producer } from "kafkajs";
import { TopicConfig } from "../shared/types/kafka.type";

export default class KafkaService {
  private kafka: Kafka;
  private admin: Admin;
  private producer: Producer;
  private consumers: Map<string, any> = new Map();

  constructor(kafkaConfig: KafkaConfig, adminConfig?: AdminConfig) {
    this.kafka = new Kafka({ ...kafkaConfig, logLevel: logLevel.ERROR });
    this.admin = this.kafka.admin(adminConfig);
    this.producer = this.kafka.producer();
  };

  connectAdmin = async () => {
    try {
      console.log("Connecting Kafka admin...")
      await this.admin.connect();
      console.log("Kafka admin connected.");
    } catch (error) {
      console.error("Failed to connect Kafka admin:", error);
    }
  };

  disconnectAdmin = async () => {
    try {
      console.log("Disconnecting Kafka admin...");
      await this.admin.disconnect();
      console.log("Kafka admin disconnected.");
    } catch (error) {
      console.error("Failed to disconnect Kafka admin:", error);
    }
  };

  createTopics = async (topicConfig: TopicConfig[]) => {
    try {
      const result = await this.admin.createTopics({
        topics: topicConfig,
        timeout: 30000,
        waitForLeaders: true,
      });

      if (result) {
        console.log("Kafka topics created successfully.");
      } else {
        console.log("Kafka topics were already created.");
      }
    } catch (error) {
      console.error("Failed to create Kafka topics:", error);
    }
  };

  deleteTopics = async (topics: string[]) => {
    try {
      console.log("Deleting Kafka topics:", topics);
      await this.admin.deleteTopics({
        topics: topics,
        timeout: 30000,
      });
      console.log("Kafka topics deleted successfully.");
    } catch (error) {
      console.error("Failed to delete Kafka topics:", error);
    }
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
    topics: string[],
    groupId: string,
    eachMessageHandler: (payload: EachMessagePayload) => Promise<void>
  ) => {
    try {
      const consumerConfig: ConsumerConfig = { groupId: groupId };
      const consumer = this.kafka.consumer(consumerConfig);

      console.log(`Connecting Kafka consumer for topic: ${topics}`);
      await consumer.connect();
      console.log(`Kafka consumer connected for topic: ${topics}`);

      await consumer.subscribe({ topics, fromBeginning: true });
      console.log(`Subscribed to topic ${topics}`);

      await consumer.run({
        eachMessage: async (payload) => {
          await eachMessageHandler(payload);
        },
      });

      topics.map(topic => {
        this.consumers.set(topic, consumer);
      });
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