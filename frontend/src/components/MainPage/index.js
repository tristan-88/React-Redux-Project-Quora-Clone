import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from 'react-router-dom';
import * as sessionActions from "../../store/session";
import { showMgtCards } from "../../store/mgtcards";
import Card from "./Card"
import './MainPage.css'
import Footer from './../Footer/Footer'
import Navigation from "../Navigation";

function MainPage() {
  //reducers
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const mgtCardsState = useSelector(state => state?.mgtcardsRdcr) || {};

  //grabbing the values from the object to an array
  const cards = Object.values(mgtCardsState);

  //fetch call from api
  useEffect(() => {
    dispatch(showMgtCards());
  }, []);
  //Logout re-direct

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return (
    <>
    {/* <div className="main-page-container"> */}
    <div className="main-page-div">
        <Navigation isLoaded={ isLoaded}/>
<div>
  {sessionUser && <div className="cards-container">
        {cards.map((card) => <Card card={card} key={card.id} />)}
      </div>}
      {sessionUser ? null : <Redirect exact to="/" />}
      </div>
      
    <Footer/>
      </div>
      
  {/* </div> */}
  
  </>
  )
}




export default MainPage;
