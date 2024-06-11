import pauseApi from '@/api/pause/pause-api';

const repositories = {
  pauseCode: pauseApi,
}

export default {
  get: (name) => repositories[name],
}