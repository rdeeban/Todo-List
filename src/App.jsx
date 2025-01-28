import './App.css';

function AddToTODO() {
    function handleClick() {
        if(document.querySelector('#newtask input').value.length == 0){
            alert("Please enter a task name.")
        } else{
            document.querySelector('#tasks').innerHTML += `
                <div class="task">
                    <span id="taskname">
                        ${document.querySelector('#newtask input').value}
                    </span>
                    <button class="delete">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </div>
            `;

            let current_tasks = document.querySelectorAll(".delete");
            for(let i=0; i<current_tasks.length; i++){
                current_tasks[i].onclick = function(){
                    this.parentNode.remove();
                }
            }
        }
    }

    return (
        <button onClick={handleClick}>Add</button>
    );
}

function App() {
  return (
      <div className="container">
        <div id="newtask">
          <input type="text" placeholder="Add to TODO"/>
            <AddToTODO />
        </div>
        <div id="tasks"></div>
      </div>
  );
}

export default App;
