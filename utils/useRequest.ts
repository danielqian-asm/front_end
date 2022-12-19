import axios, { AxiosRequestConfig } from 'axios';

const api = 'http://129.146.100.107';

/**
 * @description: useRequest({url: 'XXXXX', data: {}})
 * @param {type}
 * @return { response, error }
 */
export const useRequest = async (axiosConfig: AxiosRequestConfig) => {
  let response;
  let error;
  try {
    response = await axios(axiosConfig);
  } catch (err) {
    console.log(err)
  }
  return { response, error };
};

export const generate = async (data: any) =>
  useRequest({
    method: 'post',
    url: `${api}:5000/generate`,
    data,
  });


export const checkExist = async (id: string, imageNumber: number) =>
  useRequest({
    method: 'get',
    url: `/api/checkexist?id=${id}&imageNumber=${imageNumber}`,
  });

export const generateAudio = async (config: any) => {
  const { response }  = await useRequest({
    method: 'post',
    url: `${api}:5003/generate/audio`,
    data: config,
  });

  // const audioList = useRequest({
  //   method: 'get',
  //   url: `/api/checkexist?id=${id}&imageNumber=${imageNumber}`,
  // });
  return response
}

export const checkAudioExist = async (id: string, imageNumber: number) =>
  useRequest({
    method: 'get',
    url: `/api/checkexist?id=${id}&imageNumber=${imageNumber}`,
  });
