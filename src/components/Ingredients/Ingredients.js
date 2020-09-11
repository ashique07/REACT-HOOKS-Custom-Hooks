import React, {useState, useEffect, useCallback, useReducer} from 'react';
import IngredientList from "./IngredientList";
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

const ingredientReducer = (currentIngredients, action) => {

  switch(action.type) {

    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter(ingredient => ingredient.id !== action.id);
    default:
      throw new Error("Should not reach here");      
  };
};

function Ingredients() {

  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  //Everything from useHttp() custom hook
  const {isLoading, data, error, sendRequest, reqExtra, reqIdentifier, clear} = useHttp();

  useEffect(() => {

    if(!isLoading && !error && reqIdentifier === "REMOVE_INGREDIENT")
    {
      dispatch({type : "DELETE", id : reqExtra});
    }
    else if (!isLoading && !error && reqIdentifier === "ADD_INGREDIENT")
    {
      dispatch({type : "ADD", ingredient : {id : data.name, ...reqExtra}})
    }

  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  

  const addIngredientHandler = useCallback( (ingredient) => {

    //Method from custom hook
    sendRequest("https://react-hooks-update-a78dd.firebaseio.com/ingredients.json",
     'POST', 
     JSON.stringify(ingredient),
     ingredient,
     "ADD_INGREDIENT");

  }, [sendRequest]);

  //filteredIngredientsHandler is not re-rendered because of useCallback
  const filteredIngredientHandler = useCallback(filteredIngredients => {

    dispatch({type : "SET", ingredients : filteredIngredients});
    
  },[]);

  const removeIngredientHandler = useCallback(ingredientId => {

    //Method from custom hook
    sendRequest(`https://react-hooks-update-a78dd.firebaseio.com/ingredients/${ingredientId}.json`, 
    'DELETE', 
    null, 
    ingredientId,
    "REMOVE_INGREDIENT");

  },[sendRequest]);

  return (
    <div className="App">

    {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm onAddIngredient = {addIngredientHandler} loading = {isLoading} />

      <section>
        <Search onLoadIngredients = {filteredIngredientHandler} />
        <IngredientList ingredients = {userIngredients} onRemoveItem = {removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;