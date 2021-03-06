import React from 'react';
import Todo from './components/Todo.jsx'
import moment from 'moment';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      inputClass: 'hidden',
      newButtonClass: '',
      inputVal: '',
      statuses: []
    }

    this.addTodo = this.addTodo.bind(this);
    this.newTodo = this.newTodo.bind(this);
    this.toggleInput = this.toggleInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch('http://localhost:8000/todos', {
      method: 'get',
      mode: 'cors'
    }).then(response=> {
      return response.json()
    })
    .then(responseData=> {
      let data = responseData
      return this.setState({data: data});
    });

    fetch('http://localhost:8000/status', {
      method: 'get',
      mode: 'cors'
    }).then(response=> {
      return response.json()
    })
    .then(responseData=> {
      responseData.forEach((element)=> this.state.statuses.push(element.display_value));

      return this.setState(this.state);
    });
  }

  newTodo(contents) {
    if (this.state.inputVal) contents = this.state.inputVal;
    this.addTodo(contents);

    this.state.inputVal = ''
    this.setState(this.state);
    this.toggleInput();
  }

  addTodo(contents, date) {
    let timestamp = date;

    // prepare the body for the post
    let body = JSON.stringify({
      status: 1,
      contents: contents, 
      created_at: timestamp
    });

    fetch('http://localhost:8000/todos/new', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: body
    }).then(response=> {
      return response.json()
    })
    .then(responseData=> {
      this.state.data.push(responseData);
      console.log("got a response back!", responseData)
      this.setState(this.state);
    });
  }

  updateTodo(id, status) {
    let status_id = status + 1;
    let body = JSON.stringify({
      status: status_id
    });

    fetch(`http://localhost:8000/todos/${id}`, {
      method: 'post',
      mode: 'cors',
      cache: 'default',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: body
    }).then(response=> {
      return response.json()
    })
    .then(responseData=> {
      return responseData;
    });
  }

  handleChange(event) {
    this.setState({inputVal: event.target.value});
  }

  toggleInput() {
    if (this.state.inputClass === '') {
      this.setState({inputClass: 'hidden', newButtonClass: ''});
    } else {
      this.setState({inputClass: '', newButtonClass: 'hidden'});
    }
  }

  renderTodos() {
    return(
      <div>
        {this.state.data.map((todo, index)=> (
          <Todo data={todo} statuses={this.state.statuses} key={index} addTodo={this.addTodo} updateTodo={this.updateTodo} />
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-offset-2">
            <div className="left-margin">
              <header>
                <img src="slug.png" id="logo" />
                <h2>Slug Journal</h2>
                <div className="new-todo">
                  <div className={this.state.newButtonClass}>
                    <button className="btn" onClick={()=> this.toggleInput()}>
                      <i className="fa fa-plus-circle fa-2x" />
                    </button>
                  </div>
                  <div className={this.state.inputClass}>
                    <div className="row">
                      <div>
                        <label className="">What do you need to do?</label>
                        <input className="" type="text" width="100%" value={this.state.inputVal} onChange={this.handleChange} />
                        <button onClick={()=> this.toggleInput()} type="button" className="btn btn-danger" aria-label="Close"><i className="fa fa-times-circle fa-lg" /></button>
                        <button type="button" className="btn btn-success" onClick={()=> this.newTodo()}><i className="fa fa-check-circle fa-lg" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </header>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-offset-2">
            <div className="page-lines">
              <div  className="left-margin">
                <h3>{moment(Date.now()).format('MMMM Do YYYY')}</h3>
              </div>
            </div>
          </div>
        </div>
        {this.renderTodos()}
      </div>
    );
  }
}

export default App;
