export class ApiService {
  baseUrl = "/";

  constructor(config){
    Object.assign(this, config);
  }
  setResource = (context, method) =>  {
    context = context.charAt(0).toUpperCase() + context.slice(1);
    return this.baseUrl+`${context}/${method}`;
  }
  setHeaders = (context, method) =>  {
    let headers = {
        "Content-Type": "application/json"
    };
    if(method == 'uploadItem') headers = {}
    if(localStorage['x-sid']) headers['x-sid'] = localStorage['x-sid'];
    return headers;
  }

  post = async(context, method, params = {}) =>  {
    var self = this;
    let responseData = {};
    const resource = this.setResource(context, method);
    const headers = this.setHeaders(context, method);
    let data = JSON.stringify(params);
    if(method == 'uploadItem') data = params
    await fetch(resource, {
        method: 'POST', // or 'PUT'
        credentials: 'include',
        headers: headers,
        body: data,
        })
        .then((response) => {
            if(response.headers.get('x-sid')){
                localStorage.setItem('x-sid', response.headers.get('x-sid'))
            }
            return response.json()
        })
        .then((data) => {
            responseData = data;
        })
        .catch((error) => {
            responseData = error;
        });
    return responseData;
  }
}


export class Api extends ApiService{
    wordform = {
        getItem: (params) => {
            return this.post('wordform', 'getItem', params)
        },
        getList: (params) => {
            return this.post('wordform', 'getList', params)
        },
        getTotalRows: (params) => {
            return this.post('wordform', 'getTotalRows', params)
        }
    }
    translator = {
        analyze: (params) => {
            return this.post('translator', 'analyze', params)
        },
        train: (params) => {
            return this.post('translator', 'train', params)
        },
        predict: (params) => {
            return this.post('translator', 'predict', params)
        },
    }
    sentence = {
        getPair: (params) => {
            return this.post('sentence', 'getPair', params)
        },
        setTrained: (params) => {
            return this.post('sentence', 'setTrained', params)
        },
    }
    book = {
        getItem: (params) => {
            return this.post('book', 'getItem', params)
        },
        getList: (params) => {
            return this.post('book', 'getList', params)
        },
        createItem: (params) => {
            return this.post('book', 'createItem', params)
        },
    }
    chapter = {
        getItem: (params) => {
            return this.post('chapter', 'getItem', params)
        },
        getList: (params) => {
            return this.post('chapter', 'getList', params)
        },
        createItem: (params) => {
            return this.post('chapter', 'createItem', params)
        }
    }
    text = {
        getItem: (params) => {
            return this.post('text', 'getItem', params)
        },
        getList: (params) => {
            return this.post('text', 'getList', params)
        },
        saveItem: (params) => {
            return this.post('text', 'saveItem', params)
        },
        exportItem: (params) => {
            return this.post('text', 'exportItem', params)
        },


    }
}
