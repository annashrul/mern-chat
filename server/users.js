const users = [];

const create = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const exist = users.find((user) => user.room === room && user.name === name);

  if (exist) {
    return { error: "Username is Taken" };
  }

  const user = { id, name, room };
  users.push(user);
  return { user };
};
const remove = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
const get = (id) => users.find((user) => user.id === id);
const getBy = (val) => users.filter((user) => user.room === val);

module.exports = { create, remove, get, getBy };
