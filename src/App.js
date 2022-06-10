import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import useInfiniteScroll from "./useInfiniteScroll";
import "./App.css"

const MovieCard = ({ movieData }) => {
  return (
    <div className='mt-2'>
      <Card style={{ width: '50rem' }}>
        <Card.Header>{movieData.titleType}</Card.Header>
        <Card.Body>
          <Card.Title>{movieData.primaryTitle}</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item><span style={{ fontWeight: 'bold' }}>Genre: </span> {movieData.genres}</ListGroup.Item>
            <ListGroup.Item><span style={{ fontWeight: 'bold' }}>Year: </span>{movieData.startYear}</ListGroup.Item>
            <ListGroup.Item><span style={{ fontWeight: 'bold' }}>Runtime minutes: </span>{movieData.runtimeMinutes}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  )
}

const fetchTotalCount = async (searchPhrase, offset) => {
  let totalCountResponse = await fetch(`http://localhost:4040/v1/search/${searchPhrase}?totalcount=1`); //Fetch total count of search results ifintial fetch (offset =0)
  if (!totalCountResponse.ok) {
    throw new Error(`Error! status: ${totalCountResponse.status}`)
  }
  return await totalCountResponse.json();
}

const fetchMovieData = async (searchPhrase, offset, limit) => {
  let movieDataResponse = await fetch(`http://localhost:4040/v1/search/${searchPhrase}?offset=${offset}&limit=${limit}`); //Fetch search results based on offset and limit
  if (!movieDataResponse.ok) {
    throw new Error(`Error! status: ${movieDataResponse.status}`)
  }
  return await movieDataResponse.json();
}

const App = () => {

  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');
  const [searchPhrase, setSearchPhrase] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(40);
  const [bottomOfPage, setBottomOfPage] = useState(false);

  const handleMovieData = async () => {
    setIsLoading(true);
    try {
      setErr('');
      if (offset === 0) {
        const totalCountResult = await fetchTotalCount(searchPhrase, offset);
        setCount(totalCountResult.count);
      }
      if (offset < count || count === 0) {
        const movieDataResult = await fetchMovieData(searchPhrase, offset, limit);
        setData(data.concat(movieDataResult.searchResult));
        setOffset(offset + limit);
      } else {
        setBottomOfPage(true)
      }
    } catch (err) {
      setErr(err.message);
      setData([]);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }
  const [isFetching, setIsFetching] = useInfiniteScroll(handleMovieData);

  const handleClick = () => {
    setData([]);
    setOffset(0);
    setBottomOfPage(false);
    setIsFetching(true);
  }

  return (
    <div className="App">
      <h1>My Movie Search Engine</h1>
      <input type="text" placeholder="Enter search phrase..." onChange={event => { setSearchPhrase(event.target.value) }}></input>
      <button onClick={handleClick}>Movie Search</button>
      {count > 0 && ('Found ' + count + ' results...')}
      {isLoading && <h2>Loading...</h2>}
      {err && <h2>{err}</h2>}
      {
        data.map(data => { if (data.runtimeMinutes === null) { return { ...data, runtimeMinutes: 'Not found' } } return data }).map((data, index) => <MovieCard key={index} movieData={data} />)
      }
      {(isFetching && !bottomOfPage) && 'Fetching more list items...'}
      {bottomOfPage && 'No more search results...'}
    </div>
  );
}
export default App; 