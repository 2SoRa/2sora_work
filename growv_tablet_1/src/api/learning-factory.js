import scheduleApi from '@/api/learning/schedule-api';

const repositories = {
  scheduleCode: scheduleApi,
}

export default {
  get: (name) => repositories[name],
}