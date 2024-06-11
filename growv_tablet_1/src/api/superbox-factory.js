import superboxApi from '@/api/superbox/superbox-api';

const repositories = {
  superboxCode: superboxApi,
}

export default {
  get: (name) => repositories[name],
}