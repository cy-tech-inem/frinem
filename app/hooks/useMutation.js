import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL, KEY_TOKEN } from "@env"

const initialState = { loading: false };

function useMutation(onCompleted, onError) {

  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const [state, setState] = useState(initialState);

  const mutate = (input, method, variables) => {
    const init = variables
      ? {
          headers,
          method: method,
          body: JSON.stringify(variables),
        }
      : {
          headers,
          method: method,
        };

    setState({ loading: true });
    if (headers.has("authorization")) {
      return fetch(API_URL + input, init).then(res => {
        setState({ loading: false })
        return res.json()
      })
    } else {
      return AsyncStorage.getItem(KEY_TOKEN).then(token => {
        if (token) {
          headers.append("authorization", "Bearer " + token);
        } 

        return fetch(API_URL + input, init).then(res => {
          setState({ loading: false })
          return res.json()
        })
      }).catch(() => {
        return fetch(API_URL + input, init).then(res => {
          setState({ loading: false })
          return res.json()
        })
      })
    }
  };

  useEffect(() => {
    const { data, loading, error } = state;

    if (!loading) {
      if (onCompleted && !error) {
        onCompleted(data);
      } else if (onError && error) {
        onError(error);
      }
    }
  }, [state.loading, state.error, state.data]);

  return [mutate, state];
}

export default useMutation;
