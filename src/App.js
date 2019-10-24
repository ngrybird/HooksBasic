import React, {useReducer, useContext, useEffect, useRef} from 'react';
import logo from './logo.svg';
import './App.css';
function AppReducer(state, action){
  switch(action.type){
    case 'reset' : {
      return action.payload;
    }
    case 'setText' : {
      return state.map(item => {
        if(item.id === action.payload.id){
          return {
            ...item,
            text : action.payload.text
          }
        }
        return item;
      })
    }
    case 'add':{
      return [
        ...state,
        {
          id : Date.now(),
          text : '',
          completed: false
        }
      ]
    }
    case 'delete': {
      return state.filter(item => item.id !== action.payload);
    }
    case 'completed': {
      return state.map(item =>{
        if(item.id === action.payload){
          return {
            ...item,
            completed : !item.completed,
          };
        }
        return item;
      });
    }
    default:{
      return state;
    }
  }
}

const Context = React.createContext();
function App() {
  const [state, dispatch] = useReducer(AppReducer, []);
  const didRun = useRef(false)
  useEffect(()=>
    {
      if(!didRun.current){
        const raw = localStorage.getItem('data');
        dispatch({type : 'reset', payload : JSON.parse(raw)})
        didRun.current = true;
      }

    }
  );

  useEffect(
    () => {
      localStorage.setItem('data',JSON.stringify(state));
    },[state]
  );
  return (
    <Context.Provider value = {dispatch}>
      <div className="App">
        <h1>Todo App</h1>
        <button onClick= {()=> dispatch({type : 'add'})}>New Todo</button>
        <TodoList items={state}></TodoList>
      </div>
    </Context.Provider>
  );
}
function TodoList({items}){
  return items.map(
    item =>(
      <TodoItem key={item.id} {...item}></TodoItem>
      
    ) 
    );
}
function TodoItem({id, completed, text}){
  const dispatch = useContext(Context);
  return (
     <div> 
      <input type="checkbox" checked={completed} onChange = {() => {dispatch({type : 'completed', payload: id} )}}/>
      <input type="text" defaultValue= {text} onChange = {(e) => { dispatch({type : 'setText' , payload : {id : id, text : e.target.value}})}}/>
      <button onClick = {() => {dispatch({type : 'delete', payload : id})}}>Delete</button>
     </div>
  )
}

export default App;
