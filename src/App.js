import { Heading } from '@chakra-ui/react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import { VStack, IconButton, useColorMode, Spinner,Stack,Grid,GridItem,StackDivider } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Web3 from "web3";
import Contract from './contract/Todo.json';
import { FaEthereum } from 'react-icons/fa';


function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  

  const connect = async() => {
      if (window.ethereum) {
        let web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const cnt = new web3.eth.Contract(
              Contract,
              "0x50596A2246097681B9a9bD766E3BCB8779e79Fee"
            );
            console.log(accounts)
            let count=await cnt.methods.taskCount().call();
            // console.log(count)
            
           
            var arr=[];
            for(var i=1;i<=count;i++)
            { 
              
              var task=await cnt.methods.tasks(i).call();
              var content={
                id:i,
                body:task[1]
              };
              console.log(content);
              arr.push(content);
            }
            console.log(arr);
            setTodos(arr);
            setLoading(false);
            
        } catch (err) {
          console.log("Something went wrong.")
        }
      } else {
        console.log("Metamask not installed")
      }
    };



  useEffect(() => {
    connect();
  }, []);

  async function deleteTodo(id) {
    setLoading(true);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    let web3 = new Web3(window.ethereum);
    const cnt = new web3.eth.Contract(
      Contract,
      "0xC4A08922c8eF5fd6D5D35Ee84fbF80a072112A04"
    );
    const newTodos = todos.filter((todo) => {
      return todo.id !== id;
    });
    await cnt.methods.toggleCompleted(id).send({ from: accounts[0]});
    setTodos(newTodos);
    setLoading(false);
  }

  function addTodo(todo) {
    setTodos([...todos, todo]);
  }



  return (
    <>
    {loading ? (
      <VStack p={4}
      spacing={4}
      
    >
     <Spinner size='xl'/>
     <Heading
      mb='4'
      fontWeight='extrabold'
      size='xl'
      bgGradient='linear(to-l, #7928CA, #FF0080)'
      bgClip='text'
      h="100px"
    >
      Loading 
    </Heading>
  
    </VStack>


    )
    :
    
    (<VStack p={4}>
      <Heading
        mb='4'
        fontWeight='extrabold'
        size='2xl'
        bgGradient='linear(to-l, #7928CA, #FF0080)'
        bgClip='text'
      >
        Todo List
      </Heading>
      <IconButton
            icon={<FaEthereum />}
            isRound='true'
          />
      <TodoList todos={todos} deleteTodo={deleteTodo} />
      <AddTodo addTodo={addTodo} setLoading={setLoading} />
    </VStack>
    )
    }
    </>
  );
}

export default App;
