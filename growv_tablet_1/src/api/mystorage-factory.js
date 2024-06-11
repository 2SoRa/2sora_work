import mystorageApi from '@/api/mystorage/mystorage-api';

const repositories = {
  mystorageCode: mystorageApi,
}

export default {
  get: (name) => repositories[name],
}