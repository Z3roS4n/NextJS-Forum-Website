interface getDataParams {
  url: string;
  params?: Record<string, string | boolean | number | undefined>
}

interface putDataParams {
  url: string;
  body: Object;
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

  static postData = async ({url, body}: putDataParams) => {
    if(body) {
      const res = await fetch(url, {             
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });
      if(!res.ok) throw new Error('Fetch Error!');
      return res.json();
    }
  }

  static putData = async ({url, body}: putDataParams) => {
    if(body) {
      const res = await fetch(url, {             
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });
      if(!res.ok) throw new Error('Fetch Error!');
      return res.json();
    }
  }
}