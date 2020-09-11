import React, {useState, useEffect, useRef} from 'react';
import useHttp from "../../hooks/http";
import ErrorModal from "../UI/ErrorModal";

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const { onLoadIngredients } = props;

  const [enteredFilter, setEnteredFilter] = useState('');

  const {error, isLoading, sendRequest, clear, data} = useHttp();

  const inputRef = useRef();

  useEffect(() => {

    const timer = setTimeout(() => {

      if(enteredFilter === inputRef.current.value)
      {
        //enteredFilter = value user entered when we set timer (old value)
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;

        sendRequest("https://react-hooks-update-a78dd.firebaseio.com/ingredients.json" + query, "GET");
      };    

    }, 500);

    return () => {clearTimeout(timer)};
    //Clean up function - will run right before useEffect() will run next time
    //if there is [] as dependency (useEffect() runs once) then clean up function will run when component is unmounted

  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {

    if(!isLoading && !error && data)
    {
      const loadedIngredients = [];

          for(let key in data)
          {
            loadedIngredients.push({

              id: key,
              amount: data[key].amount,
              title: data[key].title

            });
          }

            onLoadIngredients(loadedIngredients);
    }

  }, [data, isLoading, error, onLoadIngredients])

  return (
    <section className="search">
      {error && <ErrorModal onClose = {clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>

          <input type="text"
          ref = {inputRef}
          value={enteredFilter}
          onChange={(event) => setEnteredFilter(event.target.value) }/>

        </div>
      </Card>
    </section>
  );
});

export default Search;