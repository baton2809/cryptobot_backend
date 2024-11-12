import mongoose from 'mongoose';

interface Gift {
  id: number;
  name: string;
  available: number;
  total: number;
  price: number;
  currency: string;
  image: string;
}

const metadataSchema = new mongoose.Schema<Gift>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  available: { type: Number, required: true },
  total: { type: Number, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  image: { type: String, required: true },
});

const data = [
  {
    id: 1,
    name: 'Delicious Cake',
    available: 900,
    total: 5000,
    price: 1,
    currency: 'USDT',
    image: './img/delicious_cake.json',
  },
  {
    id: 2,
    name: 'Green Star',
    available: 1,
    total: 10000,
    price: 0.1,
    currency: 'TON',
    image: './img/green_star.json',
  },
  {
    id: 3,
    name: 'Red Star',
    available: 500,
    total: 1000,
    price: 10,
    currency: 'UDST',
    image: './img/green_star.json',
  },
];

// const metadataSchema = new mongoose.Schema<Gift[]>(data);

const Metadata = mongoose.model('metadata', metadataSchema);

const insertMetadata = async (metadatas: Gift[]) => {
  try {
    await Metadata.insertMany(metadatas, { ordered: false });
    console.log('Документы успешно вставлены в коллекцию metadata');
  } catch (error) {
    console.error('Ошибка при вставке документов:', error);
  }
};

async function connectDB() {
  await mongoose.connect('mongodb://127.0.0.1:27017/cryptobot');

  const count = await Metadata.countDocuments();
  if (count === 0) {
    await insertMetadata(data);
    console.log('База данных инициализирована начальными данными.');
  } else {
    console.log('Данные уже существуют в базе данных.');
  }

  await mongoose.disconnect();
}

connectDB();
