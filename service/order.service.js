const fs = require('fs');

const DB_PATH = 'db/orders.json';

const prepare = async () => {
  var dir = 'db';

  const dirExists = await fs.existsSync(dir);

  if (!dirExists){
    await fs.mkdirSync(dir);
  }

  if (!fs.existsSync(DB_PATH)) {
    await fs.writeFileSync(DB_PATH, JSON.stringify({}));
  }
};

const get = async (id) => {
  try {
    await prepare();
    const orders = await getList();
    return orders[id] || null;
  } catch (err) {
    console.log(err);
  }
};

const getList = async () => {
  const rawContent = await fs.readFileSync(DB_PATH);
  const orders = JSON.parse(rawContent);

  return orders || {};
};

const save = async (data) => {
  await prepare()
    .then(async () => {
      const orders = await getList();
      orders[data.orderId] = data;
      await fs.writeFileSync(DB_PATH, JSON.stringify(orders));
    })
    .catch((err) => console.log(err));
};

module.exports = {
  get,
  getList,
  save,
};
