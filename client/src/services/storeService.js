import axios from 'axios';

const getStores = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/stores');
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

const storeService = {
  getStores,
};

export default storeService;