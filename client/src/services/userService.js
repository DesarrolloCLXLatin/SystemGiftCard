import axios from 'axios';

const findUserByEmail = async (email) => {
  return await axios.get(`/api/user/find?email=${email}`);
};

const userService = {
  findUserByEmail,
};

export default userService;
