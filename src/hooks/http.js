import {useCallback, useReducer} from 'react';

const initialState = {
        loading : false, 
        error : null, 
        data: null,
        extra : null,
        identifier : null
}

const httpReducer = (currHttpState, action) => {

    switch(action.type){
  
      case "SEND":
        return {loading : true, error : null, data : null, extra : null, identifier : action.identifier};
      case "RESPONSE":
        return {...currHttpState, loading : false, data : action.responseData, extra : action.extra};
      case "ERROR":
        return {loading : false, error : action.errorMessage};
      case "CLEAR":
        return initialState;
      default:
        throw new Error("Should not reach here");        
    };
  };

const useHttp = () => {

    //1. Can use useState(), useEffect(), useReducer() or any hook inside
    //2. Each functional component gets its own copy of useHttp. Each functional component will have own data of this hook

    //3. Your hook will run whenever component where you're using the hook runs

    const [httpState, dispatchHttp] = useReducer(httpReducer, {
        
        loading : false, 
        error : null, 
        data: null,
        extra : null,
        identifier : null
    });

    const clear = useCallback(() => dispatchHttp({type : "CLEAR"}), []);
    
    const sendRequest = useCallback( (url, method, body, reqExtra, reqIdentifier) => {

        dispatchHttp({type : "SEND", identifier : reqIdentifier});

        fetch(url, {

            method : method,
            body : body,
            headers : {

                'Content-Type' : 'application/json'
            }
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            dispatchHttp({type : "RESPONSE", responseData : responseData, extra : reqExtra});
        })
        .catch(error => {
            dispatchHttp({type : "ERROR", errorMessage : "Error msg from custom hook"});
        })

    }, []);

 
    return {
        isLoading : httpState.loading,
        data : httpState.data,
        error : httpState.error,
        sendRequest : sendRequest,
        reqExtra : httpState.extra,
        reqIdentifier : httpState.identifier,
        clear : clear
    };
      
};

export default useHttp;