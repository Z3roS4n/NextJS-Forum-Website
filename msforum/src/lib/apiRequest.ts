interface getDataParams {
  url: string;
  params?: Record<string, string | number | undefined>
}

export default class ApiRequest {
  static getData = async ({url, params}: getDataParams) => {
    let queryString = '?';
    if(params && Object.keys(params).length > 0) {
      queryString +=
        Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${value ? encodeURIComponent(value) : ''}`)
          .join('&');
    }
      
    const request = `${url}${queryString}`;

    const res = await fetch(request);
    if(!res.ok) throw new Error('Fetch Error!');
    return res.json();
  }
}