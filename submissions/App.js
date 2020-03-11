import React, { Component } from 'react';
import paginate from 'paginate-array';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      size: 5,
      page: 1,
      currPage: null,
      isLoaded: false
    }

    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch(`https://jsonplaceholder.typicode.com/todos`)
      .then(response => response.json())
      .then(todos => {
        const { page, size } = this.state;

        const currPage = paginate(todos, page, size);

        this.setState({
          ...this.state,
          todos,
          currPage,
          isLoaded: true
        });
      });
  }

  previousPage() {
    const { currPage, page, size, todos } = this.state;

    if (page > 1) {
      const newPage = page - 1;
      const newCurrPage = paginate(todos, newPage, size);

      this.setState({
        ...this.state,
        page: newPage,
        currPage: newCurrPage
      });
    }
  }

  nextPage() {
    const { currPage, page, size, todos } = this.state;

    if (page < currPage.totalPages) {
      const newPage = page + 1;
      const newCurrPage = paginate(todos, newPage, size);
      this.setState({ ...this.state, page: newPage, currPage: newCurrPage });
    }
  }

  handleChange(e) {
    const { value } = e.target;
    const { todos, page } = this.state;

    const newSize = +value;
    const newPage = 1;
    const newCurrPage = paginate(todos, newPage, newSize);

    this.setState({
      ...this.state,
      size: newSize,
      page: newPage,
      currPage: newCurrPage
    });
  }

  render() {
    const { page, size, currPage, isLoaded } = this.state;
    if(!isLoaded) {
      return <div>Loading...</div>
    } else return (
      <div>
        <div>page: {page}</div>
        <div>size: {size}</div>
        <div>
          <label for="size">Size</label>
          <select name="size" id="size" onChange={this.handleChange}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
        </div>
        {currPage &&
          <div>
            {currPage.data.map(todo => 
              <div key={todo.id} style={{width: "400px", height: "100px", border: "0.1px solid #000", textAlign: "center", verticalAlign: "middle", lineHeight: "100px", backgroundColor: "#FFFF", borderRadius: "10px", marginBottom: "20px", boxShadow: "0px 4px 1px rgba(0, 0, 0, 0.25)", fontFamily: "Montserrat", fontStyle: "normal", fontWeight: "bold", fontSize: "20px", position: "relative", left: "0%", right: "0%", top: "0%", bottom: "0%"}}>
                <span className="dot" style={{height: "60px", width: "60px", backgroundColor: todo.completed ? "#008F7A" : "#EBEBEB", borderRadius: "50%", display: "inline-block", verticalAlign: "middle", lineHeight: "100px", left: "6%", right: "79%", top: "20%", bottom: "20%", position: "absolute"}}></span>
                  <div style = {{width: "250px",  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: "100px", position: "absolute", left: "25%", right: "0%", top: "0%", bottom: "38%"}}>{todo.title}</div>
                </div>)}
              </div>
        }
        <button onClick={this.previousPage}>Previous Page</button>
        <button onClick={this.nextPage}>Next Page</button>
      </div>
    )
  }
}

export default App;